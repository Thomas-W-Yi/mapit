$(() => {
  const $newMarkerForm = $(`
    <form id = 'new-marker-frm'>
    <input type="hidden" name="map_id" value="">
    <div class="form-group">
    <input type="text" placeholder="Latitude" name = 'latitude' class="form-control" id="InputText" value="" readonly required>
   </div>
   <div class="form-group">
    <input type="text" name='longitude' placeholder="Longitude" class="form-control" id="InputText" value="" readonly required>
   </div>
    <div class="form-group">
    <input name="title" type="text" class="form-control" id="InputText"  placeholder="Enter Title" required>
    </div>
    <div class="form-group">
    <input name="description" type="text" class="form-control" id="InputDescription" placeholder="Description" required>
    </div>
    <div class="form-group">
    <input type="url" name="img_url" class="form-control" id="InputImgUrl" placeholder="Img Url" required>
    </div>
    <button type="submit" class="btn btn-primary">Save Point</button>
    </form>
  `);

  window.$newMarkerForm = $newMarkerForm;

  $newMarkerForm.on("submit", function (e) {
    e.preventDefault();
    const mapId = $(this).find('input').first().val();
    const data = $(this).serialize();
    addMarker(data)
    .then(() => getMaps(`map_id=${mapId}`))
    .then(({maps}) =>
    createMap(maps[0]))
    ;
    views_manager.show('mapList');
  });

})
