/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'views/Widget',
  'presenters/SearchboxPresenter',
  'handlebars',
  'text!templates/searchbox.handlebars'
], function(Backbone, _, Widget, Presenter, Handlebars, tpl) {

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
      this.autocomplete = new google.maps.places.Autocomplete(
        this.$el.find('input')[0], {types: ['geocode']});

      google.maps.event.addListener(
        this.autocomplete, 'place_changed', this.onPlaceSelected);
    },

    onPlaceSelected: function() {
      var place = this.autocomplete.getPlace();

      // TODO: When there isn't viewport, and there is location...
      if (place && place.geometry && place.geometry.viewport) {
        this.presenter.fitBounds(place.geometry.viewport);
      }
    }

  });

  return Searchbox;
});
