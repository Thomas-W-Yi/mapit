$(() => {
  const $main = $('#main-content');

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
  const createMarkers = (id, mymap) => {
    getMarkersForMap(`map_id=${id}`).then((data) => {
      const { markers } = data;
      for (const id in markers) {
        const { latitude, longitude, title, description, img_url } = markers[
          id
        ];
        const myIcon = L.icon({
          iconUrl: `${img_url}`,
          iconSize: [20, 40],
          shadowSize: [0, 0],
        });
        // add individual markers to the map
        L.marker([latitude, longitude], { icon: myIcon })
          // click event on marker will trigger new form for update/delete for this marker
          .on("click", function(event) {
            return function() {
              clickPoint(id,event, mymap);
            }();
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

      let mapListItem = `<li id="${map.id}" class="mapLi list-group-item-action list-group-item-`
      switch (map.id % 5) {
        case (0):
          mapListItem += `success`;
          break;
        case (1):
          mapListItem += `info`;
          break;
        case (2):
          mapListItem += `dark`;
          break;
        case (3):
          mapListItem += `danger`;
          break;
        case (4):
          mapListItem += `warning`;
          break;
      }
      mapListItem += `">Map Id: ${map.id} - Map Name: ${map.name}</li>`;


      $mainMap.find('#listUl').append(mapListItem);
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
      const clickPoint = (id, event, mymap) => {
        if ($("#save-point")) {
          $("#save-point").remove();
        }
        if ($("#update-point")) {
          $("#update-point").remove();
        }
        $(".leaflet-marker-icon").remove();
        $(".leaflet-popup").remove();
        createMarkers(id, mymap);
        const { lat, lng } = event.latlng;
        // let icon = event.target.setIcon();
        let popup = event.target.getPopup();
        // update content on marker
        // popup.setContent("<p>new content</p>");
        // add new form so we can update or delete marker
        $("#map-container").append(`${modifyMarker(lat, lng)}`);
        $mainMap.find("#submit-update").on("click", function (e) {
          e.preventDefault();
          console.log(e.target);
          let data = $(this).closest('form').serialize();
          data += `&map_id=${id}&latitude=${lat}&longitude=${lng}`;
          console.log(data);
          updateMarker(data);
          $("#save-point").remove();
          createMarkers(id, mymap);
        });
         $mainMap.find("#submit-delete").on("click", function (e) {
           e.preventDefault();
           console.log(e.target);
           deleteMarker(data);
           $("#save-point").remove();
           createMarkers(id, mymap);
         });
      };

  window.clickPoint = clickPoint;

  const modifyMarker = (lat, lng) => {
    return `<div id = 'update-point'>
    <form id = 'update-marker-frm'>
  <div class="form-group">
    <label>Latitude: ${lat}</label>
    <label>Longitude: ${lng}</label>
    <input type="text" name = 'title' class="form-control" id="InputText" placeholder="Enter New Title">
  </div>
  <div class="form-group">
    <input type="text" name='description' class="form-control" id="InputDescription" placeholder="Enter New Description">
  </div>
  <div class="form-group">
    <input type="text" name = 'img_url' class="form-control" id="InputImgUrl" placeholder="Update img url">
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
    $("#map-container").append(newMarkerForm(lat, lng, map));
    L.marker([lat, lng])
      .addTo(mymap)
      .bindPopup(`map point lat: ${lat} and long: ${lng}`)
      .openPopup();
    // once the form element appened to the DOM, we can fill the info and send it back to server to udpate the db
    console.log($mainMap.find("#save-point"));
    $mainMap.on("submit",'#new-marker-frm', function (e) {
      e.preventDefault();
      console.log(e.target);
      let data = $(this).serialize();
      data += `map_id=${map.id}&latitude=${lat}&longitude=${lng}`;
      console.log(data);
      addMarker(data);
      $("#save-point").remove();
      createMarkers(map.id, mymap);
    });
  };

  window.mapClickMarker = mapClickMarker;


  const newMarkerForm = (lat, lng, map) => {
    return $(`<div id = 'save-point'>
    <form id = 'new-marker-frm'>
    <div class="form-group">
    <label>Latitude: ${lat}</label>
    <label>Longitude: ${lng}</label>
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
    </form>
    </div>`);
  };

  window.newMarkerForm = newMarkerForm;

});

