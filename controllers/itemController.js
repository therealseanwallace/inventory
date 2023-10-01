import asyncHandler from "express-async-handler";
import Item from "../models/item.js";
import Category from "../models/category.js";

// GET details of all items and category

const index = asyncHandler(async (req, res, next) => {
  const [
    itemCount,
    categoryCount
  ] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec()
  ]);

  res.render("index", {
    title: "Inventory app home",
    itemCount,
    categoryCount
  })
})

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
    items
  })

});

// Display detail page for a specific Item.
const itemDetail = asyncHandler(async (req, res, next) => {
  const item = await Item.findOne({_id: req.params.id});

  if (!item) {
    const error = new Error(`Item with ID ${req.params.id} not found!`);
    error.status = 404;
    return next(error);
  }

  const category = await Category.findOne({_id: item.category})
  res.render("item_detail", {
    item,
    cat: category.name
  });
});

// Display Item create form on GET.
const itemCreateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create GET");
});

// Handle Item create on POST.
const itemCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create POST");
});

// Display Item delete form on GET.
const itemDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
});

// Handle Item delete on POST.
const itemDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
});

// Display Item update form on GET.
const itemUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle Item update on POST.
const itemUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update POST");
});

export {
  index,
  itemList,
  itemDetail,
  itemCreateGet,
  itemCreatePost,
  itemDeleteGet,
  itemDeletePost,
  itemUpdateGet,
  itemUpdatePost
}