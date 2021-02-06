const db = require ('./server');

//Helper function to return user object for a given id
const getUserWithId = function(id) {
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
const getUserWithEmail = function(email) {
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
  .catch(error => res.send(error));
}
exports.getUserWithEmail = getUserWithEmail;

//Helper function for adding user to database
const addUser =  function(user) {
  const queryValues = [user.name, user.email, user.password];
  const queryString = `
  INSERT INTO users(name, email, password)
  VALUES($1, $2, $3)
  RETURNING *;
  `;
  return db.query(queryString, queryValues)
  .then((user) => {
    return user.rows[0];
  })
  .catch(error => res.send(error));
}
exports.addUser = addUser;

//Helper function for checking if user with an email exists during registration
const userExists =  function(email) {
  const queryValues = [email];
  const queryString = `
  SELECT count(*)
  FROM users
  WHERE email = $1;
  `;
  return db.query(queryString, queryValues)
  .then((count) => {
    return count === 0 ? true : Error('User exits');
  })
  .catch(error => res.send(error));
};

exports.userExists = userExists;
