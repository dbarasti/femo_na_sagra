let mongoose = require("mongoose");

let beveragesStatsSchema = mongoose.Schema({
  day: Number,	//giorno
  BAB: {type: Number, default:0}, //birra artigianale bianca alla spina
  BB: {type: Number, default:0},	//birra bionda alla spina
  BAR: {type: Number, default:0},    //birra artigianale rossa alla spina
  CC: {type: Number, default:0},	//cocacola alla spina
  AQ: {type: Number, default:0},	//Acqua minerale in bottiglia
  total: {type: Number, default:0}
});

let Beverages_stats = mongoose.model("Beverages_stats", beveragesStatsSchema);

module.exports = Beverages_stats;

