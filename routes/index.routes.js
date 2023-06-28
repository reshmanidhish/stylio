const express = require('express');
const router = express.Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Category = require('../models/Category.model');


/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    if(req.session.currentUser){
      const currentuserDB = await User.findOne({email: req.session.currentUser.email})
      currentuserDB.loggedIn= true;
      res.render('index', currentuserDB)
     }else{
      res.render("index");
     }
  }
   catch(err){
    console.log('error while rendering index', err)
  }
});
 

// router.get('/view-details/catergoryName', async (req, res , next)=> {
//   try{
//     const {catergoryName} = req.params;
//   const allCategoryDB = await Category.find({catergoryName: "Shoe" })
//   res.render('layout', allCategoryDB)
//   }
//   catch(err){
//     console.log('error while ', err)
//   }
// });


router.get("/view-details/:catergoryName", async (req, res, next)=> {
  try {
      const {catergoryName} = req.params;
  const categoryDB = await Category.find({catergoryName: ''})
  console.log('category seen',categoryDB)
 res.render('category/view-details', { categoryDB })

  }
  catch(err){
      console.log('error while looking up category  view by id in DB', err)
    }
})

module.exports = router;
