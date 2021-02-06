module.exports = function (router, database) {


  // Main maps route to get the maps
  router.get('/maps', (req, res) => {
    database.getMaps(req.query)
    .then(maps => res.send({maps}))
    .catch((error) => {
      console.error(error);
      res.send(error)
    });
  });


return router;
};

