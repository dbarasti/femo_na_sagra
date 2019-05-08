var mongoose = require("mongoose");

var beveragesStatsSchema = mongoose.Schema({
  id: Number,	//giorno
  BAB: {type: Number, default:0}, //birra artigianale bianca alla spina
  BB: {type: Number, default:0},	//birra bionda alla spina
  BAR: {type: Number, default:0},    //birra artigianale rossa alla spina
  CC: {type: Number, default:0},	//cocacola alla spina
  AQ: {type: Number, default:0},	//Acqua minerale in bottiglia
  totale: {type: Number, default:0}
});

var Beverages_stats = mongoose.model("Bevande", beveragesStatsSchema);

module.exports = Beverages_stats;

