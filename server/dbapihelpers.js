const db = require ('./server');

const getAllMaps = function(options) {
  let queryValue = [];
  let queryString = `
  SELECT DISTINCT maps.*
  FROM maps;
  `;

  if(options.owner_id) {
    queryValue = [options.owner_id]
    queryString += `
    WHERE user_id = $1
    ;`;
  }

  if(options.contributor_id) {
    queryValue = [options.contributor_id]
    queryString += `
    JOIN markers ON maps.id = markers.map_id
    WHERE markers.user_id = $1
    ;`;
  }

  if(options.favUser_id) {
    queryValue = [options.favUser_id]
    queryString += `
    JOIN favorites ON maps.id = favorites.map_id
    WHERE favorites.user_id = $1;
    ;`;
  }

  return db.query(queryString, queryValue)
  .then(res => res.rows)
  .catch(error => res.send(error));
}

exports.getAllMaps = getAllMaps;


const getMarkers = function(mapId) {
   let queryValue = [mapId];
   let queryString = `
   SELECT * markers
   WHERE map_id = $1
   ;`;

   return db.query(queryString, queryValue)
  .then(res => res.rows)
  .catch(error => res.send(error));
}

exporrs.getMarkers = getMarkers;


const addMap = function(options) {

  const queryString = `
  INSERT INTO maps (user_id, coord_id, name)
  VALUES($1, $2, $3)
  RETURNING *;
  `;

  const queryValues = [
    options.user_id,
    options.coord_id,
    options.name,
  ];

  return db.query(queryString, queryValues)
  .then((res) =>  res.rows[0])
  .catch(error => res.send(error));
}
exports.addMap = addMap;

const addMarker = function(options) {

  const queryString = `
  INSERT INTO markers (map_id, coord_id, user_id, title, description, img_url)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `;

  const queryValues = [
    options.map_id,
    options.coord_id,
    options.user_id,
    options.title || `Not provided`,
    options.description || `Not provided`
  ];

  return db.query(queryString, queryValues)
  .then((res) =>  res.rows[0])
  .catch(error => res.send(error));
}
exports.addMarker = addMarker;

const deleteMarker = function(options) {

  if(!options.user_id) {
    throw new Error('User not logged in!');
  }

  const queryString = `
  DELETE FROM markers
  WHERE id = $1
  ;
  `;
  const queryValues = [
    options.marker_id
  ];

  return db.query(queryString, queryValues)
  .then(() => {
    return ;
  })
  .catch(error => res.send(error));
}

exports.deleteMarker = deleteMarker;

const updateMarker = function(options) {

  if(!options.user_id) {
    throw new Error('User not logged in!');
  }

//////b------------>> problem

  return db.query(queryString, queryValues)
  .then(() => {
    return ;
  })
  .catch(error => res.send(error));
}

exports.updateMarker = updateMarker;

const addFavorite = function(options) {

  const queryString = `
  INSERT INTO favorites (user_id, map_id)
  VALUES($1, $2)
  RETURNING *;
  `;

  const queryValues = [
    options.user_id,
    options.map_id
  ];

  return db.query(queryString, queryValues)
  .then((res) =>  res.rows[0])
  .catch(error => res.send(error));
}
exports.addFavorite = addFavorite;

const deleteFavorite = function(options) {

  const queryString = `
  DELETE FROM favorites
  WHERE user_id = $1
  AND map_id = $2
  ;
  `;

  const queryValues = [
    options.user_id,
    options.map_id
  ];

  return db.query(queryString, queryValues)
  .then(() => {
    return ;
  })
  .catch(error => res.send(error));
}
exports.deleteFavurite = deleteFavorite;
