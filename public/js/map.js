document.addEventListener("DOMContentLoaded", () => {

  const mapDiv = document.getElementById("map");

  if (!mapDiv) return;

  const coordinates = JSON.parse(mapDiv.dataset.coordinates);
  const title = mapDiv.dataset.title;
  const location = mapDiv.dataset.location;

  const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: coordinates,
    zoom: 8,
  });

  // Create popup
  const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML(`
      <div style="font-family: sans-serif;">
        <strong>${title}</strong>
        <p>${location}</p>
      </div>
    `);

  // Add marker with popup
  new maplibregl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map)
});
