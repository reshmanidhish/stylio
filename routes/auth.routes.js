const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");


// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/register



router.get("/register", isLoggedOut, (req, res) => {
  if(req.session.currentUser){
    res.render("auth/register");
  }
  res.render("auth/register");
});




router.post("/register", isLoggedOut,  async (req, res) => {
try{
  const {username,   email,  password,   shipping_address,   mobile_number ,  state, country } = req.body;

  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/register", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/register", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
    return;
  }

  const salt = await bcrypt.genSalt(saltRounds)
  const hashedpassword = await bcrypt.hash(password, salt)
  const userFromDB = await User.create({username, email,  password: hashedpassword, shipping_address,  mobile_number ,  state, country })
  
  req.session.currentUser = {username, email}
  console.log("newely user was created", userFromDB)
  res.redirect(`/auth/profile`)

  }
  
    catch(error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/register", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/register", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
    }
  }
});



// router.get("/profile", async (req, res, next) => {
//   try {

// if(req.session.currentUser){
// const findUserfromDB = await User.findOne({username})
//    console.log(findUserfromDB)
//    findUserfromDB.loggedIn =true;
//    res.redirect('/auth/profile', findUserfromDB)
// }else{
//   res.render('auth/register')
// }
//   }
//   catch(err){
//     console.log('error while rendering profile', err)
// }
// });

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });
    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});





router.get('/search', isLoggedOut, async (req, res, nex)=> {
  try{
if(req.session.currentUser !== ""){
  const allProductDB = await User.find()
  console.log(allProductDB)
  // allProductDB.loggedIn = true;
  res.render('search', {allProductDB: allProductDB})
}else{
  res.render("search")
}
  }
catch(err){
  console.log('' ,err)
}
});


module.exports = router;
