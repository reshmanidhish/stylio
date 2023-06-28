const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");


router.get('/create', async (req, res, next) => {
    const categories = await Category.find();
    res.render('category/create', {categories})
})

router.post('/create', async (req,res, next)=> {
    try {
        const {name, description, created_date, updated_date } = req.body;
        const DBcategory = await Category.create({name, description, created_date, updated_date })
        res.redirect('/')
    }
    catch(err){
        console.log('error while looking up category in DB', err)
      }
})




module.exports = router;