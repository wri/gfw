/* eslint-disable */
export default {
  allowIntersection: false,
  drawError: {
    color: '#ed1846',
    message: "<strong>Oh snap!<strong> you can't draw that!"
  },
  icon: new L.DivIcon({
    iconSize: new L.Point(15, 15),
    className: 'leaflet-div-icon leaflet-editing-icon draw-icon'
  }),
  shapeOptions: {
    color: '#97be32',
    fill: false,
    weight: 3,
    opacity: 1
  }
};
