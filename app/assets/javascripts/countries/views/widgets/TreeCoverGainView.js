define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'text!countries/templates/widgets/treeCoverGain.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_NEW_API;
  var DATASET = '';
  var QUERY = '';

  var TreeCoverGainView = Backbone.View.extend({
    el: '#widget-tree-cover-gain',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        value: '7,366,733',
        unit: 'Ha'
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
  return TreeCoverGainView;

});
