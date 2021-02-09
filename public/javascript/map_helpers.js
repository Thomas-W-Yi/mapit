$(() => {
  const $main = $("#main-content");

  const fetchMyIP = () => {
    return axios.get("https://api.ipify.org?format=json");
  };

  window.fetchMyIP = fetchMyIP;

  const fetchCoordsByIP = function (body) {
    let ip = body.data.ip;
    return axios.get(`https://freegeoip.app/json/${ip}`);
  };

  window.fetchCoordsByIP = fetchCoordsByIP;

  const createMapWithCoords = function () {
    return fetchMyIP()
      .then(fetchCoordsByIP)
      .then((res) => {
        const { latitude, longitude } = res.data;
        return { latitude, longitude };
      });
  };

  window.createMapWithCoords = createMapWithCoords;

  createMapWithCoords()
    .then((res) => {
      $mainMap.appendTo($main);
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
        const lng = event.latlng.lng;
        L.marker([lat, lng])
          .addTo(mymap)
          .bindPopup(`map point lat: ${lat} and lng: ${lng}`)
          .openPopup();
      });
    })
    .catch();

  window.createMapWithCoords = createMapWithCoords;

  // create makers on map
  const createMarkers = (mapId, mymap) => {
    getMarkersForMap(`map_id=${mapId}`).then((data) => {
      const { markers } = data;
      for (const markerId in markers) {
        const {
          id,
          latitude,
          longitude,
          title,
          description,
          img_url,
        } = markers[markerId];

        const myIcon = L.icon({
          iconUrl: `${img_url}`,
          iconSize: [20, 40],
        });
        // add individual markers to the map
        L.marker([latitude, longitude], { icon: myIcon })
          // click event on marker will trigger new form for update/delete for this marker
          .on("click", function (event) {
            return (function () {
              clickPoint(id, mapId, event, mymap);
            })();
          })
          .addTo(mymap)
          .bindPopup(`<p>${title}<br />${description}.</p>`)
          .openPopup();
      }
    });
  };

  window.createMarkers = createMarkers;

  // create list map list based on the map date from map api, if second argument provided, we will use this to label the current map item
  const getList = (data, currentMapId) => {
    const { maps } = data;
    maps.map((obj) => {
      const map = obj;

      let mapListItem = `<li id="${map.id}" class="mapLi list-group-item-action list-group-item-`;
      switch (map.id % 5) {
        case 0:
          mapListItem += `success`;
          break;
        case 1:
          mapListItem += `info`;
          break;
        case 2:
          mapListItem += `dark`;
          break;
        case 3:
          mapListItem += `danger`;
          break;
        case 4:
          mapListItem += `warning`;
          break;
      }
      mapListItem += `">Map Id: ${map.id} - Map Name: ${map.name}</li>`;

      $mainMap.find("#listUl").append(mapListItem);
    });
    currentMapId
      ? $(`#${currentMapId}`).append('<i class="far fa-check-circle"></i>')
      : null;
  };

  window.getList = getList;

  const createMap = (map) => {
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
    createMarkers(id, mymap);
    mymap.on("click", function (event) {
      mapClickMarker(id, map, event, mymap);
    });
  };

  window.createMap = createMap;

  // callback function for map items click event, which will show the map item on our app, a check mark will show on the current map
  const clickMap = (maps, mapId) => {
    const id = mapId;
    let map;
    maps.map((obj) => {
      if (obj.id == id) {
        return (map = obj);
      }
    });
    createMap(map);
    $("#listUl").html("");
    const data = { maps };
    getList(data, id);
  };

  window.clickMap = clickMap;

  // callback function for point click event
  const clickPoint = (id, mapId, event, mymap) => {
    if ($("#save-point")) {
      $("#save-point").remove();
    }
    if ($("#update-point")) {
      $("#update-point").remove();
    }
    $(".leaflet-marker-icon").remove();
    $(".leaflet-popup").remove();
    createMarkers(mapId, mymap);
    const { lat, lng } = event.latlng;

    getMyDetails().then(function (user) {
      if (user)

        $("#map-container").append(`${modifyMarker(lat, lng)}`);

      $mainMap.find("#submit-update").on("click", function (e) {
        if ($mainMap.find("#update-marker-frm")[0].checkValidity()) {
          e.preventDefault();
          let data = $(this).closest("form").serialize();
          data += `&id=${id}&latitude=${lat}&longitude=${lng}`;
          $("#save-point").remove();
          updateMarker(data).then(() => {
            createMarkers(mapId, mymap);
          });
        }
      });
      $mainMap.find("#submit-delete").on("click", function (e) {
        e.preventDefault();
        $("#save-point").remove();
        deleteMarker(`id=${id}`).then(() => {
          createMarkers(mapId, mymap);
        });
      });
    });
  };

  window.clickPoint = clickPoint;

  const modifyMarker = (lat, lng) => {
    return `<div id = 'update-point'>
    <form id = 'update-marker-frm'>
  <div class="form-group">
    <input type="text" name = 'title' class="form-control" id="InputText" placeholder="Enter New Title" required>
  </div>
  <div class="form-group">
    <input type="text" name='description' class="form-control" id="InputDescription" placeholder="Enter New Description" required>
  </div>
  <div class="form-group">
    <input type="url" name = 'img_url' class="form-control" id="InputImgUrl" placeholder="Update img url" required>
  </div>
  <button type="button" id="submit-update" class="btn btn-primary">Update Point</button>
  <button type="button" id="submit-delete" class="btn btn-danger">Delete Point</button>
</form>
    </div>`;
  };

  window.modifyMarker = modifyMarker;

  const mapClickMarker = (id, map, event, mymap) => {
    // clear previous forms
    if ($("#save-point")) {
      $("#save-point").remove();
    }
    if ($("#update-point")) {
      $("#update-point").remove();
    }
    $(".leaflet-marker-icon").remove();
    $(".leaflet-popup").remove();
    createMarkers(id, mymap);
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    // click event on mymap will create new marker to save/discard

    const myIcon = L.icon({
      iconUrl: `../images/maps-and-flags.png`,
      iconSize: [40, 40],
    });
    L.marker([lat, lng], { icon: myIcon })
      .addTo(mymap)
      .bindPopup(`map point lat: ${lat} and long: ${lng}`)
      .openPopup();
    // once the form element appened to the DOM, we can fill the info and send it back to server to udpate the db

    getMyDetails().then(function (user) {
      if (user) {
        $("#map-container").append(newMarkerForm(lat, lng, map));
        $mainMap.on("submit", "#new-marker-frm", function (e) {
            e.preventDefault();
            let data = $(this).serialize();
            data += `&map_id=${map.id}&latitude=${lat}&longitude=${lng}`;
            addMarker(data);
            $("#save-point").remove();
            createMarkers(map.id, mymap);
        });
      }
    });
  };

  window.mapClickMarker = mapClickMarker;

  const newMarkerForm = (lat, lng, map) => {
    return `<div id = 'save-point'>
    <form id = 'new-marker-frm'>
    <div class="form-group">
    <input type="text" class="form-control" id="InputText"  placeholder="Enter Title" required>
    </div>
    <div class="form-group">
    <input type="text" class="form-control" id="InputDescription" placeholder="Description" required>
    </div>
    <div class="form-group">
    <input type="" class="form-control" id="InputImgUrl" placeholder="Img Url" required>
    </div>
    <button type="submit" class="btn btn-primary">Save Point</button>
    </form>
    </div>`;
  };

  window.newMarkerForm = newMarkerForm;
});
