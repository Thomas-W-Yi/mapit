// load .env data into process.env
require('dotenv').config();

const dbParams = require('../lib/db')
const { Pool } = require('pg');
const db = new Pool(dbParams);

const getMaps = function (options) {
  let queryValue = [];
  let queryString = `SELECT DISTINCT maps.* FROM maps `;

  if (options.map_id) {
    queryValue = [options.map_id]
    queryString += `WHERE id = $1`;
  }

  if (options.owner_id) {
    queryValue = [options.owner_id]
    queryString += `
    WHERE user_id = $1
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
    options.marker_id
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
    .then((res) => res.rows[0])
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
      newUser.email= user.rows[0].email;
      newUser.password = user.rows[0].password;
      console.log(newUser);
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
