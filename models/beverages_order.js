let mongoose = require("mongoose");
let moment = require('moment');
let beveragesOrderSchema = mongoose.Schema({
  uid: String,
  day: Date,
  prezzo: Number,
  createdAt: { type: Date, default: ()=> moment() },
  completedAt:{ type: Date },
  visibility: {type: Boolean, default: true},
  actualOrder: JSON,
  priority: {type: Boolean, default: false},
  staff: {type: Boolean, default: false},
  paymentMethod: {type: String, enum: ['cash', 'card', 'other'], default: 'cash'}

});

let Beverages_order = mongoose.model("Beverages_order", beveragesOrderSchema);

module.exports = Beverages_order;

