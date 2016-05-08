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

  var ApplicationGridModel = Backbone.Model.extend({
    defaults: {
      filters: []
    }
  });


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
      this.model = new ApplicationGridModel();
      this.helper = applicationsHelper;

      this.$cutTop = $('#cutTop');

      //init
      this.setListeners();
      this.render();
    },

    setListeners: function() {
      mps.subscribe('App/filters', _.bind(function(filters){
        this.model.set('filters', filters);
      }, this ));

      this.model.on('change:filters', this.render, this);
      this.model.on('change:filters', this.scrollTo, this);

    },

    render: function(){
      this.$el.html(this.template({ applications: this.parseData() }));
      mps.publish('App/render');
    },

    scrollTo: function() {
      $('html,body').animate({
        scrollTop: this.$cutTop.offset().top
      },500)
    },

    parseData: function() {
      if (!!this.model.get('filters').length) {
        return _.filter(this.helper, _.bind(function(app){
          if (!!app.tags) {
            var filter_found = _.intersection(this.model.get('filters'), app.tags);
            return !!filter_found.length;
          }
        }, this ));
      } else {
        return this.helper;
      }
    },

    showAppInfo: function(e) {
      e && e.preventDefault();
      var id = $(e.currentTarget).data('id');
      mps.publish('App/show', [id]);
    }

  });

  return ApplicationGridView;

});

