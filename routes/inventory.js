import express from "express";

// Import controller modules
import {
  categoryList,
  categoryDetail,
  categoryCreateGet,
  categoryCreatePost,
  categoryDeleteGet,
  categoryDeletePost,
  categoryUpdateGet,
  categoryUpdatePost,
} from "../controllers/categoryController.js";
import {
  index,
  itemList,
  itemDetail,
  itemCreateGet,
  itemCreatePost,
  itemDeleteGet,
  itemDeletePost,
  itemUpdateGet,
  itemUpdatePost
} from "../controllers/itemController.js";

const router = express.Router();

// CATEGORY ROUTES //

// GET request for creating Category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", categoryCreateGet);

// POST request for creating Category.
router.post("/category/create", categoryCreatePost);

// GET request to delete Category.
router.get("/category/:id/delete", categoryDeleteGet);

// POST request to delete Category.
router.post("/category/:id/delete", categoryDeletePost);

// GET request to update Category.
router.get("/category/:id/update", categoryUpdateGet);

// POST request to update Category.
router.post("/category/:id/update", categoryUpdatePost);

// GET request for one Category.
router.get("/category/:id", categoryDetail);

// GET request for list of all Categorys.
router.get("/categorys", categoryList);


// ITEM ROUTES //

// GET inventory home page
router.get("/", index);

// GET request to create Item

router.get("/item/create", itemCreateGet);

// POST request to create Item

router.post("/item/create", itemCreatePost);

// GET request to delete Item

router.get("/item/:id/delete", itemDeleteGet);

// POST request to delete Item.
router.post("/item/:id/delete", itemDeletePost);

// GET request to update Item.
router.get("/item/:id/update", itemUpdateGet);

// POST request to update Item.
router.post("/item/:id/update", itemUpdatePost);

// GET request for one Item.
router.get("/item/:id", itemDetail);

// GET request for list of all Item items.
router.get("/items", itemList);

export default router;