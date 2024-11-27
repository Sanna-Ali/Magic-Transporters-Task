const magicMoverController = require("../controllers/moverController");
const express = require("express");
const router = express.Router();

// Magic Movers
router.get("/top", magicMoverController.getTopMoverCtrl);
router.post("/add", magicMoverController.addMoverCtrl);
router.post("/load", magicMoverController.loadMagicMoverCtrl);
router.post("/start", magicMoverController.startMagicMoverCtrl);
router.post("/end", magicMoverController.endMagicMoverCtrl);

module.exports = router;
