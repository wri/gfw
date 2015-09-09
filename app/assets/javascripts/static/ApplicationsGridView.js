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

  var ApplicationGridView = Backbone.View.extend({

    el: '#applicationsGridView',

    template: Handlebars.compile(tpl),

    events: {
      'click .little-card' : 'showAppInfo'
    },

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
    },

    showAppInfo: function(e) {
      e && e.preventDefault();
      var id = $(e.currentTarget).data('id');
      mps.publish('App/show', [id]);
    }

  });

  return ApplicationGridView;

});

