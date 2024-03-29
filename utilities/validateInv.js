const { body, validationResult } = require("express-validator");
const utilities = require(".");

const validate = {};

validate.classRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlpha()
      .isLength({ min: 3 })
      .withMessage("Provide a valid classification name."),
  ];
};

// check data and return errors or continue
validate.checkClass = async (req, res, next) => {
  console.log(req.body);

  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.vehicleRules = () => {
  return [
    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Please provide a valid price."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."),
    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Please provide a valid number of miles."),
    body("classification_id")
      .trim()
      .isNumeric()
      .withMessage("Please provide a valid classification ID."),
    body("inv_description")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide an image path."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a thumbnail path."),
    body("inv_color")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a color."),
    body("inv_year")
      .trim()
      .isNumeric()
      .withMessage("Please provide a valid year."),
  ];
};

validate.checkVehicleData = async (req, res, next) => {
  console.log("validating");
  const {
    inv_price,
    inv_miles,
    classification_id,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_color,
    inv_make,
    inv_model,
    inv_year,
  } = req.body;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classDropDown = await utilities.buildClassDropdown();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classDropDown,
      inv_price,
      inv_miles,
      classification_id,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_color,
      inv_make,
      inv_model,
      inv_year,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_price,
    inv_miles,
    classification_id,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_color,
    inv_make,
    inv_model,
    inv_year,
    inv_id,
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classDropDown = await utilities.buildClassDropdown();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit: " + inv_make + " " + inv_model,
      nav,
      classDropDown,
      inv_price,
      inv_miles,
      classification_id,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_color,
      inv_make,
      inv_model,
      inv_year,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = validate;
