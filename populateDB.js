import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/category.js";
import Item from "./models/item.js";

dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) throw new Error("MONGO_URI is not defined in your environment variables");

(async () => {
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {

    await mongoose.connect(MONGO_URI, mongooseOpts);
    
    const categories = [];
    
    const categoryCreate = async (index, name, description) => {
      const category = new Category({ name, description });
      await category.save();
      categories[index] = category;
      console.log(`Added category: ${name}`);
    };
    
    const itemCreate = async (categoryIndex, name, description, price, stock) => {
      const categoryID = categories[categoryIndex].id;
      const item = new Item({
        name,
        description,
        price,
        stock,
        category: categoryID,
      });
      await item.save();
      console.log(`Added item: ${name}`);
    };
    
    const createCategories = async () => {
      console.log("Adding categories...");
      await Promise.all([
        categoryCreate(
          0,
          "Accessories",
          "Enchanted adornments and magical gear meticulously crafted for the esteemed creatures of the realm."
        ),
        categoryCreate(
          1,
          "Food",
          "Magical and nutritious food items suitable for various mythical creatures."
        ),
        categoryCreate(
          2,
          "Toys",
          "Fun and entertaining toys designed for a variety of magical creatures."
        ),
      ]);
    };
    

const createItems = async () => {
  console.log("Adding items...");
  await Promise.all([
    itemCreate(
      0,
      "Unicorn Tiara",
      "A shimmering tiara embedded with magical crystals, specifically designed for unicorns.",
      150,
      5
    ),
    itemCreate(
      0,
      "Hippogryph Harness",
      "A sturdy and comfortable harness, perfect for taming wild hippogryphs.",
      200,
      10
    ),
    itemCreate(
      0,
      "Phoenix Feather Quill",
      "A lightweight and durable quill made from authentic phoenix feathers.",
      120,
      8
    ),
    itemCreate(
      0,
      "Solarflare Saddle",
      "A radiant saddle for sun-drake steeds, harnessing the sun’s warmth, ideal for voyages across daylit skies.",
      210,
      4
    ),
    itemCreate(
      1,
      "Dragonfruit Delight",
      "A tasty and nourishing treat made from enchanted dragon fruits.",
      50,
      20
    ),
    itemCreate(
      1,
      "Unicorn Berries",
      "Rare and magical berries that are a favorite treat of unicorns.",
      60,
      15
    ),
    itemCreate(
      1,
      "Elixir of Luminosity",
      "A glowing liquid snack that satisfies the hunger of ethereal beings.",
      80,
      10
    ),
    itemCreate(
      2,
      "Mystical Maze Ball",
      "A perplexing toy that challenges and entertains magical creatures.",
      70,
      7
    ),
    itemCreate(
      2,
      "Enchanted Squeaky Toy",
      "A captivating toy that squeaks with the laughter of fairies.",
      45,
      12
    ),
    itemCreate(
      2,
      "Glowing Tether Tug",
      "A vibrant and durable tug toy that glows with the light of the moon.",
      110,
      6
    ),
  ]);
}

    await createCategories();
    await createItems();
  } catch (error) {
    console.error("An error occurred!", error);
  } finally {
    mongoose.connection.close();
  }
})();
