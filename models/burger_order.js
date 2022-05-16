let mongoose = require("mongoose");
let moment = require('moment');
let burgerOrderSchema = mongoose.Schema({
  uid: String,
  day: Date,
  prezzo: Number,
  createdAt: { type: Date, default: moment() },
  visibility: {type: Boolean, default: true},
  completed: {type: Boolean, default: false},
  actualOrder: JSON,
  priority: {type: Boolean, default: false},
  staff: {type: Boolean, default: false}
});

var Burger_order = mongoose.model("Burger_order", burgerOrderSchema);

module.exports = Burger_order;

