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




router.get('/search', async (req, res, nex)=> {
    try{
    const data = await Product.find({name: req.query.name})
    console.log(data)
    res.render('product/search', {name: data})
    }
  catch(err){
    console.log('error while searching' ,err)
  }
  });


  router.get("/allproduct/:productId", async (req, res, next)=> {
    try{
const foundproductDB = Product.findOne(req.params.productId)
console.log(foundproductDB)
res.render("allproduct", {name: foundproductDB.body.name })
    }
    catch(err){
        console.log('while rendering allproduct' ,err)
    }
  })

module.exports = router;