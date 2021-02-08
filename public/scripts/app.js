$(() => {


  const modifyMarker = (lat, lng) => {
    return `<div id = 'update-point'>
    <form id = 'update-marker-frm'>
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
    </div>`;
  };

  // create makers on map
  const createMarkers = (id, mymap) => {
    getMarkersForMap(`map_id=${id}`).then((data) => {
      const { markers } = data;
      console.log(markers);
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
          .on("click", clickPoint)
          .addTo(mymap)
          .bindPopup(`<p>${title}<br />${description}.</p>`)
          .openPopup();
      }
    });
  };

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
  };
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

  // create map on our landing page when use first get into our app. latitude and longitude were aquaired from user's IP address


  // create list map list based on the map date from map api, if second argument provided, we will use this to label the current map item
  const getList = (data, currentMapId) => {
    const { maps } = data;
    maps.map((obj) => {
      const map = obj;
      $("#listUl").append(
        `<li id='${map.id}' class='mapLi'>Map Id: ${map.id} - Map Name: ${map.name}</li>`
      );
    });
    currentMapId
      ? $(`#${currentMapId}`).append('<i class="far fa-check-circle"></i>')
      : null;
  };

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

  // callback function for point click event
  const clickPoint = (event) => {
    if ($("#save-point")) {
      $("#save-point").remove();
    }
    if ($("#update-point")) {
      $("#update-point").remove();
    }
    console.log(event.target.getPopup());
    const { lat, lng } = event.latlng;
    console.log(event.latlng);
    // let icon = event.target.setIcon();
    let popup = event.target.getPopup();
    // update content on marker
    // popup.setContent("<p>new content</p>");
    // add new form so we can update or delete marker
    $("#map-container").append(`${modifyMarker(lat, lng)}`);

    $("#update-marker-frm").on("submit", function (event) {
      event.preventDefault();
      const title = $(this).children("#InputText");
      const description = $(this).children("#InputDescription");
      const img_url = $(this).children("#InputImgUrl");
      // data should have map_id, lat, long, user_id, title, img_url
      // seriralze the data before sending out
      data.serialize();
    });
  };

  // event listener for map list items
  $(`#listUl`).on("click", ".mapLi", function (event) {
    const id = event.target.id;
    getMaps().then((data) => {
      const { maps } = data;
      clickMap(maps, id);
    });
  });

  // get the map list on our landing page when user first land on our app
  getMaps().then((maps) => {
    getList(maps);
  });

});
