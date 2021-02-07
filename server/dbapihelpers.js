const db = require ('./server').db;

const getMaps = function(options) {
  let queryValue = [];
  let queryString = `
  SELECT DISTINCT maps.*
  FROM maps;
  `;

  if(options.map_id) {
    queryValue = [options.map_id]
    queryString += `
    WHERE map_id = $1;
    `;
  }

  if(options.owner_id) {
    queryValue = [options.owner_id]
    queryString += `
    WHERE user_id = $1;
    `;
  }

  if(options.contributor_id) {
    queryValue = [options.contributor_id]
    queryString += `
    JOIN markers ON maps.id = markers.map_id
    WHERE markers.user_id = $1;
    `;
  }

  if(options.favUser_id) {
    queryValue = [options.favUser_id]
    queryString += `
    JOIN favorites ON maps.id = favorites.map_id
    WHERE favorites.user_id = $1;
    `;
  }

  return db.query(queryString, queryValue)
  .then(res => res.rows)
  .catch(error => res.send(error));
}

exports.getMaps = getMaps;


const getMarkersForMap = function(mapId) {
   let queryValue = [mapId];
   let queryString = `
   SELECT * markers
   WHERE map_id = $1;
   `;

   return db.query(queryString, queryValue)
  .then(res => res.rows)
  .catch(error => res.send(error));
}

exports.getMarkersforMap = getMarkersForMap;


const addMap = function(options) {
  if(!options.user_id) {
    throw new Error('User not logged in!');
  }

  const queryString = `
  INSERT INTO maps (user_id, latitude, longitude, name)
  VALUES($1, $2, $3, $4)
  RETURNING *;
  `;

  const queryValues = [
    options.user_id,
    options.latitude,
    options.longitude,
    options.name,
  ];

  return db.query(queryString, queryValues)
  .then((res) =>  res.rows[0])
  .catch(error => res.send(error));
}
exports.addMap = addMap;

const addMarker = function(options) {

  if(!options.user_id) {
    throw new Error('User not logged in!');
  }

  const queryString = `
  INSERT INTO markers (map_id, latitude, longitude, user_id, title, description, img_url)
  VALUES($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
  `;

  const queryValues = [
    options.map_id,
    options.latitude,
    options.longitude,
    options.user_id,
    options.title,
    options.description || `Not provided`,
    options.img_url || `Not provided`
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
  WHERE id = $1;
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

  const queryValues = [
    options.latitude,
    options.longitude,
    options.title,
    options.description || `Not provided`,
    options.img_url || `Not provided`,
    options.marker_id
  ];

  const queryString = `
  UPDATE markers
  SET latitude = $1,
  SET longitude = $2,
  SET title = $3,
  SET description = $4,
  SET img_url = $5,
  WHERE id = $6
  RETURNING *;
  `;

  return db.query(queryString, queryValues)
  .then((res) =>  res.rows[0])
  .catch(error => res.send(error));
}

exports.updateMarker = updateMarker;

const addFavorite = function(options) {

  if(!options.user_id) {
    throw new Error('User not logged in!');
  }

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

  if(!options.user_id) {
    throw new Error('User not logged in!');
  }

  const queryString = `
  DELETE FROM favorites
  WHERE user_id = $1
  AND map_id = $2;
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
exports.deleteFavorite = deleteFavorite;
