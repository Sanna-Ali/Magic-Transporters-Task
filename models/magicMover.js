const mongoose = require("mongoose");
const Joi = require("joi");
const magicMoverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  weight_limit: {
    type: Number,
    required: true,
  },
  current_state: {
    type: String,
    enum: ["resting", "loading", "on-mission"],
    default: "resting",
  },
  completed_missions: {
    type: Number,
    default: 0,
  },
  current_load: {
    type: Number,
    default: 0,
  },
});

// Validate Add Magic Mover
function validateAddMover(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    weight_limit: Joi.number().required(),
  });
  return schema.validate(obj);
}

const MagicMover = mongoose.model("MagicMover", magicMoverSchema);

module.exports = { MagicMover, validateAddMover };
