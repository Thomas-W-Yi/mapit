// --------- GET ROUTES ----------


function getMaps(params) {
  let url = "/api/maps";
  if (params) {
    url += "?" + params;
  }
  return $.ajax({
    url,
  });
}

function getMarkersForMap(mapId) {
  let url = `/api/markers?${mapId}`;
  return $.ajax({
    url,
  });
}

function getMyDetails() {
  return $.ajax({
    url: "/users/me",
  });
}


// -------- POST ROUTES ---------

function addMap(data) {
  return $.ajax({
    method: 'POST',
    url:"/api/maps",
    data,
  });
}

function addMarker(data) {
  return $.ajax({
    method: 'POST',
    url:"/api/markers",
    data,
  });
}

function addFavorite(data) {
  return $.ajax({
    method: 'POST',
    url:"/api/favorites",
    data,
  });
}

function signUp(data) {
  return $.ajax({
    method: "POST",
    url: "/users",
    data
  });
}


function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/users/login",
    data
  });
}

function logOut() {
  return $.ajax({
    method: "POST",
    url: "/users/logout",
  })
}


// -------- PUT ROUTES ---------

function updateMarker(data) {
  return $.ajax({
    method: 'PUT',
    url:"/api/markers",
    data,
  });
}




// -------- DELETE ROUTES ---------

function deleteMarker(data) {
  return $.ajax({
    method: 'DELETE',
    url:"/api/markers",
    data,
  });
}

function deleteFavorite(data) {
  return $.ajax({
    method: 'DELETE',
    url:"/api/favorites",
    data,
  });
}
