var mongoose = require("mongoose");

var burgerStatsSchema = mongoose.Schema({
  id: Number, //giorno
  parziale: Number
});

var Burger_stats = mongoose.model("Incasso", burgerStatsSchema);

module.exports = Burger_stats;

