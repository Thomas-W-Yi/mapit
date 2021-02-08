const $main = $('#main-content');

$(() => {
  const fetchMyIP = () => {
    return axios.get("https://api.ipify.org?format=json");
  };

  const fetchCoordsByIP = function (body) {
    let ip = body.data.ip;
    return axios.get(`https://freegeoip.app/json/${ip}`);
  };

  const createMapWithCoords = function () {
    return fetchMyIP()
      .then(fetchCoordsByIP)
      .then((res) => {
        const { latitude, longitude } = res.data;
        return { latitude, longitude };
      });
  };

  createMapWithCoords()
  .then((res) => {
    $mainMap.appendTo($main);
    const { latitude, longitude } = res;
    const mymap = L.map("mymap").setView([latitude, longitude], 10);
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    L.tileLayer(tileUrl, { attribution }).addTo(mymap);
    L.marker([latitude, longitude])
      .addTo(mymap)
      .bindPopup("This is our location.<br> Easily customizable.")
      .openPopup();
    mymap.on("click", function (event) {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      L.marker([lat, lng])
        .addTo(mymap)
        .bindPopup(`map point lat: ${lat} and lng: ${lng}`)
        .openPopup();
    });
  })
  .catch();
});
