const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    user_type: {
      type: String,
      // required: true,
      unique: true,
    },

    shipping_address: {
      type: String,
      // required: true,
    },

    mobile_number: {
      type: Number,
      // required: true,
    },

    state: {
      type: String,
      // required: true,
    },

    country: {
      type: String,
      // required: true,
    },

    created_date: {
      type: Date,
    },

    updated_date: {
      type: Date,
    }

  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
