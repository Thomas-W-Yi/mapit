const bcrypt = require('bcrypt');

module.exports = function (router, database) {

  //Post route for user registration
  router.post('/', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    database.userExists(user.email)
    .then(database.addUser(user))
    .then((user) => {
      if (!user) {
        res.send(Error("Invalid credentials"));
        return;
      }
      req.session.userId = user.id;
      res.send("Get in");
    })
    .catch(error => res.send(error));
  });

  //Helper function for correct password check
  const login =  function(email, password) {
    return database.getUserWithEmail(email)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  }
  exports.login = login;


  //Post route for user login
  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send(Error("error"));
          return;
        }
        req.session.userId = user.id;
        res.send({user: {name: user.name, email: user.email, id: user.id}});
      })
      .catch(e => res.send(e));
  });

  //Post route for user logout
  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.send({});
  });

return router;
};
