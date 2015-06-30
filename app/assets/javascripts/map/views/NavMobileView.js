/**
 * The NavMobileView view.
 *
 * @return NavMobileView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'map/presenters/NavMobilePresenter',
  'text!map/templates/navmobile.handlebars'
], function(_, Handlebars, enquire, Presenter, tpl) {

  'use strict';

  var NavMobileModel = Backbone.Model.extend({
    defaults: {
      hidden: false,
    }
  });



  var NavMobileView = Backbone.View.extend({

    el: '#module-navmobile',

    events: {
      'click .toggleMobileViews' : 'showView'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.model = new NavMobileModel();
          this.presenter = new Presenter(this);
          this.render(true);
        },this)
      });
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render(false);
        },this)
      });

    },

    render: function (bool) {
      if(bool){
        this.$el.html(this.template());
        this.cacheVars();
      }else{
        this.$el.html('');
      }
    },

    cacheVars: function(){
      this.$toggleMobileViews = this.$el.find('.toggleMobileViews');
      this.$timelineBtn = $('#timeline-navmobile-btn');
      this.$layersBtn = $('#layers-navmobile-btn');
      this.$analysisBtn = $('#analysis-navmobile-btn');
    },

    showView: function(e){
      e && e.preventDefault();
      if (!$(e.currentTarget).hasClass('disabled')) {
        if (!$(e.currentTarget).hasClass('active')) {
          this.resetBtns();
          $(e.currentTarget).addClass('active');
          this.presenter.toggleCurrentTab($(e.currentTarget).data('tab'), true);
        }else{
          this.resetBtns();
          this.presenter.toggleCurrentTab($(e.currentTarget).data('tab'), false);
        }
      }
    },

    // Reset buttons
    resetBtns: function () {
      this.$toggleMobileViews.removeClass('active');
    },

    // Timeline
    toggleTimelineBtn: function(toggle){
      this.$timelineBtn.toggleClass('disabled',toggle);
    }

  });

  return NavMobileView;

});
