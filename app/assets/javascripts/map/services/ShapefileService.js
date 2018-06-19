define([
  'Class',
  'jquery'
], function(Class, $) {

  var CONVERTER_URL = window.gfw.config.GFW_API_OLD + "/api/ogr/convert";

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
          deferred.resolve(JSON.parse(xhr.responseText).data.attributes);
        }
      };

      var formData = new FormData();
      formData.append('file', this.shapefile);
      xhr.send(formData);

      return deferred.promise();
    }

  });

  return ShapefileService;

});
