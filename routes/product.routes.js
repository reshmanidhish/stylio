const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");
const isLoggedIn = require("../middleware/isLoggedIn");



router.get("/create", async (req, res, nex) => {
  try {
    if (req?.session?.currentUser) {
      if (req.session.currentUser.userType === "admin") {
        const categories = await Category.find(); 
        res.render("product/create", { categories });
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

// Need to check
// router.post(
//   "/create",
//   fileUploader.single("product-image-cover"),
//   async (req, res, next) => {
//     try {
//       if (req?.session?.currentUser) {
//         if (req.session.currentUser.userType === "admin") {
//           const productDetails = await Product.findOne({
//             _id: req.params.productId,
//           }); //get the product
//           const categoryDB = await Category.find(); //get the category

//           let product = { details: productDetails, category: categoryDB };

//           res.render("product/update", { product });
//         } else {
//           res.redirect("/");
//         }
//       } else {
//         res.redirect("/");
//       }
//     } catch (err) {
//       console.log("error while looking up category in DB", err);
//     }
//   }
// );

router.post("/create", fileUploader.single("image"), async (req, res, next) => {
  try {
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

    console.log("creatProductDB", creatProductDB )
    res.redirect("/");
  } catch (err) {
    console.log("error while posting product in DB", err);
  }
});

router.get("/search", async (req, res, nex) => {
  try {
    const searchQuery = { name: { $regex: req.query.name, $options: "i" } }; // using regex for searching case insensitively
    const searchResults = await Product.find(searchQuery);
    const categories = await Category.find(); 
    res.render("product/search", { searchResults, categories });
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
    const categories = await Category.find(); 
    res.render("product/view", { product, categories });
  } catch (err) {
    console.log("while rendering view", err);
  }
});

router.get("/", async (req, res) => {
  try {

    let currentUser = {} 
    if(req.session.currentUser){
      currentUser = await User.findOne({email: req.session.currentUser.email})
      currentUser.loggedIn = true;
    }

    const categories = await Category.find(); 
    const { category } = req.query;
    if (category) {
      const allProductsDB = await Product.find({ product_category: category });
      res.render("product/allproduct", { allProductsDB, categories, currentUser });
    } else {
      const allProductsDB = await Product.find();
      res.render("product/allproduct", { allProductsDB, categories, currentUser });
    }
  } catch (err) {
    console.log("while rendering allproduct", err);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const categories = await Category.find(); 
    const productByIdDB = await Product.findById(req.params.id).populate(
      "product_category"
    );
    res.render("product/edit-product", { productByIdDB, categories });
  } catch (err) {
    console.error("while getting edit page", err);
  }
});

router.post("/:id/edit", isLoggedIn, async (req, res, next) => {
  try {
    if (req.session.currentUser) {
      const { id } = req.params;
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
      const updateProduct = await Product.findByIdAndUpdate(id, {
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
      updateProduct.loggedIn = true;
      res.redirect("/allproduct");
    } else {
      const categories = await Category.find(); 
      res.render("product/create",  {categories});
    }
  } catch (err) {
    console.log("while", err);
  }
});

router.get("/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    const categories = await Category.find(); 
    res.render("product/delete", { id, categories });
  } catch (err) {
    console.log("while", err);
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndRemove(req.params.id);
    res.redirect("/product");
  } catch (err) {
    console.log("", err);
  }
});

router.get("/add-to-cart/:productId", async (req, res, nex) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    const { cartItems } = req.session;
    if (cartItems) { // if items is already available cart
      cartItems.push(product);
      req.session.cartItems = cartItems; // updating cartItems in the session
    } else {
      const newCartItems = []; // create a ne cart array
      newCartItems.push(product); // add the product
      req.session.cartItems = newCartItems; // adding a new cartItems in the session
    }
    const allCartItems = req.session.cartItems
    const subTotal= allCartItems.reduce(function(accumulator, product){
      return accumulator + product.price
    },0 );
    req.session.subTotal = subTotal
    res.redirect("/product/added-to-cart"); // to change the url with params
  } catch (err) {
    console.log("error", err);
  }
});

router.get("/added-to-cart", async (req, res, nex) => {
  const { cartItems, subTotal } = req.session;
  const categories = await Category.find(); 
  res.render("product/add-to-cart", { cartItems, subTotal, categories });
});

router.get("/view-cart", async (req, res) => {
  const categories = await Category.find(); 
  let { cartItems, subTotal } = req.session;
  if(!subTotal) {
    subTotal = 0
  }
  res.render("product/view-cart",{ cartItems, subTotal, categories});
});

router.get("/checkout", async(req, res) => {
  const categories = await Category.find(); 
  res.render("product/checkout", {categories});
});

module.exports = router;
