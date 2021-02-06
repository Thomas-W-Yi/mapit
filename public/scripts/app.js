$(() => {
  const fetchMyIP = () => {
    return axios.get("https://api.ipify.org?format=json");
  };

  const fetchCoordsByIP = function (body) {
    let ip = body.data.ip;
    // console.log(ip);
    return axios.get(`https://freegeoip.app/json/${ip}`);
  };

  const createMapWithCoords = function () {
    return fetchMyIP()
      .then(fetchCoordsByIP)
      .then((res) => {
        // console.log(res);
        const { latitude, longitude } = res.data;
        return { latitude, longitude };
      });
  };

  const getAllmaps = () => {
    let url = "/api/maps";
    return $.ajax({ url });
  };

  const createMap = (map, map_points) => {
    const { latitude, longitude } = map;
    const mymap = L.map("mymap").setView([latitude, longitude], 10);
    const attribution = `${map.name} is created by ${map.user_name}`;
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    L.tileLayer(tileUrl, { attribution }).addTo(mymap);
    for (const id in map_points) {
      const { latitude, longitude, title, des, marker_url } = map_points[id];
      const myIcon = L.icon({
        iconUrl: `${marker_url}`,
        iconSize: [38, 95],
      });
      L.marker([latitude, longitude], { icon: myIcon })
        .addTo(mymap)
        .bindPopup(`<p>${title}<br />${des}.</p>`)
        .openPopup();
    }
  };

  createMapWithCoords()
    .then((res) => {
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
        const long = event.latlng.lng;
        L.marker([lat, long])
          .addTo(mymap)
          .bindPopup(`map point lat: ${lat} and long: ${long}`)
          .openPopup();
      });
    })
    .catch();
});
