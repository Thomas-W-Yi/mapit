module.exports = function (router, database) {


  // Main maps route to get the maps----- either all maps or filtered through req.query
  router.get('/maps', (req, res) => {
    database.getMaps(req.query)
    .then(maps => res.send({maps}))
    .catch((error) => {
      console.error(error);
      res.send(error)
    });
  });

  // api route for creating a new map

  router.post('/maps', (req, res) => {
    const userId = req.session.userId;
    database.addMap({...req.body, user_id: userId})
      .then(map => {
        res.send(map);
      })
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

  // api route for creating a new marker

  router.post('/markers', (req, res) => {
    const userId = req.session.userId;
    database.addMarker({...req.body, user_id: userId})
      .then(marker => {
        res.send(marker);
      })
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

return router;
};

