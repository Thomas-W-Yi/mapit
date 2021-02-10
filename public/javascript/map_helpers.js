$(() => {

  let theMarker = {};
  const $main = $("#main-content");

  navigator.geolocation.getCurrentPosition(function ({ coords }) {
    $mainMap.appendTo($main);
    const { latitude, longitude } = coords;
    const mymap = L.map("mymap").setView([latitude, longitude], 10);
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    L.tileLayer(tileUrl, { attribution }).addTo(mymap);
    theMarker = L.marker([latitude, longitude])
      .addTo(mymap)
      .bindPopup("This is our location.<br> Easily customizable.")
      .openPopup();
    mymap.on("click", function (event) {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      if (theMarker != undefined) {
        mymap.removeLayer(theMarker);
      };
      theMarker = L.marker([lat, lng])
        .addTo(mymap);
    });
  })

  // create makers on map
  const createMarkers = (mapId, mymap) => {
    getMarkersForMap(`map_id=${mapId}`).then(({ markers }) => {
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
            views_manager.show('updateMarkerForm');
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
    $("#mymap").append(`<div id="addMapDiv">
      <i id='addMap' class="fas fa-plus-circle"></i>
      </div>`);
    mymap.on("click", function (event) {
      mapClickMarker(id, map, event, mymap);
    });
    $("#addMap").on("click", function (e) {
      e.stopPropagation();

      $("#map-container").append(`${addMapFrom()}`);
      $("add-map-frm").on("submit", function (event) {
        event.preventDefault();
        let data = $(this).serialize();
      });
    });
  };

  window.createMap = createMap;

  // callback function for map items click event, which will show the map item on our app, a check mark will show on the current map
  const clickMap = (maps, currentMapId) => {

    let map;
    maps.map((obj) => {
      if (obj.id == currentMapId) {
        return (map = obj);
      }
    });
    createMap(map);
    mapLists.appendMaps({maps}, {currentMapId});
  };

  window.clickMap = clickMap;

  // callback function for point click event
  const clickPoint = (id, mapId, event, mymap) => {
    createMarkers(mapId, mymap);
    const { lat, lng } = event.latlng;

    getMyDetails().then(function (user) {
      if (user)

      $modifyMarkerForm.on("submit", function (e) {
        if ($modifyMarkerForm[0].checkValidity()) {
          e.preventDefault();
          let data = $(this).closest("form").serialize();
          data += `&id=${id}&latitude=${lat}&longitude=${lng}`;
          $.when(getMaps(`map_id=${mapId}`), updateMarker(data)).done((map) =>
            createMap(map[0].maps[0])
          );
        }
      });
      $modifyMarkerForm.on("click", "#button-delete", function (e) {
        e.preventDefault();
        $.when(
          getMaps(`map_id=${mapId}`),
          deleteMarker(`id=${id}`)
        ).done((map) => createMap(map[0].maps[0]));
      });
    });
  };

  window.clickPoint = clickPoint;

  const mapClickMarker = (id, map, event, mymap) => {
    // clear previous forms
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    // click event on mymap will create new marker to save/discard

    const myIcon = L.icon({
      iconUrl: `../images/maps-and-flags.png`,
      iconSize: [40, 40],
    });

    if (theMarker != undefined) {
      mymap.removeLayer(theMarker);
    };

    theMarker = L.marker([lat, lng], { icon: myIcon })
      .addTo(mymap);
    // once the form element appened to the DOM, we can fill the info and send it back to server to udpate the db

    getMyDetails().then(function (user) {
      if (user) {
        views_manager.show('newMarkerForm');
        $newMarkerForm.on("submit", function (e) {
          e.preventDefault();
          $newMarkerForm.val("")
          let data = $(this).serialize();
          data += `&map_id=${map.id}&latitude=${lat}&longitude=${lng}`;
          //^ this will have to be in the form I'm sure of it.
          //Either we use input type=disabled or type=hidden
          addMarker(data).then(() => createMap(map));
          views_manager.show('mapList');
        });
      }
    });
  };

  window.mapClickMarker = mapClickMarker;

});
