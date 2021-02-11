$(() => {
  window.mapLists = {};

  const $mapList = $(` <ul id="listUl" style="list-style-type: none"></ul>`);

  window.$mapList = $mapList;

  function appendMap(map) {
    $mapList.append(map);
  }

  /**
   * Get all MAPS (list). if we decide to add buttons onto the list options (stretch)
   * @param {{
   * isCreated = false,
   * isFavorites = false,
   * isContributed = false,
   * currentMapId = null
   * }} options An object containing conditional options.
   *
   */

  function appendMaps({ maps }, options = false) {
    $mapList.children().remove();
    for (const map of maps) {
      const mapListItem = mapList.createMapLi(map, options);
      appendMap(mapListItem);
    }
    options.currentMapId
      ? $(`#${options.currentMapId}`).append(
          '<i class="far fa-check-circle"></i>'
        )
      : null;
  }
  window.mapLists.appendMaps = appendMaps;

  $mapList.on("click", ".mapLi", function (event) {
    getMaps().then((data) => {
      const { maps } = data;
      clickMap(maps, event.target.id);
    });
  });
  $mapList.on("click", ".far", function (event) {

    event.stopPropagation();
    const id = $(this).parent().attr("id");
    const data = `map_id=${id}`;
    addFavorite(data)
      .then(() => getMaps(window.currentList))
      .then((maps) => {

        appendMaps(maps);
        views_manager.show("mapList");
      });
  });

  $mapList.on("click", ".fas", function (event) {

    event.stopPropagation();
    const id = $(this).parent().attr("id");
    const data = `map_id=${id}`;
    deleteFavorite(data)
      .then(() =>getMaps(window.currentList))
      .then((maps) => {
        appendMaps(maps);
        views_manager.show("mapList");
      });
  });
});
