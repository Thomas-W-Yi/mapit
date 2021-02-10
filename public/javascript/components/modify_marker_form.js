$(() => {
  const $modifyMarker =
    $(`
    <form id = 'update-marker-frm'>
  <div class="form-group">
    <input type="text" name = 'title' class="form-control" id="InputText" placeholder="Enter New Title" required>
  </div>
  <div class="form-group">
    <input type="text" name='description' class="form-control" id="InputDescription" placeholder="Enter New Description" required>
  </div>
  <div class="form-group">
    <input type="url" name = 'img_url' class="form-control" id="InputImgUrl" placeholder="Update img url" required>
  </div>
  <button type="button" id="submit-update" class="btn btn-primary">Update Point</button>
  <button type="button" id="submit-delete" class="btn btn-danger">Delete Point</button>
</form>
`);
  window.$modifyMarker = $modifyMarker;
})
