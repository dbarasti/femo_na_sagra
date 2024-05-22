let mongoose = require("mongoose");
let moment = require('moment');
let extraOrderSchema = mongoose.Schema({
    uid: String,
    day: Date,
    prezzo: Number,
    createdAt: { type: Date, default: ()=> moment() },
    completedAt:{ type: Date },
    visibility: {type: Boolean, default: true},
    completed: {type: Boolean, default: false},
    actualOrder: JSON,
    priority: {type: Boolean, default: false},
    staff: {type: Boolean, default: false},
    paymentMethod: {type: String, enum: ['cash', 'card', 'other'], default: 'cash'}
});

let Extra_order = mongoose.model("Extra_order", extraOrderSchema);

module.exports = Extra_order;

