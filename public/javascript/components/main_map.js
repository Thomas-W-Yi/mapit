$(() => {

  const $mainMap = $(`
  <div id="map-container">
      <div id="mymap"></div>
    </div>
  `);
  window.$mainMap = $mainMap;

  getMaps().then((maps) => {
    getList(maps);
  });
  //We can add the event listeners of the MAPS ONLY HERE!!! (Any list related functions should be with list file itself)
});
