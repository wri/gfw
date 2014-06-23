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
  'text!views/legend.html'
], function(Backbone, _, presenter, mps, Widget, legendTpl) {

  var Legend = Widget.extend({

    className: 'widget legend',
    template: _.template(legendTpl),

    render: function() {
      Legend.__super__.render.apply(this);

      this.$layersClosed = this.$el.find('.layers-closed');
      this.$layersCount = this.$el.find('.layers-count');
      this.$layersDetails = this.$el.find('.layers-details');
    },

    update: function() {
      var amountLayers = presenter.get('sublayers').length +
        presenter.get('baselayers').length;

      this.$layersCount.html(amountLayers);

      // update layers-details
    },

    open: function() {
      Legend.__super__.open.apply(this);
      this.$layersClosed.hide();
      this.$layersDetails.show();
    },

    close: function() {
      Legend.__super__.close.apply(this);
      this.$layersClosed.show();
      this.$layersDetails.hide();
    }

  });

  var legend = new Legend();

  return legend;

});