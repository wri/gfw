/**
 * The Interesting view.
 */
define([
  'jquery',
  'backbone',
  'handlebars',
  'mps',
  'static/helpers/applicationsHelper',
  'text!static/templates/applications.handlebars',
], function($,Backbone,Handlebars,mps,applicationsHelper,tpl) {

  'use strict';

  var InterestingView = Backbone.View.extend({

    el: '#applicationsGridView',

    template: Handlebars.compile(tpl),

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //helper
      this.helper = applicationsHelper;

      //init
      this.render();
    },

    render: function(){
      this.$el.html(this.template({ applications: this.helper }));
    }

  });

  return InterestingView;

});

