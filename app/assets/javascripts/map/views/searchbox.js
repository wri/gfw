/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'presenter',
  'mps',
  'text!views/searchbox.html'
], function(Backbone, _, presenter, mps, template) {

  var Searchbox = Backbone.View.extend({

    template: _.template(template),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    }

  });

  var Searchbox = new Searchbox();

  return Searchbox;

});