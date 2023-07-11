const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      // gets how the view should look in the view folder for rendering
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
};

// build single page inventory

invCont.buildByVehicleInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getVehicleByInvId(inv_id);
    const infoPage = await utilities.buildVehicleInfo(data);
    let nav = await utilities.getNav();
    const vehicleName =
      data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
    res.render("./inventory/individual", {
      title: vehicleName,
      nav,
      infoPage,
    });
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
};

// show inv managmeant
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classDropDown = await utilities.buildClassDropdown();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classDropDown,
    });
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
};

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
};

invCont.AddClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const newClass = await invModel.addNewClassification(classification_name);
  let classDropDown = await utilities.buildClassDropdown();
  let nav = await utilities.getNav();
  if (newClass) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added to the list`
    );

    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classDropDown,
    });
  } else {
    req.flash("error", "Provide a correct classification name");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      classDropDown,
    });
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classDropDown = await utilities.buildClassDropdown();
  try {
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classDropDown,
      errors: null,
    });
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
};

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classDropDown = await utilities.buildClassDropdown();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    const car = await invModel.addNewVehicle(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );
    if (car) {
      req.flash("notice", `You\'ve added another vehicle to the inventory`);
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        classDropDown,
        errors: null,
      });
    } else {
      req.flash("error", "Check your information and try again.");
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classDropDown,
        errors: null,
      });
    }
  } catch (error) {
    req.flash("error", "Sorry, we could not proccess your request.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classDropDown,
      errors: null,
    });
  }
};

module.exports = invCont;
