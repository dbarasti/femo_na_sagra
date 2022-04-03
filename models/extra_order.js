let mongoose = require("mongoose");
let moment = require('moment');
let extraOrderSchema = mongoose.Schema({
    uid: String,
    day: Date,
    prezzo: Number,
    createdAt: { type: Date, default: moment() },
    visibility: Boolean,
    actualOrder: JSON,
    priority: {type: Boolean, default: false},
    staff: {type: Boolean, default: false}
});

let Extra_order = mongoose.model("Extra_order", extraOrderSchema);

module.exports = Extra_order;

