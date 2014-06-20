/**
 * Legend module.
 *
 * @return singleton instance of the legend class (extends Widget).
 */
define([
  'backbone',
  'underscore',
  'presenter',
  'mps',
  'views/widget',
  'text!legend.html'
], function(Backbone, _, presenter, mps, Widget, legendTpl) {

  var Legend = Widget.extend({

    className: 'widget legend',
    template: _.template(legendTpl),

    initialize: function() {
      this.render();
      Legend.__super__.initialize.apply(this);
    },

    render: function() {
      this.$el.html(this.template());
      $('.map-container').append(this.el);
    },

    update: function() {
    }

  });

  var legend = new Legend();

  return legend;

});