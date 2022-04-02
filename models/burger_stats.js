let mongoose = require("mongoose");

let burgerStatsSchema = mongoose.Schema({
  day: Number,
  stats: JSON,
  total: {type: Number, default:0}
});

let Burger_stats = mongoose.model("Burger_stats", burgerStatsSchema);

module.exports = Burger_stats;

