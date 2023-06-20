const express = require("express").Router()
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");



router.get('/product', async (req, res, nex)=> {
    try{

    }
catch(err){
    console.log('  ',err)
}
});


router.post('/product', async (req, res, nex)=> {
    try{

    }
catch(err){
    console.log(' error ',err)
}
});




module.exports = router;