$(() => {
  window.mapLists = {};

  const $mapList = `<ul class="list-group"><ul>`;

  function addMap(map) {
    $mapList.append(map);
  }

  /**
   * Get all MAPS (list). if we decide to add buttons onto the list options (stretch)
   * @param {{
   * isCreated = false,
   * isFavorites = false,
   * isContributed = false
   * }} options An object containing conditional options.
   *
   */

  function addMaps(maps, options = false) {
    for (const map in Object.values(maps)) {
      const mapListItem = mapList.createMap(map, options);
      addMap(mapListItem);
    }
  }
  window.mapLists.addMaps = addMaps;


  $($mapList).click(function(evt) {
    const listMapItem = $(evt);
    const mapId = listMapItem.attr('id');
    listMapItem.detatch();
    $('.list-group').prepend(listMapItem);
   $.when(getMaps(`map_id=${mapId}`), getMarkersForMap(`map_id=${mapId}`)).done((data1, data2) => console.log(data1, data2));
  });
});
