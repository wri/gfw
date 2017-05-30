define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'text!countries/templates/widgets/treeCoverGain.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  NumbersHelper,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET = '4baa763a-1e33-4c68-8c89-d23ee5033c58';
  var QUERY = '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' group by iso';

  var TreeCoverGainView = Backbone.View.extend({
    el: '#widget-tree-cover-gain',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this._getData().done(function(res) {
        this.data = res.data[0];
        this.render();
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        value: NumbersHelper.addNumberDecimals(Math.round(this.data.value / 10000)),
        unit: 'Ha'
      }));
      $('#widget-tree-cover-gain').removeClass('-loading');
      // this.$el.removeClass('-loading');
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({
        dataset: DATASET,
        iso: this.iso
      });

      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  });
  return TreeCoverGainView;

});
