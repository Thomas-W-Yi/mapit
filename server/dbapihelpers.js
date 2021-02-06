const db = require ('./server');

const getAllProperties = function(options) {
  let queryValue = [];
  let queryString = `
  SELECT maps.*
  FROM maps;
  `;

  if(options.owner_id) {
    queryValue = [options.owner_id]
    queryString += `
    WHERE user_id = $1
    ;`;
  }

  if(options.favUser_id) {
    queryValue = [options.favUser_id]
    queryString += `
    JOIN favourites ON maps.id = favourites.map_id
    WHERE favourites.user_id = $1;
    ;`;
  }

  return db.query(queryString, queryParams)
  .then(res => res.rows)
  .catch(error => res.send(error));
}

exports.getAllProperties = getAllProperties;
