const magicItemController = require("../controllers/itemController");
const express = require("express");
const router = express.Router();

// Magic Movers
router.post("/add", magicItemController.addItemCtrl);

module.exports = router;
