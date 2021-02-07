function getAllMaps(params) {
  let url = "/api/maps";
  if (params) {
    url += "?" + params;
  }
  return $.ajax({
    url,
  });
}
