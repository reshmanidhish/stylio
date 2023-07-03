const express = require('express');
const router = express.Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Category = require('../models/Category.model');


/* GET home page */
router.get("/", async (req, res, next) => {
  try {
   let {cartItems, currentUser}=req.session
    const categories = await Category.find(); 
    console.log('currentUser----home--->{}', currentUser)
    if(currentUser){
      res.render('index', { currentUser, categories, cartItems })
     }else{
      res.render("index", { categories, cartItems } );
     }
  }
   catch(err){
    console.log('error while rendering index', err)
  }
});


router.get("/view-details/:catergoryName", async (req, res, next)=> {
  try {
      const {catergoryName} = req.params;
  const categoryDB = await Category.find({catergoryName: 'pillow'})
  console.log('category seen',categoryDB)
 res.render('category/view-details', { categoryDB })

  }
  catch(err){
      console.log('error while looking up category  view by id in DB', err)
    }
});

module.exports = router;
