/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'mps',
  'gmap',
  'views/widget',
  'text!views/searchbox.html'
], function(Backbone, _, mps, gmap, Widget, searchboxTpl) {

  var Searchbox = Widget.extend({

    className: 'widget searchbox',
    template: _.template(searchboxTpl),

    initialize: function() {
      Searchbox.__super__.initialize.apply(this);
      _.bindAll(this, 'setAutocomplete', 'onPlaceSelected');
      gmap.init(this.setAutocomplete);
    },

    setAutocomplete: function() {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.$el.find('input')[0], {types: ['geocode']});
      
      google.maps.event.addListener(
        this.autocomplete, 'place_changed', this.onPlaceSelected);
    },

    onPlaceSelected: function() {
      var place = this.autocomplete.getPlace();

      if (place && place.geometry) {
        mps.publish('map/fit-bounds', [place.geometry.viewport]);
      }
    }

  });

  var searchbox = new Searchbox();

  return searchbox;

});