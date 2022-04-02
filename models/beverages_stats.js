let mongoose = require("mongoose");

let beveragesStatsSchema = mongoose.Schema({
  day: Number,
  stats: JSON,
  total: {type: Number, default:0}
});

let Beverages_stats = mongoose.model("Beverages_stats", beveragesStatsSchema);

module.exports = Beverages_stats;

