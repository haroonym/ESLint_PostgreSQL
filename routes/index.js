const express = require('express');

const asyncHandler = require('express-async-handler');

const router = express.Router();
const {
  getCocktails,
  getZutaten,
  getCocktailByPrice,
  delCocktail,
  postCocktail,
  patchCocktail,
} = require('../model/cocktails');

// router.get(
//   '/cocktails',
//   asyncHandler(async (req, res) => {
//     const result = await getCocktails();
//     res.status(result.code).json(result);
//   }),
// );

router.get(
  '/cocktails/:cname/zutaten',
  asyncHandler(async (req, res) => {
    const result = await getZutaten(req.params.cname);
    res.status(result.code).json(result);
  }),
);

router.get(
  '/cocktails',
  asyncHandler(async (req, res) => {
    const result = await getCocktailByPrice(req.query);
    res.status(result.code).json(result);
  }),
);

router.delete(
  '/cocktails/:cname',
  asyncHandler(async (req, res) => {
    const result = await delCocktail(req.params.cname);
    res.status(result.code).json(result);
  }),
);

router.post(
  '/cocktails',
  asyncHandler(async (req, res) => {
    const result = await postCocktail(req.body);
    res.status(result.code).json(result);
  }),
);

router.patch(
  '/cocktails/:cname',
  asyncHandler(async (req, res) => {
    const result = await patchCocktail(req.params.cname, req.body);
    res.status(result.code).json(result);
  }),
);

module.exports = router;
