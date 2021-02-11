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
  // $mainMap.on("click", "#addFav", function (e) {
  //   e.stopPropagation();
  //   console.log(e.target);
  // });

  // We can add the event listeners of the MAPS ONLY HERE!!! (Any list related functions should be with list file itself)
});
