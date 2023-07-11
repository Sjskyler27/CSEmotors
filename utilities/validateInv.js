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

module.exports = validate;
