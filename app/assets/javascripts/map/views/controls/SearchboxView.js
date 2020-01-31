/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'handlebars',
  'proj4',
  'enquire',
  'map/presenters/controls/SearchboxPresenter',
  'text!map/templates/controls/searchbox.handlebars'
], function(_, Backbone, Handlebars, proj4, enquire, Presenter, tpl) {

  'use strict';

  var SearchboxModel = Backbone.Model.extend({
    defaults:{
      type: 'regular'
    },

    toggleVisibility: function() {
      this.set('hidden', !this.get('hidden'));
    }
  });

  var Searchbox = Backbone.View.extend({

    el: '#control-searchbox',

    template: Handlebars.compile(tpl),

    events: {
      'click': 'close',
      'click .kind' : 'setType',
      'click #coord-btn' : 'searchByCoords',
      'click #deg-btn' : 'searchByDegs',
      'click #utm-btn' : 'searchByUtm',
    },

    initialize: function(map) {
      this.map = map;

      this.model = new SearchboxModel();
      this.listenTo(this.model, 'change:hidden', this.toggleSearch);
      this.listenTo(this.model, 'change:type', this.changeType);

      this.presenter = new Presenter(this);

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: function() { this.mobile = false; }.bind(this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: function() { this.mobile = true; }.bind(this)
      });

      this.render();
    },

    render: function() {
      this.$el.html(this.template);

      this.setupAutocomplete();
      this.$('.chosen-select').chosen({
        width: '40px',
        inherit_select_classes: true,
        disable_search: true,
        display_selected_options: false,
        display_disabled_options: false
      });
    },

    close: function(event) {
      if (event.target === this.el) {
        this.model.set('hidden', false);
      }
    },

    focusInput: function() {
      var type = this.model.get('type');
      setTimeout(function() {
        this.$('.'+type).find('input').first().focus();
      }.bind(this), 10);
    },

    toggleSearch: function() {
      var hidden = this.model.get('hidden');
      if (hidden) {
        // This is for android keyboard. It pushes all content up, we
        // want to prevent it
        if (this.mobile) {
          $('html,body').height($(window).height());
        }

        this.$el.show(0);
        this.focusInput();
      } else {
        // This is for android keyboard. It pushes all content up, we
        // want to prevent it
        if (this.mobile) {
          $('html,body').height('100%');
        }

        this.$el.hide(0);
      }
    },

    setType: function(e) {
      e && e.preventDefault();

      var $target = $(e.currentTarget),
          kind = $target.data('kind');

      this.model.set('type', kind);
    },

    changeType: function() {
      var type = this.model.get('type');
      this.$('.search').removeClass('selected');
      this.$('.kind').removeClass('selected')

      this.focusInput();

      this.$('.' + type).addClass('selected');
      this.$('[data-kind="'+type+'"]').addClass('selected');
    },

    searchByCoords: function(e) {
      e && e.preventDefault();

      var latD = this.getDMS('#coord-lat');
      var lngD = this.getDMS('#coord-lng');

      var lat = this.convertDMSToDD(latD.degrees, latD.minutes, latD.seconds, latD.cardinal);
      var lng = this.convertDMSToDD(lngD.degrees, lngD.minutes, lngD.seconds, lngD.cardinal);

      if (!_.isNaN(lat) && !_.isNaN(lng)) {
        this.presenter.setCenter(lat,lng);
        this.addMarker(lat,lng);
        this.model.set('hidden', false);
      }
    },

    getDMS: function(id) {
      var $el = $(id);
      return {
        degrees: Number($el.find('input[name=degrees]').val()),
        minutes: Number($el.find('input[name=minutes]').val()),
        seconds: Number($el.find('input[name=seconds]').val()),
        cardinal: $el.find('select[name=cardinal]').val(),
      }
    },

    convertDMSToDD: function(degrees, minutes, seconds, cardinal) {
      var dd = degrees + minutes/60 + seconds/(60*60);
      if (cardinal == "S" || cardinal == "W") {
        dd = dd * -1;
      } // Don't do anything for N or E
      return dd;
    },

    searchByDegs: function() {
      var lat = Number($('#deg-lat').val());
      var lng = Number($('#deg-lng').val());

      if (!_.isNaN(lat) && !_.isNaN(lng)) {
        this.presenter.setCenter(lat,lng);
        this.addMarker(lat,lng);
        this.model.set('hidden', false);
      }
    },

    searchByUtm: function() {
      var easting    = parseInt(this.$('#utm-easting').val(),10),
          northing   = parseInt(this.$('#utm-northing').val(),10),
          zone       = parseInt(this.$('#utm-zone').val(),10),
          hemisphere = this.$('#utm-hemisphere').val();

      var utm = "+proj=utm +zone=" + zone + " " + hemisphere,
          wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
          coords = proj4(utm, wgs84, [easting, northing]);

      if (!isNaN(coords[0]) && !isNaN(coords[1])) {
        this.presenter.setCenter(coords[1], coords[0]);
        this.addMarker(coords[1], coords[0]);
        this.model.set('hidden', false);
      }
    },

    setupAutocomplete: function() {
      var input = this.$('.search-input')[0];
      this.autocomplete = new google.maps.places.SearchBox(input);

      google.maps.event.addListener(this.autocomplete,
        'places_changed', this.onPlaceSelected.bind(this));
    },

    onPlaceSelected: function() {
      var place = this.autocomplete.getPlaces()[0];

      if (place !== undefined && place.geometry) {
        if (place.geometry.viewport) {
          this.presenter.fitBounds(place.geometry.viewport);
          if (place.geometry.location) {
            this.addMarker(place.geometry.location.lat(), place.geometry.location.lng());
          }
        }

        if (place.geometry.location && !place.geometry.viewport) {
          this.presenter.setCenter(place.geometry.location.lat(), place.geometry.location.lng());
          this.addMarker(place.geometry.location.lat(), place.geometry.location.lng());
        }

        this.model.set('hidden', false);
      };

      ga('send', 'event', 'Map', 'Searchbox', 'Find location');
    },

    addMarker: function(_lat,_lng) {
      this.removeMarker();

      var latLng = {
        lat: _lat,
        lng: _lng
      };

      this.marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        zIndex: 0,
        optimized: false
      });

      this.markerMask = new google.maps.Marker({
        position: latLng,
        icon: this.getMarkerMaskIcon(),
        map: this.map,
        zIndex: 1,
        optimized: false
      });

      this.markerClose = new google.maps.Marker({
        position: latLng,
        icon: this.getMarkerRemoveIcon(),
        map: this.map,
        zIndex: 2,
        optimized: false
      });
      this.markerClose.setVisible(false);

      this.setMarkerEvents();
    },

    removeMarker: function() {
      if (!!this.marker) {
        this.marker.setMap(null);
        this.markerClose.setMap(null);
        this.markerMask.setMap(null);
      }
    },

    setMarkerEvents: function() {
      this.markerMask.addListener('mouseover', function() {
        this.markerClose.setVisible(true);
      }.bind(this));

      this.markerMask.addListener('mouseout', function() {
        this.markerClose.setVisible(false);
      }.bind(this));

      this.markerClose.addListener('mouseover', function() {
        this.markerClose.setVisible(true);
      }.bind(this));

      this.markerClose.addListener('mouseout', function() {
        this.markerClose.setVisible(false);
      }.bind(this));

      this.markerClose.addListener('click', function() {
        this.removeMarker();
      }.bind(this));
    },

    getMarkerRemoveIcon: function() {
      return {
        path: 'M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z',
        fillOpacity: 1,
        fillColor: '#333333',
        scale: 0.6,
        strokeWeight: 0,
        size: new google.maps.Size(10, 10),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(-14, 85)
      };
    },

    getMarkerMaskIcon: function() {
      return {
        path: 'M.45.2c0 1.004.25 51.674.25 51.674l50.835.98L49.355.21S.45-.802.45.2z',
        fillOpacity: 0,
        scale: 1,
        strokeWeight: 0,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 50),
        scaledSize: new google.maps.Size(25, 25)
      };
    }
  });

  return Searchbox;
});
