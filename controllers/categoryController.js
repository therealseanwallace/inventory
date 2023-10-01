import asyncHandler from "express-async-handler";
import Category from "../models/category.js";
import Item from "../models/item.js";

// Display list of all Categories.
const categoryList = asyncHandler(async (req, res, next) => {
  // res.send("NOT IMPLEMENTED: Category list");

  const categories = await Category.find({});

  if (categories.length === 0) {
    const error = new Error("Error! No categories found.");
    error.status = 500;
    return next(error);
  }

  res.render("all_categories", {
    title: "All categories",
    categories
  })
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
  res.send("NOT IMPLEMENTED: Category create GET");
});

// Handle Category create on POST.
const categoryCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category create POST");
});

// Display Category delete form on GET.
const categoryDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
});

// Handle Category delete on POST.
const categoryDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
});

// Display Category update form on GET.
const categoryUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
const categoryUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update POST");
});

export {
  categoryList,
  categoryDetail,
  categoryCreateGet,
  categoryCreatePost,
  categoryDeleteGet,
  categoryDeletePost,
  categoryUpdateGet,
  categoryUpdatePost,
};
