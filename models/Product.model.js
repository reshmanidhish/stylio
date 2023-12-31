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
    },

    product_category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    dimensions: {
      
        type: String,
        
    },

    brand_name: {
      type: String,
    },

    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    material: {
      type: String,
      required: true,
    },

    color: {
      type: String,
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
