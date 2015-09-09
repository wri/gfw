/**
 * The ApplicationModal view.
 */
define([
  'jquery',
  'backbone',
  'handlebars',
  'mps',
  'static/helpers/applicationsHelper',
  'text!static/templates/applicationsModal.handlebars',
], function($,Backbone,Handlebars,mps,applicationsHelper,tpl) {

  'use strict';

  var ApplicationModalModel = Backbone.Model.extend({
    defaults: {
      current: null
    }
  })

  var ApplicationModalView = Backbone.View.extend({

    el: '#applicationModalView',

    template: Handlebars.compile(tpl),

    events: {
      'click .close' : 'close',
      'click .shadow' : 'close',
      'click .btn-direction' : 'navigateByArrows'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //helper
      this.model = new ApplicationModalModel();
      this.helper = applicationsHelper;

      //init
      this.setListeners()
    },

    setListeners: function() {
      mps.subscribe('App/show', _.bind(function(id){
        this.model.set('current', id);
      }, this ));

      this.model.on('change:current', this.render, this);
    },

    render: function(){
      this.$el.toggleClass('active',!!this.model.get('current'))
      if (!!this.model.get('current')) {
        var app = _.findWhere(this.helper, {id: this.model.get('current')});
        this.$el.html(this.template({ app: app }));
      } else {
        this.$el.html('');
      }
    },

    close: function(e) {
      e && e.preventDefault();
      this.model.set('current',false);
    },

    navigateByArrows: function(e) {
      e && e.preventDefault();
      var dir = $(e.currentTarget).data('dir');
      var current = this.model.get('current');
      switch(dir) {
        case 'left':
          (current == 0) ? current = this.helper.length - 1 : current--;
        break;
        case 'right':
          (current == this.helper.length - 1) ? current = 0 : current++;
        break;
      }
      console.log(current);
      this.model.set('current', current);
    }

  });

  return ApplicationModalView;

});

