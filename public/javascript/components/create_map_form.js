$(() => {
  const $mapForm = $(`<div id = 'addMapForm'>
    <form id = 'add-map-frm'>
    <div class="form-group">
    <input name="name" type="text" class="form-control" id="InputText"  placeholder="Enter Map Name" required>
    </div>
    <div class="form-group">
    <input name="address" type="text" class="form-control" id="InputDescription" placeholder="Enter The Address" required>
    </div>
    <button type="submit" class="btn btn-primary">Create Map</button>
    </form>
    </div>`);


  window.$mapForm = $mapForm;
});


