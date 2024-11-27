const mongoose = require("mongoose");
const Joi = require("joi");
const logSchema = new mongoose.Schema({
  moverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MagicMover",
    required: true,
  },
  itemIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "MagicItem",
    default: [],
  },
  action: {
    type: String,
    enum: ["loading", "on-mission", "resting"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const moverActivityLog = mongoose.model("moverActivityLog", logSchema);

module.exports = { moverActivityLog };
