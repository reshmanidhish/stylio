const express = require("express");
const router = express.Router();
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const Category = require("../models/Category.model");

router.get("/checkout", async (req, res) => {
  const categories = await Category.find();
  let {currentUser, cartItems, subTotal} = req.session
  res.render("order/checkout", { categories,cartItems,subTotal,currentUser});
});

router.post("/checkout", async (req, res, nex) => {
  try {
    const {
      total_amount,
      payment_method,
    transaction_date,
      shipping_address,
      currency,
    } = req.body;

    const orderCheckout = await Order.create({
      total_amount,
      payment_method,
      transaction_date,
      shipping_address,
      currency,
    });
    console.log(orderCheckout);
    res.render("/");
  } catch (err) {
    console.log(" error ", err);
  }
});



// const express = require("express");
// const path = require('path');
// const app = express();
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51NP0j6KEh5hipHMp2btFcPWWvjon3KSS5Q7UBsUA8Ym1l76HBp188JyX1b9d7mqs1VOGTv3FG37Y3Z1gnhCXxJai00bMhZaP6r');

// app.use(express.static("public"));
// app.use(express.json());

const calculateOrderAmount = (amount) => { //39.00 => 3900
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  //return 40000; //=> 400.00
  try {
    if(amount) {
      return amount*100
    }
  } catch(e) {}
  return 100;
};



router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  let { subTotal } = req.session;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(subTotal),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

router.get("/paymentStatus",async (req, res) => {
  const categories = await Category.find();
  let {currentUser, cartItems} = req.session
  res.render("order/paymentStatus", { categories,cartItems:[],subTotal:0,currentUser});
})

module.exports = router;
