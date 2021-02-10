$(() => {
  const $mainMap = $(`

  <div id="map-container">
      <div id="mymap">
      </div>
      <div id="addMapDiv">
      <i id='addMap' class="fas fa-plus-circle"></i>
      </div>
    </div>
    <div id="maplist">
  </div>
  `);
  window.$mainMap = $mainMap;

  getMaps().then(getList);

  // We can add the event listeners of the MAPS ONLY HERE!!! (Any list related functions should be with list file itself)
});
