App.Views.ForestLayer = App.Views.CanvasLayer.extend({

  initialize: function() {
    this.dataMaxZoom = 12;
    this.name = "forest2000";
    this.url = 'http://earthengine.google.org/static/hansen_2013/tree_alpha/%z/%x/%y.png';
    App.Views.ForestLayer.__super__.initialize.apply(this);
  },

  filterCanvasImage: function(imageData, w, h) {
    var components = 4,
        pixelPos;

    for(var i=0; i < w; ++i) {
      for(var j=0; j < h; ++j) {

        var pixelPos = (j*w + i) * components,
            intensity = imageData[pixelPos + 3];

          imageData[pixelPos] = 0;
          imageData[pixelPos + 1] = intensity*0.7;
          imageData[pixelPos + 2] = 0;
          imageData[pixelPos+ 3]=intensity*0.7
      }
    }
  }

});