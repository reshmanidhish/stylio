const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    name: { type: String },
    description: { type: String },
    created_date: { type: Date},
    updated_date: {type: Date}
  });

const Category = model("Category", categorySchema);

module.exports = Category;
