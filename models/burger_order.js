var mongoose = require("mongoose");
var moment = require('moment');
var burgerOrderSchema = mongoose.Schema({
  uid: { type: String },
  id: { type: Number}, //AKA GIORNO todo refactor name
  giorno: Number,
  prezzo: {type: Number}, //required: true
  priority: String,
  createdAt: { type: Date, default: moment() },
  visibility: { type: Boolean },
  order: JSON

});

var Burger_order = mongoose.model("Burger_order", burgerOrderSchema);

module.exports = Burger_order;

