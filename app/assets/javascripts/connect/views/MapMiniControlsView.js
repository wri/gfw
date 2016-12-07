/**
 * The MapMiniControlsView view.
 *
 * @return MapMiniControlsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'core/View',

], function(_, Handlebars, mps, View) {

  'use strict';

  var MapMiniControlsView = View.extend({

    el: '#map-controls',

    events: {
      'click .js-map-controls-zoom-in' : 'onClickZoomIn',
      'click .js-map-controls-zoom-out' : 'onClickZoomOut',
      'click .js-map-controls-autolocate' : 'onClickLocate',
      // 'click .js-map-controls-zoom-search' : 'onClickZoomOut',
    },

    initialize: function(map) {
      if (!this.$el.length) {
        return;
      }

      View.prototype.initialize.apply(this);

      this.map = map;
      this.cache();
      this.listeners();

      this.renderGoogleAutocomplete();
    },

    listeners: function() {
    },

    cache: function() {
      this.$autolocate = this.$el.find('#map-controls-autolocate');
      this.$autocomplete = this.$el.find('#map-controls-search');
    },

    renderGoogleAutocomplete: function() {
      // Set autocomplete search input
      this.autocomplete = new google.maps.places.Autocomplete(this.$autocomplete[0], {
        types: ['geocode']
      });

      // Listen to selected areas (search)
      google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
        var place = this.autocomplete.getPlace();
        if (place && place.geometry && place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        }
        if (place && place.geometry && place.geometry.location && !place.geometry.viewport) {
          var index = [];
          for (var x in place.geometry.location) {
            index.push(x);
          }
          this.map.setCenter(new google.maps.LatLng(place.geometry.location[index[0]], place.geometry.location[index[1]]));
        }
      }.bind(this));

      // Listen to keys
      google.maps.event.addDomListener(this.$autocomplete[0], 'keydown', function(e) {
        switch(e.keyCode) {
          case 13:
            e.preventDefault();
          break;
          case 27:
            $(e.currentTarget).val('');
          break;
        }
      }.bind(this));
    },



    /**
     * UI EVENTS
     * - onClickZoomIn
     * - onClickZoomOut
     * - onClickLocate
     */
    onClickZoomIn: function(e) {
      e && e.preventDefault();
      var zoom = this.map.getZoom() + 1;
      this.map.setZoom(zoom);
    },

    onClickZoomOut: function(e){
      e && e.preventDefault();
      var zoom = this.map.getZoom() - 1;
      this.map.setZoom(zoom);
    },

    onClickLocate: function(e){
      e && e.preventDefault();
      this.$autolocate.toggleClass('-loading', true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            this.$autolocate.toggleClass('-loading', false);

            var lat = position.coords.latitude,
                lng = position.coords.longitude;

            this.map.setCenter(new google.maps.LatLng(lat, lng));

          }.bind(this),

          function() {
            this.$autolocate.toggleClass('-loading', false);
            mps.publish('Notification/open', ['notification-enable-location']);
          }.bind(this)
        );
      } else {
        this.$autolocate.toggleClass('-loading', false);
      }
    },

  });

  return MapMiniControlsView;

});
