const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { getCocktails, getZutaten, getCocktailByPrice } = require('../model/cocktails');

router.get(
  '/cocktails',
  asyncHandler(async (req, res) => {
    const result = await getCocktails();
    res.status(result.code).json(result);
  }),
);

router.get(
  '/cocktails/:cname/zutaten',
  asyncHandler(async (req, res) => {
    const result = await getZutaten(req.params.cname);
    res.status(result.code).json(result);
  }),
);

router.get(
  '/cocktails/:preis',
  asyncHandler(async (req, res) => {
    const result = await getCocktailByPrice(req.params.preis);
    res.status(result.code).json(result);
  }),
);

module.exports = router;
