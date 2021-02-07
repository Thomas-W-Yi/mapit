const db = require ('./server');

const getAllMaps = function(options) {
  let queryValue = [];
  let queryString = `
  SELECT maps.*, markers.*
  JOIN markers on maps.id = markers.map_id
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

  return db.query(queryString, queryValue)
  .then(res => res.rows)
  .catch(error => res.send(error));
}

exports.getAllMaps = getAllMaps;

const addMap = function(map) {

  const queryString = `
  INSERT INTO maps (user_id, coord_id, name)
  VALUES($1, $2, $3)
  RETURNING *;
  `;

  const queryValues = [
    map.user_id,
    map.coord_id,
    map.name,
  ];

  return db.query(queryString, queryValues)
  .then((res) => {
    return res.rows[0];
  });
}
exports.addMap = addMap;

const addMarker = function(marker) {

  const queryString = `
  INSERT INTO markers (map_id, coord_id, user_id, title, description, img_url)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `;

  const queryValues = [
    marker.map_id,
    marker.coord_id,
    marker.user_id,
    marker.title || `Not provided`,
    marker.description || `Not provided`
  ];

  return db.query(queryString, queryValues)
  .then((res) => {
    return res.rows[0];
  });
}
exports.addMarker = addMarker;
