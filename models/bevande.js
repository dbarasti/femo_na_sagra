var mongoose = require("mongoose");

var BevandeSchema = mongoose.Schema({
  id: Number,	//giorno
  BA: {type: Number, default:0}, //birra artigianale
  BB: {type: Number, default:0},	//birra bionda alla spina
  BR: {type: Number, default:0},    //birra rossa alla spina
  CC: {type: Number, default:0},	//cocacola alla spina
  AQ: {type: Number, default:0},	//Acqua minerale in bottiglia
  totale: {type: Number, default:0}
});

var Bevande = mongoose.model("Bevande", BevandeSchema);

module.exports = Bevande;

