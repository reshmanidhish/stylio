const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");



router.get('/create', async  (req, res, nex)=> {
    try {
     const categoryDB = await Category.find()
        res.render("product/create", {categoryDB})
    }
  catch(err){
    console.log('error while looking up category in DB', err)
  }
});


router.post('/create', async (req, res, next)=> {
    try {
const {name, description, product_category, dimension, brand_name, price,image, material, quantity, care_instructions, discount, created_date, updated_date} = req.body;
 const creatProductDB = await Product.create({name, description, product_category, dimension, brand_name, price,image, material, quantity, care_instructions, discount, created_date, updated_date})
 console.log(creatProductDB)
res.redirect('/' )
    }
    catch(err){
        console.log('error while posting product in DB', err)
    }
});




// router.get('/search', async (req, res, nex)=> {
//     try{
//   if(req.session.currentUser !== ""){
//     const allProductDB = await Product.findOne({name: req.session.currentUser.name})
//     console.log(allProductDB)
//     allProductDB.loggedIn = true;
//     res.render('/form_search', allProductDB)
//   }else{
//     res.render("/form_search")
//   }
//     }
// catch(err){
//     console.log('' ,err)
// }
// });



router.get('/search', async (req, res, nex)=> {
    try{
        const {name} =req.params;
  if(req.session.currentUser !== ""){
    const allProductDB = await Product.findOne({name})
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