/**
 * The TabsView view.
 *
 * @return TabsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'd3',
  'map/presenters/TabsPresenter',
  'map/views/tabs/AnalysisView',
  'map/views/tabs/BasemapsView',
  'map/views/tabs/ThresholdView',
  'map/views/tabs/ShareView',
  'map/views/tabs/SpinnerView',
  'text!map/templates/tabs.handlebars'

], function(_, Handlebars, d3, Presenter, AnalysisView, BasemapsView, ThresholdView, ShareView, SpinnerView, tpl) {

  'use strict';

  var TabsView = Backbone.View.extend({

    el: '#module-tabs',

    events: {
      'click .tab' : 'toggleTabs'
    },

    template: Handlebars.compile(tpl),

    initialize: function(map) {
      this.map = map;
      this.presenter = new Presenter(this);
      this.render();
      this.$el.removeClass('hide');
      this.$tabs = this.$el.find('.tab');
      this.$tabsContent = this.$el.find('.tab-content');
      this.$container = this.$el.find('.content')
      this.setListeners();
    },

    setListeners: function(){

    },

    render: function(){
      this.$el.html(this.template());
      this.initCustomViews();
    },

    initCustomViews: function(){
      new SpinnerView();
      new AnalysisView(this.map);
      new BasemapsView();
      new ThresholdView();
      new ShareView();
    },

    toggleTabs: function(e){
      if ($(e.currentTarget).hasClass('active')) {
        // Close all tabs and reset tabs styles
        this.$container.removeClass('active')
        this.$tabs.removeClass('inactive active');
        this.$tabsContent.removeClass('selected');
      }else{
        if (!$(e.currentTarget).hasClass('disabled')) {
          // Open current tab
          var id = $(e.currentTarget).data('tab');
          this.$container.addClass('active');

          // tabs
          this.$tabs.removeClass('active').addClass('inactive');
          $(e.currentTarget).removeClass('inactive').addClass('active');

          // tabs content
          this.$tabsContent.removeClass('selected');
          $('#'+ id).addClass('selected');

          //publish open tab
          this.presenter.onTabOpen(id);
        }
      }
    },
    openTab: function(id){
      if (!$(id).hasClass('active')) {
        $(id).trigger('click');
      }
    }
  });

  return TabsView;

});
