var mongoose = require("mongoose");
var moment = require('moment');
var barSchema = mongoose.Schema({
  uid: { type: String },
  id: { type: Number}, //required: true
  nome: { type: String}, //required: true
  giorno: Number,
  prezzo: {type: Number}, //required: true
  priority: String,
  createdAt: { type: Date, default: moment() },
  BAB: {type: Number, default:0}, //birra artigianale bianca alla spina
  BB: {type: Number, default:0},  //birra bionda alla spina
  BAR: {type: Number, default:0}, //birra artigianale rossa alla spina
  CC: {type: Number, default:0},  //cocacola alla spina
  AQ: {type: Number, default:0},  //Acqua minerale in bottiglia
  visibility: { type: Boolean }

});

var Bar = mongoose.model("Bar", barSchema);

module.exports = Bar;

