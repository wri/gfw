define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'services/CountryService',
  'text!countries/templates/widgets/annualTreeCoverLossRanking.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  NumbersHelper,
  CountryService,
  tpl) {

  'use strict';

  var AnnualTreeCoverLossRankingView = Backbone.View.extend({
    el: '#widget-annual-tree-cover-loss-ranking',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this._initWidget();
    },

    _initWidget: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        data: []
      }));
      this.$el.removeClass('-loading');
    }
  });
  return AnnualTreeCoverLossRankingView;

});
