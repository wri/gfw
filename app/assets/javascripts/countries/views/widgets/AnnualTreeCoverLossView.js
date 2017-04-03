define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'common/views/GroupedGraphView',
  'text!countries/templates/widgets/annualTreeCoverLoss.handlebars'
], function($, Backbone, _, Handlebars, UriTemplate, NumbersHelper, GroupedGraphView, tpl) {

  'use strict';

  var AnnualTreeCoverLossView = Backbone.View.extend({
    el: '#widget-annual-tree-cover-loss',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this._initWidget();
    },

    render: function() {
      this.$el.html(this.template({}));
      this.$el.removeClass('-loading');
    },

    _initWidget: function(res) {
      this.data = [
        { label:"2001", "0": 20, "1": 40},
        { label:"2002", "0": 20, "1": 40},
        { label:"2003", "0": 20, "1": 40},
        { label:"2004", "0": 20, "1": 40},
        { label:"2005", "0": 20, "1": 40},
        { label:"2006", "0": 20, "1": 40},
        { label:"2007", "0": 20, "1": 40},
        { label:"2008", "0": 20, "1": 40},
        { label:"2009", "0": 20, "1": 40},
        { label:"2010", "0": 20, "1": 40},
        { label:"2011", "0": 20, "1": 40},
        { label:"2012", "0": 20, "1": 40},
        { label:"2013", "0": 20, "1": 40}
      ];

      this.render();
      this.lineGraph = new GroupedGraphView({
        el: '#annual-tree-cover-loss-graph',
        data: this.data
      });
    }
  });
  return AnnualTreeCoverLossView;

});
