/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'handlebars',
  'map/views/Widget',
  'map/presenters/SearchboxPresenter',
  'text!map/templates/searchbox.handlebars'
], function(_, Backbone, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var Searchbox = Widget.extend({

    className: 'widget widget-searchbox',

    template: Handlebars.compile(tpl),

    initialize: function() {
      _.bindAll(this, 'setAutocomplete', 'onPlaceSelected');
      this.presenter = new Presenter(this);
      Searchbox.__super__.initialize.apply(this);
      this.setAutocomplete();
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
      };
      ga('send', 'event', 'Map', 'Searchbox', 'Find location');
    }

  });

  return Searchbox;
});
