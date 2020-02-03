define([
  'jquery',
  'underscore',
  'handlebars',
  'mps',
  'text!map/templates/infowindow.handlebars'
], function($, _, Handlebars, mps, tpl) {

  'use strict';

  Handlebars.registerHelper('substring', function( string, start, end ) {
    var theString = string.substring( start ,end );
    if( string.length > end ) {
      theString += '...';
    }
    return new Handlebars.SafeString(theString);
  });

  var CustomInfowindow = function(latlng, map, opts) {
    this.defauls = {
      template: tpl,
      offset: [-113, 85],
      width: 250,
      className: 'cartodb-infowindow'
    };

    this.options = _.extend({}, this.defauls, opts);
    this.map = map;
    this.template = Handlebars.compile(this.options.template);

    // Once the LatLng and text are set, add the overlay to the map.  This will
    this.latlng_ = latlng;
    // trigger a call to panes_changed which should in turn call draw.
    this.setMap(map);
  };

  CustomInfowindow.prototype = new google.maps.OverlayView();

  CustomInfowindow.prototype.draw = function() {
    // Check if the div has been created.
    var div = this.div_, closeButton, analyseButton, popup;

    if (!div) {
      // Create a overlay text DIV
      div = this.div_ = document.createElement('DIV');
      // Create the DIV representing our CustomMarker
      div.className = this.options.className;
      div.style.position = 'absolute';
      div.style.width = this.options.width + 'px';
      div.innerHTML = this.options.infowindowContent || this.template({
        content: {
          data: this.options.infowindowData
        }
      });

      popup = $(div).find('.cartodb-popup')[0];
      closeButton = $(div).find('.close')[0];
      analyseButton = $(div).find('.analyse')[0];

      // Events
      google.maps.event.addDomListener(div, 'click', _.bind(function(ev) {
        this.enableScrollwheel();
        if (! $(ev.currentTarget).hasClass('story-infowindow')) {
          ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
        }
      }, this));

      if (popup) {
        google.maps.event.addDomListener(popup, 'mouseover', _.bind(function(ev) {
          ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
          this.disableScrollwheel();
        }, this));

        google.maps.event.addDomListener(popup, 'mouseout', _.bind(function(ev) {
          ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
          this.enableScrollwheel();
        }, this));
      }

      if (closeButton) {
        google.maps.event.addDomListener(closeButton, 'click', _.bind(function(ev) {
          ev && ev.stopPropagation() && ev.preventDefault();
          this.remove();
        }, this));
      }

      if (analyseButton) {
        google.maps.event.addDomListener(analyseButton, 'click', _.bind(function(ev) {
          ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
          var wdpaid = {wdpaid : $(analyseButton).data('layer')};
          google.maps.event.trigger(this.map, 'click', wdpaid);
          this.remove();
        }, this));
      }

      // Then add the overlay to the DOM
      this.getPanes().floatPane.appendChild(div);
    }

    // Position the overlay
    this.setPosition();
  };

  CustomInfowindow.prototype.setPosition = function() {
    var div = this.div_;
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
      div.style.top = point.y + this.options.offset[0] - div.clientHeight + 'px';
      div.style.left = point.x + this.options.offset[1] - (this.options.width / 2) + 'px';
    }
  };

  CustomInfowindow.prototype.remove = function() {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
    if(this.map) this.map.setOptions({ scrollwheel: true });
    this.setMap(null);
    this.enableScrollwheel();
    mps.publish('Infowindow/close');
  };

  CustomInfowindow.prototype.getPosition = function() {
    return this.latlng_;
  };

  CustomInfowindow.prototype.enableScrollwheel = function() {
    if(this.map) this.map.setOptions({ scrollwheel: true });
  };

  CustomInfowindow.prototype.disableScrollwheel = function() {
    if(this.map) this.map.setOptions({ scrollwheel: false });
  };


  return CustomInfowindow;

});
