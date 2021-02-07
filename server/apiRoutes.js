module.exports = function (router, database) {


  // Main GET maps route to get the maps----- either all maps or filtered through req.query
  router.get('/maps', (req, res) => {
    console.log('!!!');
    database.getMaps(req.query)
    .then(maps => res.send({maps}))
    .catch((error) => {
      console.error(error);
      res.send(error)
    });
  });


  // GET route to get the markers of a map
  router.get('/markers', (req, res) => {
    database.getMarkersForMap(req.query)
    .then(markers => res.send({markers}))
    .catch((error) => {
      console.error(error);
      res.send(error)
    });
  });

  // api POST route for creating a new map

  router.post('/maps', (req, res) => {
    const userId = req.session.userId;
    database.addMap({...req.body, user_id: userId})
      .then(map => res.send(map))
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

  // api POST route for creating a new marker

  router.post('/markers', (req, res) => {
    const userId = req.session.userId;
    database.addMarker({...req.body, user_id: userId})
      .then(marker => res.send(marker))
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

  // api POST route for deleting a marker

  router.delete('/markers', (req, res) => {
    const userId = req.session.userId;
    database.deleteMarker({...req.body, user_id: userId})
      .then(() => res.status(200).send(1))
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

  // api POST route for modifying a marker

  router.put('/markers', (req, res) => {
    const userId = req.session.userId;
    database.updateMarker({...req.body, user_id: userId})
      .then(marker => res.send(marker))
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

  // api route for favorting a map
  router.post('/favorites', (req, res) => {
    const userId = req.session.userId;
    database.addFavorite({...req.body, user_id: userId})
      .then(favorite => res.send(favorite))
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

  //api route for unfavorating a map

  router.delete('/favorites', (req, res) => {
    const userId = req.session.userId;
    database.deleteFavorite({...req.body, user_id: userId})
      .then(() => res.status(200).send(1))
      .catch((error) => {
        console.error(error);
        res.send(error);
      });
  });

return router;
};



