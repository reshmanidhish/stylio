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

// GET /auth/register

router.get("/register", async (req, res, next) => {
  const categories = await Category.find();
  if (req?.session?.currentUser) {
    res.redirect("/auth/profile");
  } else {
    res.render("auth/register", { loggedIn: true, categories });
  }
});

router.post("/register", async (req, res, next) => {
  const categories = await Category.find();
  try {
    const { firstName, lastName, email, password ,address,phoneNumber} = req.body;
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
      userType: "customer",
      password: hashedpassword,
    });

    //req.session.currentUser = { email, firstName, lastName,address,phoneNumber};
    res.redirect('/auth/login');
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

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (req.session.currentUser) {
      const currentUser = await User.findOne({
        email: req.session.currentUser.email,
      });
      currentUser.loggedIn = true;
      res.render("auth/profile", {currentUser, categories});
    } else {
      res.render("auth/register",  {categories});
    }
  } catch (err) {
    console.log("error while rendering profile", err);
  }
});

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
      
      console.log('user=======> {}', currentUser)

      req.session.currentUser = currentUser
      res.redirect("/auth/profile");
    } else {
      res.render("auth/login", { errorMessage: "Wrong credentials." });
    }
  } catch (err) {}
});

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
