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

  const newMarkerForm = (lat, long, map) => {
    return `<div id = 'save-point'>
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
    </div>`;
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
      $("#map-container").append(newMarkerForm(lat, long, map));
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

  // create list map list based on the map date from map api, if second argument provided, we will use this to label the current map item
  const getList = (maps, currentMapId) => {
    for (const id in maps) {
      const map = maps[id];
      $("#listUl").append(`<li id='${id}' class='mapLi'>${map.name}</li>`);
    }
    console.log(currentMapId);
    currentMapId
      ? $(`#${currentMapId}`).append('<i class="far fa-check-circle"></i>')
      : null;
  };

  // callback function for map items click event, which will show the map item on our app, a check mark will show on the current map
  const clickMap = (maps, mapId) => {
    const id = mapId;
    createMap(maps[id]);
    $("#listUl").html("");
    getList(maps, id);
  };

  // callback function for point click event
  const clickPoint = (event) => {
    console.log(event.target.getPopup());
    const { lat, lng } = event.latlng;
    // let icon = event.target.setIcon();
    let popup = event.target.getPopup();
    // update content on marker
    popup.setContent("<p>new content</p>");
    // add new form so we can update or delete marker
    $("#map-container").append(`<div id = 'save-point'>
    <form>
  <div class="form-group">
    <label>Latitude: ${lat}</label>
    <label>Longitude: ${lng}</label>
    <input type="text" class="form-control" id="InputText" placeholder="Enter New Title">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="InputDescription" placeholder="Enter New Description">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" id="InputImgUrl" placeholder="Update img url">
  </div>
  <button type="submit" class="btn btn-primary">Update Point</button>
  <button type="submit" class="btn btn-danger">Delete Point</button>
</form>
    </div>`);
  };

  // event listener for map list items
  $(`.mapLi`).on("click", function (event) {
    const id = event.target.id;
    clickMap(maps, id);
  });

  // get the map list on our landing page when user first land on our app
  getAllMaps().then((maps) => {
    getList(maps);
  });
});
