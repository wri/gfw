/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'handlebars',
  'keymaster',
  'map/presenters/controls/SearchboxPresenter',
  'text!map/templates/controls/searchbox.handlebars'
], function(_, Backbone, Handlebars, keymaster, Presenter, tpl) {

  'use strict';

  var SearchboxModel = Backbone.Model.extend({
    defaults:{
      hidden: true,
      type: 'regular'
    }
  });

  var Searchbox = Backbone.View.extend({

    el: '#control-searchbox',

    template: Handlebars.compile(tpl),

    events: {
      'click' : 'onClick',
      'click .kind' : '_setType',
      'click #coord-btn' : 'searchByCoords',
      'click #deg-btn' : 'searchByDegs'
    },

    initialize: function(map) {
      this.map = map;
      this.model = new SearchboxModel();
      this.presenter = new Presenter(this);
      _.bindAll(this, 'setAutocomplete', 'onPlaceSelected');

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = false;
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = true;
        },this)
      });

      this.render();

      this.cacheVars();
      this.setListeners();
      this.setAutocomplete();

    },

    cacheVars: function() {
      //cacheVars
      this.$input = this.$el.find('.regular').find('input');
      this.$selects = this.$el.find('.chosen-select');

      this.$searchbox = $('.search-box');
      this.$kinds = this.$el.find('.kind');
      this.$searchboxs = this.$el.find('.search');
    },

    setListeners: function() {
      this.$selects.chosen({
        width: 'auto',
        inherit_select_classes: true,
        disable_search: true,
        display_selected_options: false,
        display_disabled_options: false
      });

      google.maps.event.addListener(this.map, 'click',_.bind(function() {
        this.model.set('hidden', false);
        this.toggleSearch();
      }, this));
    },

    render: function() {
      this.$el.html(this.template);
    },

    // GLOBAL BEHAVIOUR
    onClick: function(e) {
      if ($(e.target).hasClass('control-searchbox')) {
        this.model.set('hidden', false);
        this.toggleSearch();
      }
    },

    toggleSearch: function() {
      var hidden = this.model.get('hidden');
      var type = this.model.get('type');
      if (hidden) {
        // This is for android keyboard. It pushes all content up, we want to prevent it
        if (this.mobile) {
          $('html,body').height($(window).height());
        }
        this.$el.show(0);
        if (type == 'regular') {
          this.$input.focus();
          setTimeout(_.bind(function(){
            this.$input.val('');
          }, this),1);
        }
        this.model.set('hidden', false);
      }else{
        // This is for android keyboard. It pushes all content up, we want to prevent it
        if (this.mobile) {
          $('html,body').height('100%');
        }
        this.$el.hide(0);
        if (type == 'regular') {
          this.$input.blur();
        }
        this.model.set('hidden', true);
      }
    },


    // CLICK KIND
    _setType: function(e) {
      e && e.preventDefault();
      var $target = $(e.currentTarget);
      var kind = $target.data('kind');
      if (!$target.hasClass('selected')){
        this.$searchboxs.removeClass('selected');
        this.$el.find('.'+kind).addClass('selected');

        this.$kinds.removeClass('selected')
        $target.addClass('selected');

        this.model.set('type',kind);
      }
    },



    // COORDINATES
    searchByCoords: function(e) {
      e && e.preventDefault();
      var latD = this.getDMS('#coord-lat');
      var lngD = this.getDMS('#coord-lng');

      var lat = this.convertDMSToDD(latD.degrees, latD.minutes, latD.seconds, latD.cardinal);
      var lng = this.convertDMSToDD(lngD.degrees, lngD.minutes, lngD.seconds, lngD.cardinal);

      if (!!lat && !_.isNaN(lat) && !!lng && !_.isNaN(lng)) {
        this.presenter.setCenter(lat,lng);
        this.model.set('hidden', false);
        this.toggleSearch();
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


    // DEGREES
    searchByDegs: function() {
      var lat = Number($('#deg-lat').val());
      var lng = Number($('#deg-lng').val());

      if (!!lat && !_.isNaN(lat) && !!lng && !_.isNaN(lng)) {
        this.presenter.setCenter(lat,lng);
        this.model.set('hidden', false);
        this.toggleSearch();
      }
    },


    // AUTOCOMPLETE
    setAutocomplete: function() {
      this.autocomplete = new google.maps.places.SearchBox(this.$input[0]);
      google.maps.event.addListener(this.autocomplete, 'places_changed', this.onPlaceSelected);
    },

    onPlaceSelected: function() {
      var place = this.autocomplete.getPlaces();
      if (place.length == 1) {
        place = place[0];
        if (place && place.geometry && place.geometry.viewport) {
          this.presenter.fitBounds(place.geometry.viewport);
        }
        if (place && place.geometry && place.geometry.location && !place.geometry.viewport) {
          var index = [];
          for (var x in place.geometry.location) {
             index.push(x);
          }
          this.presenter.setCenter(place.geometry.location[index[0]],place.geometry.location[index[1]]);
        }
        this.model.set('hidden', false);
        this.toggleSearch();
      };
      ga('send', 'event', 'Map', 'Searchbox', 'Find location');
    }

  });

  return Searchbox;
});
