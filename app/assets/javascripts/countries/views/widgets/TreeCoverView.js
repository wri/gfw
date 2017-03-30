define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'text!countries/templates/widgets/treeCover.handlebars'
], function($, Backbone, _, Handlebars, tpl) {

  'use strict';

  var TreeCoverView = Backbone.View.extend({
    el: '#widget-tree-cover',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this.render();
    },

    render: function() {
      this.$el.html(this.template({}));
    }
  });
  return TreeCoverView;

});
