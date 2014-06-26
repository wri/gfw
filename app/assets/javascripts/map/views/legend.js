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
  'text!map/templates/legend.html'
], function(Backbone, _, presenter, mps, Widget, legendTpl) {

  'use strict';

  var Legend = Widget.extend({

    className: 'widget legend',
    template: _.template(legendTpl),

    render: function() {
      Legend.__super__.render.apply(this);
      this.$layersCount = this.$el.find('.layers-count');
    },

    update: function() {
      var amountLayers = presenter.get('sublayers').length +
        presenter.get('baselayers').length;

      this.$layersCount.html(amountLayers);

      // update layers-details
    },

  });

  var legend = new Legend();

  return legend;

});
