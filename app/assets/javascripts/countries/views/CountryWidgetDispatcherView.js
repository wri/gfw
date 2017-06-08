/**
 * The Country Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'services/CountryService',
  'countries/views/widgets/TreeCoverView',
  'countries/views/widgets/TreeCoverLossView',
], function($,
  Backbone,
  _,
  Handlebars,
  CountryService,
  TreeCoverView,
  TreeCoverLossView) {

  'use strict';

  var CountryWidgetDispatcherView = Backbone.View.extend({
    el: '.js-country-embed-widget',

    initialize: function(options) {
      this.widget = options.widget;
      this.iso = options.iso;
      this.region = options.region !== null ? options.region : 0;

      if(this.region !== 0){
        this._getDataRegions().then(function(results) {
          this.data = results;
          this._loadWidget();
        }.bind(this));
      } else {
        this._getData().then(function(results) {
          this.data = results;
          this._loadWidget();
        }.bind(this));
      }
    },

    _getData: function() {
      return CountryService.showCountry({ iso: this.iso });
    },

    _getDataRegions: function() {
      return CountryService.showRegion({ iso: this.iso, region: this.region });
    },

    _loadWidget: function () {
      switch (this.widget) {
        case 'tree_cover':
        case 'alerts':
          this._setWidgetId('widget-tree-cover');
          new TreeCoverView({
            iso: this.iso,
            region: this.region
          });
          break;
        case 'tree_cover_loss':
          this._setWidgetId('widget-tree-cover-loss');
          new TreeCoverLossView({
            iso: this.iso,
            region: this.region,
            countryData: this.data
          });
          break;
      }
    },

    _setWidgetId: function (id) {
      this.$el.attr('id', id);
    }
  });

  return CountryWidgetDispatcherView;
});
