/**
 * The google search autocomplete module. Add google autocomplete to an input.
 * 
 * params {array} options object
 *   input - jquery input (e.g, $('input'))
 *   onSelect - on place selected callback (e.g, function(place) { console.log(place, 'selected')};)
 *
 * @return GoogleSearch class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore'
], function(Backbone, _) {

  var GoogleSearch = Backbone.View.extend({

    initialize: function(options) {
      if (!options.input) throw "No input passed";

      _.bindAll(this, 'onSelect');

      this.$input = options.input;
      this.onSelected = options.onSelected || this.onSelected;

      // Set Google autocomplete
      this.autocomplete = new google.maps.places.Autocomplete(this.$input[0], {types: ['geocode']});
      google.maps.event.addListener(this.autocomplete, 'place_changed', this.onSelect);
    },

    onSelect: function() {
      var place = this.autocomplete.getPlace();

      if (place && place.geometry) {
        this.onSelected({
          formattedAddress: place.formatted_address,
          bounds: place.geometry.viewport
        });
      }
    },

    onSelected: function(place) {
    },

  });

  return GoogleSearch;

});