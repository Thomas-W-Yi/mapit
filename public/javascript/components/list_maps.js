$(() => {
  window.mapLists = {};

  function addMap(map) {
    $listMaps.append(map);
  }
  function clearMaps() {
    $listMaps.empty();
  }
  window.mapLists.clearMaps = clearMaps;

  /**
   * Get all MAPS (list). if we decide to add buttons onto the list options is that only purpose
   * @param {{
   * isCreated = false,
   * isFavorites = false,
   * isContributed = false
   * }} options An object containing conditional options.
   *
   */

  function addMaps(maps, options = false) {
    clearMaps();
    for (const map in Object.values(maps)) {
      const mapListItem = mapList.createMap(map, options);
      addMap(mapListItem);
    }
  }
  window.mapLists.addMaps = addMaps;
});
