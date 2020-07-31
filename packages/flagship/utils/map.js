export const getPolygonCenter = polygon => {
  const vertices = polygon.getPath();
  const latitude = [];
  const longitude = [];
  for (let i = 0; i < vertices.length; i++) {
    longitude.push(vertices.getAt(i).lng());
    latitude.push(vertices.getAt(i).lat());
  }
  latitude.sort();
  longitude.sort();
  const lowX = latitude[0];
  const highX = latitude[vertices.length - 1];
  const lowY = longitude[0];
  const highY = longitude[vertices.length - 1];

  const center = new google.maps.LatLng( // eslint-disable-line
    lowX + (highX - lowX) / 2,
    lowY + (highY - lowY) / 2
  );
  const top = new google.maps.LatLng(highX, lowY + (highY - lowY) / 2); // eslint-disable-line
  const bottom = new google.maps.LatLng(lowX, lowY + (highY - lowY) / 2); // eslint-disable-line
  const right = new google.maps.LatLng(lowX + (highX - lowX) / 2, highY); // eslint-disable-line
  const left = new google.maps.LatLng(lowX + (highX - lowX) / 2, lowY); // eslint-disable-line

  return {
    center,
    top,
    bottom,
    left,
    right
  };
};
