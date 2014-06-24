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
  'text!map/templates/analysisButton.html'
], function(Backbone, _, presenter, mps, template) {

  var AnalysisButton = Backbone.View.extend({

    events: {
      'click #analysis_control': 'onClick'
    },

    template: _.template(template),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    },

    onClick: function(e) {
      mps.publish('analysisButton/click', [e]);
    }

  });

  var view = new AnalysisButton();

  return view;

});