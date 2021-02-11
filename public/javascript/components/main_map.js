$(() => {
  const $mainMap = $(`

  <div id="map-container">
      <div id="mymap">
      </div>
    </div>
  `);
  window.$mainMap = $mainMap;

  $mainMap.on("click", "#addMapDiv", function (e) {
    views_manager.show("mapForm");
  });
});
