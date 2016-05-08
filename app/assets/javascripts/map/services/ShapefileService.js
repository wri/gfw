define([
  'Class',
  'jquery'
], function(Class, $) {

  var CONVERTER_URL = "http://ogre.adc4gis.com/convert";

  var ShapefileService = Class.extend({

    init: function(options) {
      options = options || {};
      this.shapefile = options.shapefile;
    },

    toGeoJSON: function() {
      var deferred = $.Deferred();

      var xhr = new XMLHttpRequest();
      xhr.open("POST", CONVERTER_URL, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          deferred.resolve(JSON.parse(xhr.responseText));
        }
      };

      var formData = new FormData();
      formData.append('upload', this.shapefile);
      formData.append('targetSrs', 'EPSG:4326');
      xhr.send(formData);

      return deferred.promise();
    }

  });

  return ShapefileService;

});
