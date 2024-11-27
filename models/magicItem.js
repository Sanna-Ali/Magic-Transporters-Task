const mongoose = require("mongoose");
const Joi = require("joi");
const magicItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  moverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MagicMover",
    default: null,
  },
});
// Validate Add Magic Item
function validateAddItem(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    weight: Joi.number().required(),
  });
  return schema.validate(obj);
}

const MagicItem = mongoose.model("MagicItem", magicItemSchema);

module.exports = { MagicItem, validateAddItem };
