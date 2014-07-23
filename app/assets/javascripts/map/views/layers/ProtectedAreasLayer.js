/**
 * The ProtectedAreas layer module for use on canvas.
 *
 * @return ProtectedAreasLayer class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'views/layers/class/ImageMaptypeLayerClass',
], function(_, ImageMaptypeLayerClass) {

  'use strict';

  var ProtectedAreasLayer = ImageMaptypeLayerClass.extend({

    options: {
      urlTemplate: '//184.73.201.235/blue{/z}{/x}{/y}',
      infowindow: true
    },

    setMapEvents: function() {
      google.maps.event.addListener(this.map, 'click', _.bind(function(event) {
        // that.closeInfowindows();

        var // get click coordinates
        lat = event.latLng.lat(),
        lng = event.latLng.lng();
        // params = { lat: lat, lon: lng };
        //url = "//<%= ENV['GFW_API_HOST'] %>/wdpa/sites";

        this.infowindow.setPosition(event.latLng);
        this.infowindow.open();

        // executeAjax(url, params, {
        //   success: function(sites) {
        //     var site = null;

        //     if (sites && sites.length > 0) {
        //       var site = sites[0];

        //       that.protectedInfowindow.setContent(site);
        //       that.protectedInfowindow.setPosition(event.latLng);
        //       that.protectedInfowindow.open();
        //     }
        //   },
        //   error: function(e) {
        //     console.error('WDPA API call failed', e, url);
        //   }
        // });
      }, this));
    }

  });

  return ProtectedAreasLayer;

});
