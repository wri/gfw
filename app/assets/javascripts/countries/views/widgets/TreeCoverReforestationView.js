define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'text!countries/templates/widgets/treeCoverReforestation.handlebars'
], function($, Backbone, _, Handlebars, UriTemplate, tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_NEW_API;
  var DATASET = '';
  var QUERY = '';

  var TreeCoverLossView = Backbone.View.extend({
    el: '#widget-tree-cover-reforestation',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;
      this.start();
    },

    start: function() {
      this.render();
      // this._getData().done(function(res) {
      //   this.data = res.data;
      //   this.render();
      // }.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        value: 519,
        unit: 'thousand'
      }));
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({});

      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  });
  return TreeCoverLossView;

});
