import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import inventoryRouter from "./routes/inventory.js";

const expressStatic = express.static;
const app = express();

// Set up Mongoose connection
dotenv.config();
mongoose.set("strictQuery", false);
const { MONGO_URI } = process.env;
if (!MONGO_URI) throw new Error("MONGO_URI is not defined in your environment variables");

(async () => {
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  try {
    await mongoose.connect(MONGO_URI, mongooseOpts)
  } catch  (error) {
    console.error("An error occurred while connecting to MongoDB!", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      console.log("Connected to MongoDB!");
    } else {
      console.log("Failed to connect to MongoDB!");
    }
  }
    
  
})();

// view engine setup
const publicPath = join(new URL(".", import.meta.url).pathname, "public");
app.set("views", "views");
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(publicPath));

app.use("/", indexRouter);
app.use("/inventory", inventoryRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
