const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");



router.get('/create',  (req, res, nex)=> {
   res.render("create-product")


});


router.post('/create',  (req, res, nex)=> {
//const {prouctName,productCategory,productImages,productPrice,quantity,color,productBrand,}=req.body
});




module.exports = router;