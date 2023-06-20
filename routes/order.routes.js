const express = require("express");
const router = express.Router();
const Order = require("../models/Order.model");
const User = require("../models/User.model");





router.get('/c', async (req, res, nex)=> {
    try{

    }
catch(err){
    console.log('  ',err)
}
});


router.post('/category', async (req, res, nex)=> {
    try{

    }
catch(err){
    console.log(' error ',err)
}
});


module.exports = router;