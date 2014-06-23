/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'mps',
  'views/widget',
  'views/googleSearch',
  'text!views/searchbox.html'
], function(Backbone, _, mps, Widget, GoogleSearchView, searchboxTpl) {

  var Searchbox = Widget.extend({

    className: 'widget searchbox',
    template: _.template(searchboxTpl),

    initialize: function() {
      Searchbox.__super__.initialize.apply(this);

      this.inputView = new GoogleSearchView({
        input: this.$el.find('input'),
        onSelected: this.onSelected
      })
    },

    onSelected: function(place) {
      mps.publish('map/fit-bounds', [place.bounds]);
    }

  });

  return Searchbox;

});