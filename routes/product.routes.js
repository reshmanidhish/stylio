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



module.exports = router;