define([
  'jquery',
  'underscore',
  'handlebars',
  'text!templates/infowindow.handlebars'
], function($, _, Handlebars, tpl) {

  'use strict';

  var CustomInfowindow = function(map, opts) {
    this.defauls = {
      template: tpl,
      latlng: [],
      offset: [0, -10],
      width: 226
    };

    this.options = _.extend({}, this.defauls, opts);
    this.map = map;
    this.template = Handlebars.compile(this.options.template);

    this.setMap(this.map);
  };

  CustomInfowindow.prototype = new google.maps.OverlayView();

  CustomInfowindow.prototype.draw = function() {
    if (!this.el) {
      this.$el = $('<div></div>');
      this.el = this.$el[0];
      this.$el.addClass('cartodb-infowindow');

      this.setTemplate();
      this.getPanes().floatPane.appendChild(this.el);

      google.maps.event.addListener(this.map, 'click', _.bind(function(ev) {
        this.latlng = ev.latLng;
        this.open();
      }, this));

      google.maps.event.addDomListener(this.closeButton, 'click', _.bind(function(ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
        this.close();
      }, this));

      google.maps.event.addDomListener(this.closeButton, 'touchend', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });

      google.maps.event.addDomListener(this.el, 'touchstart', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });

      google.maps.event.addDomListener(this.el, 'touchend', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });

      google.maps.event.addDomListener(this.el, 'dblclick', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });
      google.maps.event.addDomListener(this.el, 'mousedown', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
        ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
      });
      google.maps.event.addDomListener(this.el, 'mouseup', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });
      google.maps.event.addDomListener(this.el, 'mousewheel', function (ev) {
        ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
      });
      google.maps.event.addDomListener(this.el, 'DOMMouseScroll', function (ev) {
        ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
      });

      this.hide();
    }

    this.setPosition();
  };

  CustomInfowindow.prototype.open = function() {
    this.close();
    this.getContent(_.bind(function() {
      this.show();
      this.setPosition();
      this.adjustPan();
    }, this));
  };

  CustomInfowindow.prototype.close = function() {
    this.hide();
  };

  CustomInfowindow.prototype.show = function() {
    if (this.el) {
      this.$el.show();
    }
  };

  CustomInfowindow.prototype.hide = function() {
    if (this.el) {
      this.$el.hide();
    }
  };

  CustomInfowindow.prototype.setPosition = function() {
    if (this.el) {
      var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng);
      if (pixPosition) {
        this.$el.css({
          width: this.options.width + 'px',
          left: (pixPosition.x - 25 + this.options.offset[0]) + 'px',
          top: (pixPosition.y + (-this.el.clientHeight) + this.options.offset[1]) + 'px'
        });
      }
    }
  };

  CustomInfowindow.prototype.getContent = function(callback) {
    if (this.options.infowindowAPI) {
      var params = {
        lat: this.latlng.lat(),
        lon: this.latlng.lng()
      };
      this.options.infowindowAPI.execute(params, _.bind(function(data) {
        this.data = { content: { data: data[0] } };
        this.setTemplate();
        if (callback && typeof callback === 'function') {
          callback();
        }
      }, this));
    } else if (this.options.infowindowContent) {
      if (callback && typeof callback === 'function') {
        this.setTemplate();
        callback();
      }
    }
  };

  CustomInfowindow.prototype.setTemplate = function() {
    var data = this.data || {};
    this.$el.html(this.options.infowindowContent || this.template(data));
    this.closeButton = this.$el.find('.close')[0];
  };

  CustomInfowindow.prototype.destroy = function() {
    if (this.el) {
      this.$el.remove();
      this.el = null;
    }
  };

  CustomInfowindow.prototype.adjustPan = function() {
    if (this.el) {
      var left = 0,
        top = 0,
        pixPosition = this.getProjection().fromLatLngToContainerPixel(this.latlng),
        container = this.map.getDiv(),
        div_height = this.el.clientHeight;

      if (pixPosition) {
        if ((pixPosition.x - 165) < 0) {
          left = (pixPosition.x - 165);
        }

        if ((pixPosition.x + 180) >= container.clientWidth) {
          left = (pixPosition.x + 180 - container.clientWidth + 25);
        }

        if ((pixPosition.y - div_height) < 0) {
          top = (pixPosition.y - div_height - 20);
        }

        this.map.panBy(left, top);
      }
    }
  };

  return CustomInfowindow;

});
