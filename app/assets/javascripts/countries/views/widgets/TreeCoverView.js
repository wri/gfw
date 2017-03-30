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
        data: [
          {
            category: 1,
            value: 10,
            color: '#dddde0'
          },
          {
            category: 2,
            value: 50,
            color: '#168500'
          },
          {
            category: 3,
            value: 20,
            color: '#97be32'
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
