$(() => {
  window.mapList = {};

  //create map list item eg.
  //<article>
  // ...
  //</article>

  function createMap(
    map,
    { isCreated = false, isFavorites = false, isContributed = false } = false
  ) {
    let mapList;
    switch (map.id % 5) {
      case (0):
        mapList = `<li class="list-group-item-action list-group-item-success">${map.name}</li>`;
        break;
      case (1):
        mapList = `<li class="list-group-item-action list-group-item-info">${map.name}</li>`;
        break;
      case (2):
        mapList = `<li class="list-group-item-action list-group-item-dark">${map.name}</li>`;
        break;
      case (3):
        mapList = `<li class="list-group-item-action list-group-item-danger">${map.name}</li>`;
        break;
      case (4):
        mapList = `<li class="list-group-item-action list-group-item-warning">${map.name}</li>`;
        break;
    }

    return mapList;
  }

  window.mapList.createMap = createMap;
});
