let mongoose = require("mongoose");
let moment = require('moment');
let beveragesOrderSchema = mongoose.Schema({
  uid: String,
  day: Number,
  prezzo: Number, //required: true
  createdAt: { type: Date, default: moment() },
  visibility: Boolean,
  actualOrder: JSON,
  priority: {type: Boolean, default: false},
  staff: {type: Boolean, default: false}
});

let Beverages_order = mongoose.model("Beverages_order", beveragesOrderSchema);

module.exports = Beverages_order;

