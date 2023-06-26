const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const fileUploader = require("../config/cloudinary.config");

router.get("/create", async (req, res, nex) => {
  try {
    const categoryDB = await Category.find();
    res.render("product/create", { categoryDB });
  } catch (err) {
    console.log("error while looking up category in DB", err);
  }
});

router.post('/create', fileUploader.single('image'), async (req, res, next)=> {
  try {
    console.log(req.file)
const {name, description, product_category, dimension, brand_name, price, material, quantity, care_instructions, discount, created_date, updated_date} = req.body;
const creatProductDB = await Product.create({name, description, product_category, dimension, image:req.file.path, brand_name, price, material, quantity, care_instructions, discount, created_date, updated_date})
console.log(creatProductDB)
res.redirect('/' )
  }
  catch(err){
      console.log('error while posting product in DB', err)
  }
});

router.get("/search", async (req, res, nex) => {
  try {
    const searchQuery = { name: { $regex: req.query.name, $options: "i" } }; // using regex for searching case insensitively
    const searchResults = await Product.find(searchQuery);
    console.log(searchResults);
    res.render("product/search", { searchResults });
  } catch (err) {
    console.log("error while searching", err);
  }
});

router.get("/view/:productId", async (req, res, next) => {
  try {
   const product = await Product.findOne({ _id: req.params.productId });
   console.log("product=====>{}", product);
    res.render("product/view",{product});
  } catch (err) {
    console.log("while rendering allproduct", err);
  }
});








// router.get("/allproduct/:productId", async (req, res, next) => {
//   try {
//     const foundproductDB = Product.findOne(req.params.productId);
//     console.log(foundproductDB);
//     res.render("allproduct", { name: foundproductDB.body.name });
//   } catch (err) {
//     console.log("while rendering allproduct", err);
//   }
// });

module.exports = router;
