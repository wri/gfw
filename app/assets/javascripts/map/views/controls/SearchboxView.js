/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'handlebars',
  'map/presenters/controls/SearchboxPresenter',
  'text!map/templates/controls/searchbox.handlebars'
], function(_, Backbone, Handlebars, Presenter, tpl) {

  'use strict';

  var Searchbox = Backbone.View.extend({

    el: '#control-searchbox',

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.presenter = new Presenter(this);

      _.bindAll(this, 'setAutocomplete', 'onPlaceSelected');

      this.render();
      this.setListeners();
      this.setAutocomplete();
    },

    setListeners: function(){
    },

    render: function(){
      this.$el.html(this.template);
    },

    toggleSearch: function(){
      this.$el.toggle(0);
      this.$el.find('input').focus();
    },

    setAutocomplete: function() {
      this.autocomplete = new google.maps.places.SearchBox(this.$el.find('input')[0]);
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
        this.$el.toggle(0);
      };
      ga('send', 'event', 'Map', 'Searchbox', 'Find location');
    }

  });

  return Searchbox;
});
