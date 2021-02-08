$(() => {

  const $mainMap = $(`
  <div id="map-container">
      <div id="mymap"></div>
    </div>
    <div id="maplist">
    <ul id="listUl" style="list-style-type: none"></ul>
  </div>
  `);
  window.$mainMap = $mainMap;

  getMaps().then(getList);

  //We can add the event listeners of the MAPS ONLY HERE!!! (Any list related functions should be with list file itself)
});
