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
      hidden: true
    }
  });




  var Searchbox = Backbone.View.extend({

    el: '#control-searchbox',

    template: Handlebars.compile(tpl),

    events: {
      'click' : 'onClick',
      'click .searching-kinds' : '_setType'
    },

    initialize: function(map) {
      this.map = map;
      this.model = new SearchboxModel();
      this.presenter = new Presenter(this);
      _.bindAll(this, 'setAutocomplete', 'onPlaceSelected');

      this.render();
      //cacheVars
      this.$input = this.$el.find('input');

      this.setListeners();
      this.setAutocomplete();

    },

    checkSearchType: function(address) {
      var isLatLong = function(address) {
        return (address.includes("º") || address.includes("°")) && address.includes("'") && address.includes("\"") && (address.includes("W") || address.includes("E")) && (address.includes("N") || address.includes("S"));
      }
      var isDegrees = function(address) {
        address = address.split(',');
        if (!!address && address.length != 2) return false;
        if (~~((address[0] + address[1]) * -1) === 0) return false; //avoid mistakes with coordinates, degrees have no letters, so everything must be numbers ~~NaN will be 0

        var degrees = new Uint8Array(new ArrayBuffer(2));
        degrees[0] = ~~address[0].split('.');
        degrees[1] = ~~address[1].split('.');
        if (degrees[0] <= 90 && degrees[1] <= 180) {
          return true;
        }
        return false;
      }
      if (isLatLong(address)) {
        //user typed a latitude and longitude coordinates

      } else if (isDegrees(address)) {
        //user typed a degrees coordinates

      } else {
        //user typed a regular address

      }
    },

    _setType: function(e) {
      var $target = $(e.target);
      if ($target.hasClass('selected')) return;

      $(e.target).parent().find('.selected').removeClass('selected');
      $target.addClass('selected');
      var type = $target.data('kind');
      this.$searchbox.find('.search.selected').removeClass('selected');
      this.$searchbox.find('.search.'+type).addClass('selected');
    },
    setListeners: function(){
      this.$input.on('keyup', _.bind(function(e){
        if (e.keyCode === 27) {
          this.model.set('hidden', false);
          this.toggleSearch();
        } else {
          if (! !! e.target.value) return;
          this.checkSearchType(e.target.value);
        }
      }, this ));

      google.maps.event.addListener(this.map, 'click',_.bind(function() {
        this.model.set('hidden', false);
        this.toggleSearch();
      }, this));
    },

    render: function(){
      this.$el.html(this.template);
      this.$searchbox = $('.search-box');
    },

    onClick: function(e){
      if ($(e.target).hasClass('control-searchbox')) {
        this.model.set('hidden', false);
        this.toggleSearch();
      }
    },

    toggleSearch: function(){
      var hidden = this.model.get('hidden');
      if (hidden) {
        this.$el.show(0);
        this.$input.focus();
        this.model.set('hidden', false);
        setTimeout(_.bind(function(){
          this.$input.val('');
        }, this),1);
      }else{
        this.$el.hide(0);
        this.$input.blur();
        this.model.set('hidden', true);
      }
    },

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
