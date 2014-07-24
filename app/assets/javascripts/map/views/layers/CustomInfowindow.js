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
      latlng: null,
      offset: [-10, 85],
      width: 226,
      className: 'cartodb-infowindow'
    };

    this.options = _.extend({}, this.defauls, opts);
    this.map = map;
    this.latlng = this.options.latlng;
    this.template = Handlebars.compile(this.options.template);

    this.setMap(this.map);
  };

  CustomInfowindow.prototype = new google.maps.OverlayView();

  CustomInfowindow.prototype.draw = function() {
    if (!this.el) {
      this.$el = $('<div></div>');
      this.el = this.$el[0];
      this.$el.addClass(this.options.className);

      this.setTemplate();
      this.getPanes().floatPane.appendChild(this.el);

      this.setEvents();

      this.hide();
    }

    this.setPosition();
  };

  CustomInfowindow.prototype.open = function(latlng) {
    if (latlng) {
      this.latlng = latlng;
    }
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
          top: (pixPosition.y - this.el.clientHeight + this.options.offset[0]) + 'px',
          left: (pixPosition.x - (this.options.width/2) + this.options.offset[1]) + 'px',
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
        this.setTemplate()
        callback();
      }
    }
  };

  CustomInfowindow.prototype.setTemplate = function() {
    var data = this.data || {};
    if (this.el) {
      this.$el.html(this.options.infowindowContent || this.template(data));
      this.closeButton = this.$el.find('.close')[0];
    }
  };

  CustomInfowindow.prototype.destroy = function() {
    if (this.el) {
      this.removeEvents();
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

  CustomInfowindow.prototype.setEvents = function() {
    if (this.options.infowindowAPI) {
      google.maps.event.addListener(this.map, 'click', _.bind(function(ev) {
        this.latlng = ev.latLng;
        this.open();
      }, this));
    }

    if (this.closeButton) {
      google.maps.event.addDomListener(this.closeButton, 'click', _.bind(function(ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
        this.close();
      }, this));

      google.maps.event.addDomListener(this.closeButton, 'touchend', function (ev) {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      });
    }

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

    google.maps.event.addDomListener(this.map, 'click', _.bind(function(ev) {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      this.hide();
    }, this));
  };

  CustomInfowindow.prototype.removeEvents = function() {
    if (this.closeButton) {
      google.maps.event.clearListeners(this.closeButton);
    }
    if (this.el) {
      google.maps.event.clearListeners(this.map);
      google.maps.event.clearListeners(this.el);
    }
  };

  return CustomInfowindow;

});
