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
  if (rows.length > 0) {
    return {
      code: 200,
      data: rows,
    };
  }
  return {
    code: 404,
    data: `the specified cocktail with the Name ${cname} was not found in the database`,
  };
}

async function getCocktailByPrice(query) {
  const { preis } = query;
  if (preis) {
    const { rows } = await db.query('SELECT cname, preis FROM cocktail WHERE preis <= $1', [preis]);
    if (rows.length > 0) {
      return {
        code: 200,
        data: rows,
      };
    }
  } else {
    const { rows } = await db.query('SELECT cname, preis from cocktail');
    return {
      code: 200,
      data: rows,
    };
  }
}

async function delCocktail(cname) {
  const { rows } = await db.query('SELECT * FROM cocktail WHERE cname = $1', [cname]);
  if (rows.length > 0) {
    await db.query('DELETE FROM besteht WHERE cid = (SELECT cid FROM cocktail WHERE cname = $1)', [cname]);
    await db.query('DELETE FROM bestellt WHERE cid = (SELECT cid FROM cocktail WHERE cname = $1)', [cname]);
    await db.query('DELETE FROM cocktail WHERE cname = $1', [cname]);
    return {
      code: 200,
      data: 'Deleted',
    };
  }
  return {
    code: 404,
    data: 'Not Found',
  };
}

async function postCocktail(c) {
  const { rows } = await db.query('SELECT MAX(cid) AS max FROM cocktail');
  const cid = rows[0].max + 1;
  await db.query(
    'INSERT INTO cocktail (cid, cname, preis, zubereitung, kid, zgid, sgid) VALUES($1,$2,$3,$4,$5,$6,$7)',
    [cid, c.cname, c.preis, c.zubereitung, c.kid, c.zgid, c.sgid],
  );
  return {
    code: 200,
    data: `Inserted ${cid}`,
  };
}

async function patchCocktail(cname, data) {
  const props = [];
  for (const prop in data) props.push(`${prop} = '${data[prop]}'`);
  await db.query(`UPDATE cocktail SET ${props.join(',')} WHERE cname = $1`, [cname]);

  return {
    code: 200,
    data: `updated to ${data.preis}`,
  };
}

module.exports = {
  getCocktails,
  getZutaten,
  getCocktailByPrice,
  delCocktail,
  postCocktail,
  patchCocktail,
};
