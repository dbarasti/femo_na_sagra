let mongoose = require("mongoose");
let moment = require('moment');
let burgerOrderSchema = mongoose.Schema({
  uid: String,
  day: Number,
  prezzo: Number,
  createdAt: { type: Date, default: moment() },
  visibility: Boolean,
  actualOrder: JSON,
  staff: {type: Boolean, default: false}
});

var Burger_order = mongoose.model("Burger_order", burgerOrderSchema);

module.exports = Burger_order;

