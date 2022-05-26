let mongoose = require("mongoose");

let extrasStatsSchema = mongoose.Schema({
  day: Date,
  stats: JSON,
  total: {type: Number, default:0}
});

let Extras_stats = mongoose.model("Extras_stats", extrasStatsSchema);

module.exports = Extras_stats;

