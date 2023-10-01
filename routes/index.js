import express from "express";

const router = express.Router();

/* GET home page. */
export default router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});



