const OPTIONS = {
  infowindow: false,
  infowindowContent: null,
  infowindowAPI: null,
  analysis: false
};

class Overlay {

  constructor(map, options) {
    this.map = map;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = Object.assign({}, options, OPTIONS);
  }

  getTile(coord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('div');
    div.innerHTML = coord;
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.backgroundColor = '#ff0000';
    return div;
  }
}

export default Overlay;
