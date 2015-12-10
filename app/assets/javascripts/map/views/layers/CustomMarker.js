define([
  'underscore'
], function(_) {

  'use strict';

  var CustomMarker = function(latlng, map, opts) {
    this.defaults = {
      className: 'custom-marker',
      offset: [-18, -18],
      size: [36, 36],
      content: null
    };

    this.options = _.extend({}, this.defaults, opts);

    // Once the LatLng and text are set, add the overlay to the map.  This will
    this.latlng_ = latlng;
    // trigger a call to panes_changed which should in turn call draw.
    this.setMap(map);
  };

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.draw = function() {
    // Check if the div has been created.
    var div = this.div_;

    if (!div) {
      // Create a overlay text DIV
      div = this.div_ = document.createElement('DIV');
      // Create the DIV representing our CustomMarker
      div.className = this.options.className;
      div.style.position = 'absolute';
      div.style.cursor = 'pointer';
      div.style.width = this.options.size[0] + 'px';
      div.style.height = this.options.size[1] + 'px';

      var img = document.createElement('img');
      img.src = this.options.icon;
      img.className = 'icon-custom-marker';

      if (this.options.content) {
        div.innerHTML = this.options.content;
      }

      div.appendChild(img);

      // Trigger mouse events
      google.maps.event.addDomListener(div, 'click', _.bind(function() {
        google.maps.event.trigger(this, 'click');
      }, this));

      google.maps.event.addDomListener(div, 'mouseover', _.bind(function() {
        google.maps.event.trigger(this, 'mouseover');
      }, this));

      google.maps.event.addDomListener(div, 'mouseout', _.bind(function() {
        google.maps.event.trigger(this, 'mouseout');
      }, this));

      // Then add the overlay to the DOM
      this.getPanes().floatPane.appendChild(div);
    }

    // Position the overlay
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
      div.style.top = point.y + this.options.offset[0] + 'px';
      div.style.left = point.x + this.options.offset[1] + 'px';
    }
  };

  CustomMarker.prototype.remove = function() {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
    this.setMap(null);
  };

  CustomMarker.prototype.getPosition = function() {
    return this.latlng_;
  };

  CustomMarker.prototype.getDraggable = function() {
    return false;
  };

  return CustomMarker;

});
