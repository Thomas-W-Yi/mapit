$(() => {
  const fetchMyIP = () => {
    return axios.get("https://api.ipify.org?format=json");
  };

  const fetchCoordsByIP = function (body) {
    let ip = body.data.ip;
    // console.log(ip);
    return axios.get(`https://freegeoip.app/json/${ip}`);
  };

  const createMapWithCoords = function () {
    return fetchMyIP()
      .then(fetchCoordsByIP)
      .then((res) => {
        // console.log(res);
        const { latitude, longitude } = res.data;
        return { latitude, longitude };
      });
  };

  const getAllMaps = () => {
    const url = "/api/maps";
    return $.ajax({ url }).then((res) => res.rows);
  };

  const getAllPoints = (mapId) => {
    const url = "/api/map_points";
    return $.ajax({ url }).then((res) => res.rows);
  };

  const createMap = (map) => {
    // remove previous map before add new map
    if (mymap && mymap.remove) {
      mymap.remove();
    }
    $("#map-container").html("");
    $("#map-container").html('<div id="mymap"></div>');

    // get lat, lng, name, and id from map obj
    const { latitude, longitude, name, id } = map;

    // create mapObj
    const mymap = L.map("mymap").setView([latitude, longitude], 10);

    // fill the map with tiles, we use openstreetmap api
    const attribution = `${name} is created by ${map.user_name}`;
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    L.tileLayer(tileUrl, { attribution }).addTo(mymap);

    // add markers/points to map, and we get points data from our apiRoutes
    getAllPoints(id).then((map_points) => {
      for (const id in map_points) {
        const { latitude, longitude, title, des, marker_url } = map_points[id];
        const myIcon = L.icon({
          iconUrl: `${marker_url}`,
          iconSize: [20, 40],
        });
        // add individual markers to the map
        L.marker([latitude, longitude], { icon: myIcon })
          // click event on marker will trigger new form for update/delete for this marker
          .on("click", clickPoint)
          .addTo(mymap)
          .bindPopup(`<p>${title}<br />${des}.</p>`)
          .openPopup();
      }
    });

    mymap.on("click", function (event) {
      const lat = event.latlng.lat;
      const long = event.latlng.lng;
      // click event on mymap will create new marker to save/discard
      $("#map-container").append(`<div id = 'save-point'>
    <form>
  <div class="form-group">
    <label>Latitude: ${lat}</label>
    <label>Longitude: ${long}</label>
    <label>map_id: ${map.id}</label>
    <label>map_id: ${map.user_id}</label>
    <input type="text" class="form-control" id="InputText" aria-describedby="emailHelp" placeholder="Enter Title">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="InputDescription" placeholder="Description">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="InputImgUrl" placeholder="Img Url">
  </div>
  <button type="submit" class="btn btn-primary">Save Point</button>
  <button type="submit" class="btn btn-warning">Discard</button>
</form>
    </div>`);
      L.marker([lat, long])
        .addTo(mymap)
        .bindPopup(`map point lat: ${lat} and long: ${long}`)
        .openPopup();
    });
  };

  // create map on our landing page when use first get into our app. latitude and longitude were aquaired from user's IP address
  createMapWithCoords()
    .then((res) => {
      const { latitude, longitude } = res;
      const mymap = L.map("mymap").setView([latitude, longitude], 10);
      const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      L.tileLayer(tileUrl, { attribution }).addTo(mymap);
      L.marker([latitude, longitude])
        .addTo(mymap)
        .bindPopup("This is our location.<br> Easily customizable.")
        .openPopup();
      mymap.on("click", function (event) {
        const lat = event.latlng.lat;
        const long = event.latlng.lng;
        L.marker([lat, long])
          .addTo(mymap)
          .bindPopup(`map point lat: ${lat} and long: ${long}`)
          .openPopup();
      });
    })
    .catch();

  getAllMaps().then((maps) => {
    for (const id in maps) {
      const map = maps[id];
      $("listUl").append(`<li id='${id}'>${map.name}</li>`);
      $(`#${id}`).click(function (map) {
        createMap(map);
      });
    }
  });
});
