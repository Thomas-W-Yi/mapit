$(() => {
  window.mapLists = {};

  const $mapList = $(` <ul id="listUl" style="list-style-type: none"></ul>`);

  window.$mapList = $mapList;

  function appendMap(map) {
    $mapList.append(map);
  }

  function appendMaps({ maps }, currentMapId = false) {
    getMyDetails()
      .then((json) => {
        $mapList.children().remove();
        for (const map of maps) {
          const mapListItem = mapList.createMapLi(map, json.user);
          appendMap(mapListItem);
        }
        currentMapId
          ? $(`#${currentMapId}`).append(
            '<i class="far fa-check-circle"></i>'
          )
          : null;
      })
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
      .then(getMyDetails)
      .then(({ user }) => getMaps(`${window.currentList}${user.id}`))
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
      .then(getMyDetails)
      .then(({ user }) => getMaps(`${window.currentList}${user.id}`))
      .then((maps) => {
        appendMaps(maps);
        views_manager.show("mapList");
      });
  });
});
