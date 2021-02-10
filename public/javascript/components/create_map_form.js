$(() => {
  const $mapForm = $(`
    <form id = 'add-map-frm'>
    <div class="form-group">
    <input name="name" type="text" class="form-control" id="InputText"  placeholder="Enter Map Name" required>
    </div>
    <div class="form-group">
    <input name="street" type="text" class="form-control" id="InputDescription" placeholder="Enter the housenumber and street" required>
    </div>
    <div class="form-group">
    <input name="city" type="text" class="form-control" id="InputDescription" placeholder="Enter The city" required>
    </div>
    <div class="form-group">
    <input name="country" type="text" class="form-control" id="InputDescription" placeholder="Enter The country" required>
    </div>
    <button type="submit" class="btn btn-primary">Create Map</button>
    </form>`);

  window.$mapForm = $mapForm;

  $mapForm.on("submit", function (e) {
    e.preventDefault();
    const data = $(this).serializeArray();
    let url = `https://nominatim.openstreetmap.org/search?q=${data[1].value},+${data[2].value}+${data[3].value}&&format=json&polygon=1&addressdetails=1`;
    axios.get(url).then((res) => {
      const send = `name=${data[0].value}&latitude=${res.data[0].lat}&longitude=${res.data[0].lon}`;
      console.log(send);
      addMap(send).then((res) => {
        getMaps().then((maps) => {
          mapLists.appendMaps(maps);
        });
        views_manager.show("mapList");
      });
    });

    // addMarker(data)
    //   .then(() => getMaps(`map_id=${mapId}`))
    //   .then(({ maps }) => createMap(maps[0]));
    // views_manager.show("mapList");
  });
});
