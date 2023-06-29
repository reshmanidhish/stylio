const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const fileUploader = require("../config/cloudinary.config");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/create", async (req, res, nex) => {
  try {
    if (req?.session?.currentUser) {
      if (req.session.currentUser.userType === "admin") {
        const categoryDB = await Category.find();
        res.render("product/create", { categoryDB });
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log("error while looking up category in DB", err);
  }
});

router.post('/create', fileUploader.single('product-image-cover'), async (req, res, next)=> {
  try {
    if (req?.session?.currentUser) {
      if (req.session.currentUser.userType === "admin") {
        
        
        const productDetails = await Product.findOne({ _id: req.params.productId }); //get the product
        const  categoryDB = await Category.find(); //get the category

        let product =  {details: productDetails, category: categoryDB}
        
        res.render("product/update", { product });
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log("error while looking up category in DB", err);
  }
});

router.post("/create", fileUploader.single("image"), async (req, res, next) => {
  try {
    console.log(req.file);
    const {
      name,
      description,
      product_category,
      dimension,
      brand_name,
      price,
      material,
      quantity,
      care_instructions,
      discount,
      created_date,
      updated_date,
    } = req.body;
    const creatProductDB = await Product.create({
      name,
      description,
      product_category,
      dimension,
      image: req.file.path,
      brand_name,
      price,
      material,
      quantity,
      care_instructions,
      discount,
      created_date,
      updated_date,
    });
    console.log(creatProductDB);
    res.redirect("/");
  } catch (err) {
    console.log("error while posting product in DB", err);
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



// router.get('/product-list', async (req,res , next)=> {
//   try {
// const allproduct = Product.find()
// res.render("product/product-list", allproduct)
//   }
//   catch (err) {
//     console.log("while rendering product-list", err);
//   }
// })


router.get("/view/:productId", async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    console.log("product=====>{}", product);
    res.render("product/view", { product });
  } catch (err) {
    console.log("while rendering view", err);
  }
});


router.get("/",async(req,res)=>{
  try{
const allProductsDB = await Product.find()
console.log(allProductsDB)
res.render("product/allproduct",{allProductsDB})
  }catch(err){
    console.log("while rendering allproduct", err); 
  }
})




router.get('/:id/edit', async (req, res, next)=> {
  try {
   let categoryListDB = await  Category.find()
  const productByIdDB = await Product.findById(req.params.id)
  .populate('product_category')
  console.log('error while getting edit product ',productByIdDB)
  res.render('product/edit-product', { productByIdDB, categoryListDB })

}
  catch (err) {
    console.log("while getting edit page", err);
  }
});


router.post('/:id/edit', isLoggedIn,  async (req, res, next) => {
try{
  if(req.session.currentUser){
    const {id} = req.params;
    const {name, description, product_category, dimension, brand_name, price, material, quantity, care_instructions, discount, created_date, updated_date} =req.body;
    const updateProduct = await Product.findByIdAndUpdate(id, {name, description, product_category, dimension, image:req.file.path, brand_name, price, material, quantity, care_instructions, discount, created_date, updated_date})
    updateProduct.loggedIn =true;
    console.log(updateProduct)
    res.redirect('/allproduct')
  }else{
    res.render('product/create')
  }

}
catch (err) {
  console.log("while", err);
}
});



router.get("/:id/delete", async (req, res, next)=> {
  try{
    const {id}= req.params;
  res.render('product/delete', {id})
  }
  catch (err) {
    console.log("while", err);
  }
});



router.post("/:id/delete", async (req,res) => {
  try {
const deleteProduct = await Product.findByIdAndRemove(req.params.id)
console.log("deleted", deleteProduct)
res.redirect('/product')

  }
  catch (err) {
    console.log("", err);
  }
})


router.get('view', async (req,res, next)=> {
  try {
  }
  catch (err) {
    console.log("", err);
  }
})

module.exports = router;
