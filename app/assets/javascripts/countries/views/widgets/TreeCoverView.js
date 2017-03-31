define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'common/views/PieGraphView',
  'text!countries/templates/widgets/treeCover.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  PieGraphView,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_NEW_API;
  var DATASET_COVER = '8ccb7957-833f-4afe-a6a0-0c288f1c9bfa';
  var QUERY_TOTAL_COVER = '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' and thresh=30 group by iso';
  var DATASET_IFL = '9860d43b-4b72-4adf-9bce-e226e803351a';
  var QUERY_TOTAL_IFL = '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' and thresh=30 group by iso';

  var TreeCoverView = Backbone.View.extend({
    el: '#widget-tree-cover',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this._getData().done(function(data) {
        this.data = data;
        this._initWidget();
      }.bind(this));
    },

    _initWidget: function() {
      this.render();

      this.pieGraph = new PieGraphView({
        el: '#tree-cover-graph',
        data: [
          {
            category: 1,
            value: this.data.totalCover,
            color: '#168500'
          },
          {
            category: 2,
            value: this.data.totalIfl,
            color: '#97be32'
          }
        ]
      });
    },

    _getData: function() {
      var $promise = $.Deferred();
      var data = {};

      var urlTotalCover = API + new UriTemplate(QUERY_TOTAL_COVER).fillFromObject({
        dataset: DATASET_COVER, iso: this.iso
      });

      $.ajax({ url: urlTotalCover, type: 'GET'})
        .done(function(totalCover) {
          data['totalCover'] = Math.round(totalCover.data[0].value / 1000000);

          $.ajax({ url: urlTotalCover, type: 'GET'})
            .done(function(totalIfl) {
              data['totalIfl'] = Math.round(totalIfl.data[0].value / 1000000);

              $promise.resolve(data)
            }.bind(this))
            .fail(function(err){
              promise.reject(err);
            });
        }.bind(this))
        .fail(function(err){
          promise.reject(err);
        });

      return $promise;
    },

    render: function() {
      this.$el.html(this.template({
        totalCover: this.data.totalCover
      }));
    }
  });
  return TreeCoverView;

});
