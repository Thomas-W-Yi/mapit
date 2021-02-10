$(() => {
  getMaps().then((maps) => {
    mapLists.appendMaps(maps);
    views_manager.show('mainMap');
  });
});
