const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    product_category: [{
        type: Schema.Types.ObjectId, ref: "Category" 
    }],

    dimensions: [{
      type: Object,
      required: true,
    }],

    brand_name: {
      type: String,
    },

   price: {
      type: Number,
      required: true,
    },

   image_name: {
      type: String,
    },

    image_path: {
      type: String,
      required: true,
    },

    material: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },
    quantity: {
        type: Number,
    },
    care_instructions: {
        type: String,
    },
    discount: {
        type: Number,
    },
    created_date: {
        type: Date,
    }, 
    updated_date: {
        type: Date,
    },

  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
