const asyncHandler = require("express-async-handler");
const { MagicItem, validateAddItem } = require("../models/magicItem");
/**-----------------------------------------------
 * @desc    Add New Magic Item
 * @route   /api/item/add
 * @method  POST
 * @access  puplic
 ------------------------------------------------*/
module.exports.addItemCtrl = asyncHandler(async (req, res) => {
  // 1. Validation for data
  const { error } = validateAddItem(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 2. Add Item
  let newMagicItem = new MagicItem(req.body);
  await newMagicItem.save();
  res.status(201).json(newMagicItem);
});
