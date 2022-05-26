let mongoose = require("mongoose");

let ingredientSchema = mongoose.Schema({
  type: String,
  id: String,
  name: String,
  price: Number,
  available: {type: Boolean, default: true}
});

let Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;

