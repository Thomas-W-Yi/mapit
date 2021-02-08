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

//test only
$.when(getMaps(`map_id=${1}`), getMarkersForMap(`map_id=${1}`)).done((data1, data2) => console.log(data1,data2));
