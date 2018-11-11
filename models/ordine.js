var mongoose = require("mongoose");
var moment = require('moment'); 
var yeast = require("yeast");
var ordineSchema = mongoose.Schema({
  uid: { type: String },
  id: { type: Number}, //required: true
  nome: { type: String}, //required: true
  asporto: { type: String},
  giorno: Number,
  prezzo: {type: Number}, //required: true
  priority: String,
  createdAt: { type: Date, default: moment() },
  carne: String,
  double: String,
  verdura1: String,
  verdura2: String,
  verdura3: String,
  verdura4: String,
  verdura5: String,
  verdura6: String,
  verdura7: String,
  salsa1: String,
  salsa2: String,
  salsa3: String,
  salsa4: String,
  visibility: { type: Boolean }

});

var Ordine = mongoose.model("Ordine", ordineSchema);

module.exports = Ordine;

