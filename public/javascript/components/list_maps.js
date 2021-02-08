$(() => {
  window.mapLists = {};

  const $mapList = $(`<ul id="listUl" class="list-group"><ul>`);

  window.$mapList = $mapList;

  function appendMap(map) {
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

  function appendMaps(maps, options = false) {
    for (const map in Object.values(maps)) {
      const mapListItem = mapList.createMapLi(map, options);
      appendMap(mapListItem);
    }
  }
  window.mapLists.appendMaps = appendMaps;



  $(`#listUl`).on("click", ".mapLi", function (event) {
    const id = event.target.id;
    getMaps().then((data) => {
      const { maps } = data;
      clickMap(maps, id);
    });

  });

});
