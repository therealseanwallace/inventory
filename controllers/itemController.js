import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Item from "../models/item.js";
import Category from "../models/category.js";

// GET details of all items and category

const index = asyncHandler(async (req, res, next) => {
  const [itemCount, categoryCount] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Inventory app home",
    itemCount,
    categoryCount,
  });
});

// Display list of all Items.
const itemList = asyncHandler(async (req, res, next) => {
  /* await Item.find({}, "name", (err, items) => {
    if(err) {
      throw new Error(`Error getting items! ${err.stack}`)
    } else {
      res.render("item_list", { title: "All items", items})
    }
  }); */

  const items = await Item.find({});

  res.render("all_items", {
    title: "All items",
    items,
  });
});

// Display detail page for a specific Item.
const itemDetail = asyncHandler(async (req, res, next) => {
  const item = await Item.findOne({ _id: req.params.id });

  if (!item) {
    const error = new Error(`Item with ID ${req.params.id} not found!`);
    error.status = 404;
    return next(error);
  }

  const category = await Category.findOne({ _id: item.category });
  res.render("item_detail", {
    item,
    cat: category.name,
  });
});

// Display Item create form on GET.
const itemCreateGet = asyncHandler(async (req, res, next) => {
  // Get all categories so we can assign the new item to one
  const categories = await Category.find({});

  res.render("item_form", {
    title: "Create new item",
    categories,
  });
});

// Handle Item create on POST.
const itemCreatePost = [
  
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must be a valid MongoDB _id.")
    .trim()
    .isMongoId()
    .escape(),
  body("price", "Price must be a number.")
    .trim()
    .isNumeric()
    .toFloat()
    .escape(),
  body("stock", "Stock must be a number.")
    .trim()
    .isNumeric()
    .toFloat()
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an item object with escaped/trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form
      const categories = await Category.find();

      // Modify the item object to display the incorrect value in the form field
      errors.array().forEach((error) => {
        item[error.path] = error.value;
      });

      res.render("item_form", {
        title: "Create new item",
        item,
        categories,
        errors: errors.array(),
      });
    } else {
      // Form data is valid. Proceed with saving the new item.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Handle Item delete on POST.
const itemDeletePost = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    // Item not found. Redirect to inventory items page.
    res.redirect("/inventory/items");
  } else {
    await item.deleteOne();
    res.redirect("/inventory/items");
  }
});

// Display Item update form on GET.
const itemUpdateGet = asyncHandler(async (req, res, next) => {
  // Get item and categories for form
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find({}),
  ]);

  if (item === null) {
    // No results
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form", {
    title: "Update item",
    categories,
    item,
  });
});

// Handle Item update on POST.
const itemUpdatePost = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must be a valid MongoDB _id.")
    .trim()
    .isMongoId()
    .escape(),
  body("price", "Price must be a number.")
    .trim()
    .isNumeric()
    .toFloat()
    .escape(),
  body("stock", "Stock must be a number.")
    .trim()
    .isNumeric()
    .toFloat()
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Retrieve the current item from the database
    const item = await Item.findById(req.params.id);

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages

      // Get all categories for form
      const categories = await Category.find();

      // Modify the item object to display the incorrect value in the form field
      errors.array().forEach((error) => {
        item[error.path] = error.value;
      });

      res.render("item_form", {
        title: "Update item",
        item,
        categories,
        errors: errors.array(),
      });
    } else {
      // Form data is valid. Update the record.
      const updatedItem = await Item.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          price: req.body.price,
          stock: req.body.stock,
        },
        {}
      );
      res.redirect(updatedItem.url);
    }
  }),
];

export {
  index,
  itemList,
  itemDetail,
  itemCreateGet,
  itemCreatePost,
  itemDeletePost,
  itemUpdateGet,
  itemUpdatePost,
};
