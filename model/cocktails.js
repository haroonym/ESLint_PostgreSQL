const db = require('../db');

async function getCocktails() {
  const { rows } = await db.query('SELECT cname, preis FROM cocktail');
  return {
    code: 200,
    data: rows,
  };
}

async function getZutaten(cname) {
  const {
    rows,
  } = await db.query(
    'SELECT zbez FROM cocktail JOIN besteht b on cocktail.cid = b.cid JOIN zutat z on b.zid = z.zid WHERE cname = $1',
    [cname],
  );
  if (rows.length > 0)
    return {
      code: 200,
      data: rows,
    };
  else
    return {
      code: 404,
      data: `the specified cocktail with the Name ${cname} was not found in the database`,
    };
}

async function getCocktailByPrice(preis) {
  const { rows } = await db.query('SELECT cname, preis FROM cocktail WHERE preis <= $1', [preis]);
  if (rows.length > 0)
    return {
      code: 200,
      data: rows,
    };
  else
    return {
      code: 404,
      data: `Es wurde kein Cocktail mit dem Preis unter ${preis} in der Datenbank gefunden`,
    };
}

async function delCocktail(cname) {
  const { rows } = await db.query('SELECT * FROM cocktail WHERE cname = $1', [cname]);
  if (rows.length > 0) {
    await db.query('DELETE FROM besteht WHERE cid = (SELECT cid FROM cocktail WHERE cname = $1)', [cname]);
    await db.query('DELETE FROM bestellt WHERE cid = (SELECT cid FROM cocktail WHERE cname = $1)', [cname]);
    await db.query('DELETE FROM cocktail WHERE cname = $1', [cname]);
    return {
      code: 200,
      data: true,
    };
  }
}

module.exports = {
  getCocktails,
  getZutaten,
  getCocktailByPrice,
  delCocktail,
};
