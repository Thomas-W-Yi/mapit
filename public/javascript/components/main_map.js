$(() => {
  const $mainMap = $(`

  <div id="map-container">
      <div id="mymap">
      </div>
      <div id="addMapDiv">
      <i id='addMap' class="fas fa-plus-circle"></i>
      </div>
    </div>
  `);
  window.$mainMap = $mainMap;

  $mainMap.on("click", "#addMapDiv", function (e) {
    views_manager.show("mapForm");
  });
  // We can add the event listeners of the MAPS ONLY HERE!!! (Any list related functions should be with list file itself)
});
