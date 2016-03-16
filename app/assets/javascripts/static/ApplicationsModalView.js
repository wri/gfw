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
      current: null
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
      this._initVars();
      this.setListeners();
      this.$body.append(this.el);
    },

    setListeners: function() {
      mps.subscribe('App/show', _.bind(function(id){
        this.status.set('current', id);
        this.show();
      }, this ));

      this.status.on('change:current', this.render, this);
    },

    render: function(){
      var app = _.findWhere(this.helper, {id: this.status.get('current')}); 
      this.$el.html(this.template({ app: app }));
      return this;
    },

    navigateByArrows: function(e) {
      e && e.preventDefault();
      var dir = $(e.currentTarget).data('dir');
      var current = this.status.get('current');
      switch(dir) {
        case 'left':
          (current == 1) ? current = this.helper.length - 1 : current--;
        break;
        case 'right':
          (current == this.helper.length - 1) ? current = 1 : current++;
        break;
      }
      this.status.set('current', current);
    }

  });

  return ApplicationModalView;

});

