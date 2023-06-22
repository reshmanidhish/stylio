const express = require('express');
const router = express.Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");


/* GET home page */
router.get("/", isLoggedIn, async (req, res, next) => {
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


module.exports = router;
