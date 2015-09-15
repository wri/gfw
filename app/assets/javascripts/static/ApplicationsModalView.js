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
      current: null,
      visible: false
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
      this.$document = $(document);
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
      this.model.on('change:visible', this.toggleBindings, this);
    },

    render: function(){
      this.$el.toggleClass('active',!!this.model.get('current'))
      this.model.set('visible', !!this.model.get('current'));
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

    toggleBindings: function() {
      if (!!this.model.get('visible')) {
        // document keyup
        this.$document.on('keyup', _.bind(function(e) {
          var current = this.model.get('current');
          switch(e.keyCode) {
            case 27:
              this.close();
            break;
            case 37:
              (current == 1) ? current = this.helper.length - 1 : current--;
              this.model.set('current', current);
            break;
            case 39:
              (current == this.helper.length - 1) ? current = 1 : current++;
              this.model.set('current', current);
            break;
          }
        },this));

      } else {
        this.$document.off('keyup');
      }

    },

    navigateByArrows: function(e) {
      e && e.preventDefault();
      var dir = $(e.currentTarget).data('dir');
      var current = this.model.get('current');
      switch(dir) {
        case 'left':
          (current == 1) ? current = this.helper.length - 1 : current--;
        break;
        case 'right':
          (current == this.helper.length - 1) ? current = 1 : current++;
        break;
      }
      this.model.set('current', current);
    }

  });

  return ApplicationModalView;

});

