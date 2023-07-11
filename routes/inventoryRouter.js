// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validateInv = require("../utilities/validateInv.js");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByVehicleInvId);
router.get("/add-classification", invController.buildAddClassification);

// post requests
router.post(
  "/add-classification",
  validateInv.classRules(),
  validateInv.checkClass,
  utilities.handleErrors(invController.AddClassification)
);

module.exports = router;
