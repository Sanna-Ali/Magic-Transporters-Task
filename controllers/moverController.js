const asyncHandler = require("express-async-handler");
const { MagicMover, validateAddMover } = require("../models/magicMover");
const { MagicItem } = require("../models/magicItem");
const { moverActivityLog } = require("../models/moverActivityLog");
/**-----------------------------------------------
 * @desc    Add New Magic Mover
 * @route   /api/mover/add
 * @method  POST
 * @access  puplic
 ------------------------------------------------*/
module.exports.addMoverCtrl = asyncHandler(async (req, res) => {
  // 1. Validation for data
  const { error } = validateAddMover(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 2. Add mover
  let newMagicMover = new MagicMover(req.body);
  await newMagicMover.save();
  res.status(201).json(newMagicMover);
});
/**-----------------------------------------------
 * @desc    Load a Magic Mover with items
 * @route   /api/mover/load
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.loadMagicMoverCtrl = asyncHandler(async (req, res) => {
  // 1. Retrieve item IDs and mover ID from the request body
  const itemIds = JSON.parse(req.body.itemIds);
  const { moverId } = req.body;
  // console.log(111ff${req.body.itemIds});
  let Items = [];
  itemIds.forEach((e) => {
    Items.push(e.id);
  });
  // 2. Check if the specified Magic Mover exists
  const mover = await MagicMover.findById(moverId);
  if (!mover) return res.status(404).json({ message: "Magic Mover not found" });

  // 3. Ensure Magic Mover is not currently on a mission
  if (mover.current_state === "on-mission") {
    return res
      .status(400)
      .json({ message: "Cannot load items in current state" });
  } else {
    // 4. Find items that match the requested IDs
    const items = await MagicItem.find({ _id: { $in: Items }, moverId: null });
    if (items.length === 0) {
      return res.status(400).json({ message: "Items already added to a move" });
    }
    console.log(items);
    // 5. Calculate the total weight of the items and check if it exceeds the mover's limit
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    console.log(totalWeight);
    // If the mover is currently resting:
    console.log(mover.current_state);
    if (mover.current_state === "resting") {
      if (totalWeight > mover.weight_limit) {
        return res.status(400).json({
          message: `The total weight of items ${totalWeight} is over the maximum weight ${mover.weight_limit} of mover `,
        });
      }
      // Update the mover's current load and state
      mover.current_load = totalWeight;
      mover.current_state = "loading";
      await mover.save();
    }
    // If the mover is already loading:
    else if (mover.current_state === "loading") {
      if (totalWeight > mover.weight_limit - mover.current_load) {
        return res.status(400).json({
          message: ` Mover is loaded now with weight ${
            mover.current_load
          } and The total weight of new items ${totalWeight} is over the available weight ${
            totalWeight - mover.current_load
          }`,
        });
      }
      // Update the mover's current load
      mover.current_load += totalWeight;
    }

    // 6. Update items to be associated with the specified mover
    await MagicItem.updateMany({ _id: { $in: Items } }, { moverId });
    await mover.save();

    // 7. Create an activity log entry for the loading process
    await moverActivityLog.create({ moverId, action: "loading", Items });
    //  8. Send a successful response
    res.status(200).json({ message: "Items loaded successfully" });
  }
});
/**-----------------------------------------------
 * @desc     A Magic Mover start mission
 * @route   /api/mover/start
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.startMagicMoverCtrl = asyncHandler(async (req, res) => {
  // 1. Retrieve mover ID from the request body
  const { moverId } = req.body;

  // 2. Check if the specified Magic Mover exists
  const mover = await MagicMover.findById(moverId);
  if (!mover) return res.status(404).json({ message: "Magic Mover not found" });

  // 3. Ensure the Magic Mover is currently in the "loading" state
  if (mover.current_state !== "loading") {
    return res
      .status(400)
      .json({ message: "Cannot start mission unless in loading state" });
  }

  // 4. Update the Magic Mover's state to "on-mission"
  mover.current_state = "on-mission";
  await mover.save();

  // 5. Log the activity in the database
  await moverActivityLog.create({ moverId, action: "on-mission" });

  //  6. Send a successful response
  res.status(200).json({ message: "Mission started successfully" });
});
/**-----------------------------------------------
 * @desc     A Magic Mover end mission
 * @route   /api/mover/end
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.endMagicMoverCtrl = asyncHandler(async (req, res) => {
  // 1. Retrieve item IDs and mover ID from the request body
  const { moverId } = req.body;

  // 2. Check if the specified Magic Mover exists
  const mover = await MagicMover.findById(moverId);
  if (!mover) return res.status(404).json({ message: "Magic Mover not found" });

  // 3. Ensure the Magic Mover is currently in the "on-mission" state
  if (mover.current_state !== "on-mission") {
    return res
      .status(400)
      .json({ message: "Cannot end mission unless on-mission" });
  }

  // 4. Unload the items by setting their moverId to null
  await MagicItem.updateMany({ moverId }, { moverId: null });

  // 5. Update the Magic Mover's state to "resting"
  mover.current_state = "resting";
  mover.completed_missions += 1; // Increment the count of completed missions
  mover.current_load = 0;
  await mover.save(); // Save changes to the database

  // 6. Log the activity in the database
  await moverActivityLog.create({ moverId, action: "resting" });

  // 7. Send a successful response
  res.status(200).json({ message: "Mission ended successfully" });
});
/**-----------------------------------------------
 * @desc     A Magic Mover end mission
 * @route   /api/mover/top
 * @method      GET
 * @access  public
 ------------------------------------------------*/
module.exports.getTopMoverCtrl = asyncHandler(async (req, res) => {
  // 1. Retrieve all Magic Movers and sort them by completed missions in descending order
  const topMovers = await MagicMover.find({}).sort({ completed_missions: -1 });

  // 2. Check if there are any movers in the database
  if (topMovers.length === 0) {
    return res.status(404).json({ message: "Magic Mover not found" });
  }

  // 3. Send the sorted list of top Movers as the response
  res.status(200).json(topMovers);
});
