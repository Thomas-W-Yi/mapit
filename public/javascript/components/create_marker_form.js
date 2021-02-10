$(() => {
  const $newMarkerForm = $(`
    <form id = 'new-marker-frm'>
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
    $newMarkerForm.val("")
    let data = $(this).serialize();
    data += `&map_id=${map.id}&latitude=${lat}&longitude=${lng}`;
    addMarker(data).then(() => createMap(map));
    views_manager.show('mapList');
  });
})
