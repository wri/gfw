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
  'text!analysis_control_tpl.html'
], function(Backbone, _, presenter, mps, analysisTpl) {

  var AnalysisButton = Backbone.View.extend({

    template: _.template(analysisTpl),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    }

  });

  var AnalysisButton = new AnalysisButton();

  return AnalysisButton;

});