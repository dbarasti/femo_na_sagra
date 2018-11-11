var mongoose = require("mongoose");

var IncassoSchema = mongoose.Schema({
  id: Number, //giorno
  parziale: Number
});

var Incasso = mongoose.model("Incasso", IncassoSchema);

module.exports = Incasso;

