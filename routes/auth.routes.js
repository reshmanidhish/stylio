const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Category = require("../models/Category.model");
// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require("../config/cloudinary.config");

// GET /auth/register

router.get("/register", async (req, res, next) => {
  const categories = await Category.find();
  if (req?.session?.currentUser) {
    res.redirect("/auth/profile");
  } else {
    res.render("auth/register", { loggedIn: true, categories });
  }
});



router.post("/register", fileUploader.single("register-image-cover"), async (req, res, next) => {
  console.log(req.body)
  const categories = await Category.find();
  try {
    const { firstName, lastName, city_state , email, password ,address, phoneNumber} = req.body;

    if (email === "" || password === "") {
      res.status(400).render("auth/register", {
        categories,
        errorMessage:
          "All fields are mandatory. Please provide your username, email and password.",
      });
      return;
    }
    

    if (password.length < 6) {
      
      res.status(400).render("auth/register", {
        categories,
        errorMessage: "Your password needs to be at least 6 characters long.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedpassword = await bcrypt.hash(password, salt);
    const userFromDB = await User.create({
      email,
      firstName,
      lastName,
      address,
      phoneNumber,
      imageURL: req.file.path,
      city_state,
      userType: "customer",
      password: hashedpassword,
    });

    req.session.currentUser = { email,imageURL:req.file.path, firstName, lastName,address,phoneNumber, loggedIn:true};
    
    res.redirect(`/auth/profile`);
  } catch (error) {
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



router.get("/profile",  isLoggedIn, async (req, res, next) => {
  try {//totalOrders
    let{currentUser,cartItems,subTotal}=req.session
    const categories = await Category.find()
      const findUserfromDB = await User.findOne({
        email: req.session.currentUser.email,
      });
       if(findUserfromDB){
        res.render("auth/profile", {findUserfromDB, categories, currentUser,cartItems,subTotal});
       }else{
        res.render("index", { categories, cartItems,subTotal } );
       }
  } catch (err) {
    console.log("error while rendering profile", err);
  }
});


router.get("/:id/edit", isLoggedIn, async (req, res, next)=> {
  try {
    let{currentUser,cartItems,subTotal}=req.session
  const categories = await Category.find()
  const profilebyId = await User.findById(req.params.id)
  profilebyId.loggedIn = true
  res.render("auth/edit-profile", {profilebyId, categories, currentUser,cartItems,subTotal})

  }catch (err) {
    console.log("error while rendering profile edit", err);
  }
})

router.post("/:id/edit", fileUploader.single("product-image-cover"), isLoggedIn, async (req, res, next) => {
  try {
    if(req.session.currentUser) {
      const {id} = req.params
  const { firstName, lastName, email, password ,address, phoneNumber} = req.body;
    const profileEdit = await User.findByIdAndUpdate(id, { firstName, userType: "customer",  lastName, email, password ,address, phoneNumber})
    res.redirect("/auth/profile")
  } else {
    res.render("auth/edit-profile", {profileEdit})
  }
  } catch (err) {
    console.log("error while rendering profile post", err);
  }
})

// GET /auth/login
router.get("/login", isLoggedOut, async(req, res) => {
  const categories = await Category.find();
  if (req.session.currentUser) {
    res.render("auth/login", { categories });
  } else {
    res.render("auth/login", { categories });
  }
});

// POST /auth/login
router.post("/login", isLoggedOut, async (req, res, next) => {
  const categories = await Category.find();
  try {
    const { username, email, password } = req.body;

    if (username === "" || email === "" || password === "") {
      res.status(400).render("auth/login", {
        categories,
        errorMessage:
          "All fields are mandatory. Please provide username, email and password.",
      });
      return;
    }
    if (password.length < 6) {
      return res.status(400).render("auth/login", {
        categories,
        errorMessage: "Your password needs to be at least 6 characters long.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.render("auth/login", { errorMessage: "Wrong credentials." });
      return;
    } else if (bcrypt.compare(password, user.password)) {
      const currentUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        loggedIn: true
      }
  
      req.session.currentUser = currentUser
      res.redirect("/auth/profile");
    } else {
      res.render("auth/login", { errorMessage: "Wrong credentials." });
    }
  }catch (err) {
    console.log("error while login ", err);
  }
});


router.get("/:id/login",isLoggedIn, async (req, res, next)=> {
  try {
 if(req.session.currentUser) {
  const categories = await Category.find()
  const byId = await User.findById(req.params.id)
  byId.loggedIn = true
  res.render("auth/login-details", {byId, categories })
 }
  }catch (err) {
    console.log("error while getting edit", err);
  }
})



router.post("/:id/login", async (req, res, next)=> {
  try {
    const {id} = req.params
    const {email, password} = req.body;
    const updatecurrentUser = await User.findByIdAndUpdate(id, {email, password})
    updatecurrentUser.loggedIn =true
    if(updatecurrentUser) {
      res.redirect("/auth/profile")
    }else{
      res.render("auth/login-details")
    }
  } catch (err) {
    console.log("error while updating", err);
  }
});



router.get("/:id/imag",isLoggedIn, async (req, res, next)=> {
  try {
 if(req.session.currentUser) {
  const categories = await Category.find()
  const editImag = await User.findById(req.params.id)
  editImag.loggedIn = true
  res.render("auth/imag-edit", {editImag, categories })
 }
  }catch (err) {
    console.log("error while getting edit", err);
  }
});






router.post("/:id/imag", fileUploader.single("image-cover"), isLoggedIn, async (req, res, next)=> {
  try {
    const {id} = req.params
    const imageUpdate = await User.findByIdAndUpdate(id, { imageURL: req.file.path,})
    imageUpdate.loggedIn =true
    if(imageUpdate) {
      res.redirect("/auth/profile")
    }else{
      res.render("auth/imag-details")
    }
  } catch (err) {
    console.log("error while updating image", err);
  }
})




// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/auth/login");
  });
});


module.exports = router;
