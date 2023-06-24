const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    total_amount: { type: String },
    payment_method: { type: Number },
    transaction_number: { type: Number },
    transaction_date: { type: Date },
    shipping_address: { type: String },
    payment_status: { type: String },
    currency: { type: String },
    created_date: { type: Date},
    updated_date: {type: Date}
  });

const Order = model("Order", orderSchema);

module.exports = Order;