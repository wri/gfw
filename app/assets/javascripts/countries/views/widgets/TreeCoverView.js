define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'common/views/PieGraphView',
  'text!countries/templates/widgets/treeCover.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  PieGraphView,
  tpl) {

  'use strict';

  var TreeCoverView = Backbone.View.extend({
    el: '#widget-tree-cover',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this.render();

      this.pieGraph = new PieGraphView({
        el: '#tree-cover-graph',
        // data: this.data,
        data: [
          {
            value: 100
          },
          {
            value: 500
          },
          {
            value: 200
          }
        ]
      });
    },

    render: function() {
      this.$el.html(this.template({}));
    }
  });
  return TreeCoverView;

});
