// load .env data into process.env
require('dotenv').config();

const dbParams = require('../lib/db')
const { Pool } = require('pg');
const db = new Pool(dbParams);

const getMaps = function (options) {
  let queryValue = [];
  let queryString = `
  SELECT DISTINCT maps.*, users.name as user_name
  FROM maps
  JOIN users on maps.user_id = users.id`;

  if (options.map_id) {
    queryValue = [options.map_id]
    queryString += `WHERE maps.id = $1`;
  }

  if (options.owner_id) {
    queryValue = [options.owner_id]
    queryString += `
    WHERE maps.user_id = $1
    `;
  }

  if (options.contributor_id) {
    queryValue = [options.contributor_id]
    queryString += `
    JOIN markers ON maps.id = markers.map_id
    WHERE markers.user_id = $1
    `;
  }

  if (options.favUser_id) {
    queryValue = [options.favUser_id]
    queryString += `
    JOIN favorites ON maps.id = favorites.map_id
    WHERE favorites.user_id = $1
    `;
  }

  queryString += `;`;

  return db.query(queryString, queryValue)
    .then(res => res.rows)
    .catch(() => null);
}

exports.getMaps = getMaps;


const getMarkersForMap = function ({ map_id }) {
  let queryValue = [map_id];
  let queryString = `SELECT * FROM markers WHERE map_id = $1;`;
  return db.query(queryString, queryValue)
    .then(res => res.rows)
    .catch(() => null);
}

exports.getMarkersForMap = getMarkersForMap;


const addMap = function (options) {
  if (!options.user_id) {
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
    .then((res) => res.rows[0])
    .catch(() => null);
}
exports.addMap = addMap;

const addMarker = function (options) {

  if (!options.user_id) {
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
    .then((res) => res.rows[0])
    .catch(() => null);
}
exports.addMarker = addMarker;

const deleteMarker = function (options) {

  if (!options.user_id) {
    throw new Error('User not logged in!');
  }
  const queryString = `
  DELETE FROM markers
  WHERE id = $1;
  `;
  const queryValues = [
    options.id
  ];

  return db.query(queryString, queryValues)
    .then(() => {
      return;
    })
    .catch(() => null);
}

exports.deleteMarker = deleteMarker;

const updateMarker = function (options) {
  if (!options.user_id) {
    throw new Error('User not logged in!');
  }

  const queryValues = [
    options.latitude,
    options.longitude,
    options.title,
    options.description,
    options.img_url,
    options.id
  ];

  const queryString = `
  UPDATE markers SET latitude = $1, longitude = $2, title = $3, description = $4, img_url = $5 WHERE id = $6 RETURNING *;
  `;

  return db.query(queryString, queryValues)
    .then((res) => {
      let output = {};
      output.latitude = res.rows[0].latitude;
      output.longitude = res.rows[0].longitude;
      output.title = res.rows[0].title;
      output.description = res.rows[0].description;
      output.img_url = res.rows[0].img_url;
      output.id = res.rows[0].id;
      return output;
    })
    .catch(() => null);
}

exports.updateMarker = updateMarker;

const addFavorite = function (options) {

  if (!options.user_id) {
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
    .then((res) => res.rows[0])
    .catch(() => null);
}
exports.addFavorite = addFavorite;

const deleteFavorite = function (options) {

  if (!options.user_id) {
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
      return;
    })
    .catch(() => null);
}
exports.deleteFavorite = deleteFavorite;

//Helper function to return user object for a given id
const getUserWithId = function (id) {
  const queryValues = [id];
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1;
  `;
  return db.query(queryString, queryValues)
    .then((res) => {
      return res.rows[0]
    });
}
exports.getUserWithId = getUserWithId;

//Helper function for retrieving user with email
const getUserWithEmail = function (email) {
  const queryValues = [email];
  const queryString = `
  SELECT *
  FROM users
  WHERE email = $1;
  `;
  return db.query(queryString, queryValues)
    .then((user) => {
      return user.rows[0];
    })
    .catch(() => null);
}
exports.getUserWithEmail = getUserWithEmail;

//Helper function for adding user to database
const addUser = function (user) {
  const queryValues = [user.name, user.email, user.password];
  const queryString = `
  INSERT INTO users(name, email, password)
  VALUES($1, $2, $3)
  RETURNING *;
  `;
  return db.query(queryString, queryValues)
    .then((user) => {
      const newUser = {};
      newUser.id = user.rows[0].id;
      newUser.name = user.rows[0].name;
      newUser.email = user.rows[0].email;
      newUser.password = user.rows[0].password;
      return newUser;
    })
    .catch(() => null);
}
exports.addUser = addUser;

//Helper function for checking if user with an email exists during registration
const userExists = function (email) {
  const queryValues = [email];
  const queryString = `
  SELECT email
  FROM users
  WHERE email = $1;
  `;
  return db.query(queryString, queryValues)
    .then((obj) => {
      return obj.rowCount === 0 ? true : false;
    })
    .catch(() => null);
};

exports.userExists = userExists;
