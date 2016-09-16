/**
 * The ApplicationModal view.
 */
define([
  'jquery',
  'backbone',
  'handlebars',
  'mps',
  'views/ModalView',
  'static/helpers/applicationsHelper',
  'text!static/templates/applicationsModal.handlebars',
], function($,Backbone,Handlebars,mps,ModalView,applicationsHelper,tpl) {

  'use strict';

  var ApplicationModalStatus = Backbone.Model.extend({
    defaults: {
      current: null,
      filteredApps: []
    }
  })

  var ApplicationModalView = ModalView.extend({

    id: 'applicationModal',

    className: "modal",

    template: Handlebars.compile(tpl),

    events: function(){
      return _.extend({},ModalView.prototype.events,{
        'click .btn-direction' : 'navigateByArrows'
      });
    },

    initialize: function() {
      this.constructor.__super__.initialize.apply(this);
      this.status = new ApplicationModalStatus();
      this.helper = applicationsHelper;
      this.render();
      this._cache();
      this.setListeners();
      this.$body.append(this.el);
    },

    setListeners: function() {
      mps.subscribe('App/show', _.bind(function(id){
        this.status.set('current', id);
        this.show();
      }, this ));
      mps.subscribe('App/filters', _.bind(function(filters){
        this.status.set('filteredApps', this.filterApps(filters));
      }, this ));

      this.status.on('change:current', this.render, this);
      this.status.on('change:filteredApps', this.render, this);

    },

    render: function(){
      var app = this.status.get('filteredApps').length > 0 ?
        this.status.get('filteredApps')[this.status.get('current')] :
        this.helper[this.status.get('current')];
      this.$el.html(this.template({ app: app }));
      return this;
    },

    navigateByArrows: function(e) {
      e && e.preventDefault();
      var dir = $(e.currentTarget).data('dir');
      var current = this.status.get('current');
      var apps = this.status.get('filteredApps').length > 0 ?
        this.status.get('filteredApps') :
        this.helper;
      switch(dir) {
        case 'left':
          (current == 0) ? current = apps.length - 1 : current--;
        break;
        case 'right':
          (current == apps.length - 1) ? current = 0 : current++;
        break;
      }
      this.status.set('current', current);
    },

    filterApps: function(filters){
      var apps = _.filter(this.helper, _.bind(function(app){
        if (!!app.tags) {
          var filter_found = _.intersection(filters, app.tags);
          return !!filter_found.length;
        }
      }, this ));
      return apps;
    }

  });

  return ApplicationModalView;

});

