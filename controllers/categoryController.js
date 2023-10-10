import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Category from "../models/category.js";
import Item from "../models/item.js";

// Display list of all Categories.
const categoryList = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});

  if (categories.length === 0) {
    const error = new Error("Error! No categories found.");
    error.status = 500;
    return next(error);
  }

  res.render("all_categories", {
    title: "All categories",
    categories,
  });
});

// Display detail page for a specific Category.
const categoryDetail = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id }).exec();

  if (!category) {
    const error = new Error(`Category with ID ${req.params.id} not found!`);
    error.status = 404;
    return next(error);
  }

  const items = await Item.find({ category: req.params.id }).exec();

  res.render("category_detail", {
    category,
    items,
  });
});

// Display Category create form on GET.
const categoryCreateGet = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Create new category",
  });
});

// Handle Category create on POST.
const categoryCreatePost = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped/trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Modify the item object to display the incorrect value in the form field
      errors.array().forEach((error) => {
        category[error.path] = error.value;
      });

      res.render("category_form", {
        title: "Create new category",
        category,
        errors: errors.array(),
      });
    } else {
      // Form data is valid. Proceed with saving the new category.
      await category.save();
      res.redirect(category.url);
    }
  }),
];

// Handle Category delete on POST.
const categoryDeletePost = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  const items = await Item.find({ category: req.params.id }).exec();

  if (items.length > 0) {
    // The category contains items, therefore we will forbid deleting it
    throw new Error("Error: category has items associated with it. Please delete the items before proceeding.")
  }
  if (!category) {
    // Category not found. Redirect to categories page.
    res.redirect("/inventory/categorys");
  } else {
    await category.deleteOne();
    res.redirect("/inventory/categorys");
  }
});

// Display Category update form on GET.
const categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (category === null) {
    // No results
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update category",
    category,
  });
});

// Handle Category update on POST.
const categoryUpdatePost = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a category object with escaped/trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Modify the item object to display the incorrect value in the form field
      errors.array().forEach((error) => {
        category[error.path] = error.value;
      });

      res.render("category_form", {
        title: "Create new category",
        category,
        errors: errors.array(),
      });
    } else {
      // Form data is valid. Proceed with saving the new category.
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          description: req.body.description,
        }
      );
      res.redirect(updatedCategory.url);
    }
  }),
];

export {
  categoryList,
  categoryDetail,
  categoryCreateGet,
  categoryCreatePost,
  categoryDeletePost,
  categoryUpdateGet,
  categoryUpdatePost,
};
