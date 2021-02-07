$(() => {
  window.mapList = {};

  function createMap(
    map,
    { isCreated = false, isFavorites = false, isContributed = false } = false
  ) {

    let mapList = `<li id="${map.id}" class="list-group-item-action list-group-item-`
    switch (map.id % 5) {
      case (0):
        mapList += `success`;
        break;
      case (1):
        mapList += `info`;
        break;
      case (2):
        mapList += `dark`;
        break;
      case (3):
        mapList += `danger`;
        break;
      case (4):
        mapList += `warning`;
        break;
    }
    mapList += `">${map.name}</li>`;

    return mapList;
  }

  window.mapList.createMap = createMap;

});
