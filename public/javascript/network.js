function getAllMaps(params) {
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
