$(() => {
  const $modifyMarkerForm =
    $(`
    <form id = 'update-marker-frm'>
    <input type="hidden" name="map_id" value="">
    <div class="form-group">
    <input type="text" placeholder="Latitude" name = 'latitude' class="form-control" id="InputText" value="" readonly required>
   </div>
   <div class="form-group">
    <input type="text" name='longitude' placeholder="Longitude" class="form-control" id="InputText" value="" readonly required>
   </div>
   <input type="hidden" name="id" value="">
    <div class="form-group">
    <input name="title" type="text" class="form-control" id="InputText"  placeholder="Enter Title" required>
    </div>
    <div class="form-group">
    <input name="description" type="text" class="form-control" id="InputDescription" placeholder="Description" required>
    </div>
    <div class="form-group">
    <input type="url" name="img_url" class="form-control" id="InputImgUrl" placeholder="Img Url" required>
    </div>
  <button type="button" id="submit-update" class="btn btn-primary">Update Point</button>
  <button type="button" id="submit-delete" class="btn btn-danger">Delete Point</button>
</form>
`);
  window.$modifyMarkerForm = $modifyMarkerForm;


  $modifyMarkerForm.on("click", "#submit-update", function (e) {
    if ($modifyMarkerForm[0].checkValidity()) {
      e.preventDefault();
      const mapId = $(this).closest('form').find('input').first().val();
      const data = $(this).closest('form').serialize();
      $.when(getMaps(`map_id=${mapId}`), updateMarker(data)).done((map) =>
        createMap(map[0].maps[0])
      );
    } else {
      alert('make sure to enter all fields with correct inputs');
    }
  });

  $modifyMarkerForm.on("click", "#submit-delete", function (e) {
    e.preventDefault();
    const mapId = $(this).closest('form').find('input').first().val();
    const id = $(this).closest('form').find('input').eq(3).val();
    $.when(
      getMaps(`map_id=${mapId}`),
      deleteMarker(`id=${id}`)
    ).done((map) => createMap(map[0].maps[0]));
  });

})
