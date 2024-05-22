let mongoose = require("mongoose");
let moment = require('moment');
let burgerOrderSchema = mongoose.Schema({
  uid: String,
  day: Date,
  prezzo: Number,
  createdAt: { type: Date, default: ()=> moment() },
  completedAt:{ type: Date },
  visibility: {type: Boolean, default: true},
  completed: {type: Boolean, default: false},
  actualOrder: JSON,
  priority: {type: Boolean, default: false},
  staff: {type: Boolean, default: false},
  paymentMethod: {type: String, enum: ['cash', 'card', 'other'], default: 'cash'}
});

var Burger_order = mongoose.model("Burger_order", burgerOrderSchema);

module.exports = Burger_order;

