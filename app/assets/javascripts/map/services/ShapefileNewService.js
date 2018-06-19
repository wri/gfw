define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var SAVE_REQUEST_ID = 'ShapefileService:save';

  var URL = window.gfw.config.GFW_API + '/ogr/convert';

  var ShapefileService = Class.extend({

    save: function(file) {
      var deferred = $.Deferred();

      var xhr = new XMLHttpRequest();
      xhr.open("POST", URL, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            deferred.resolve(JSON.parse(xhr.responseText));
          } else {
            deferred.reject(JSON.parse(xhr.responseText));
          }
        }
      };

      var formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);

      return deferred.promise();
    }

  });

  return new ShapefileService();

});
