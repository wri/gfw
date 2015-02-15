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
  'map/views/tabs/BasemapsView',
  'map/views/tabs/ShareView',
  'map/views/tabs/SpinnerView',
  'text!map/templates/tabs.handlebars'

], function(_, Handlebars, d3, Presenter, BasemapsView, ShareView, SpinnerView, tpl) {

  'use strict';

  var TabsView = Backbone.View.extend({

    el: '#module-tabs',

    events: {
      'click .tab' : 'toggleTabs'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.presenter = new Presenter(this);
      this.render();
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
      new BasemapsView();
      new ShareView();
    },

    toggleTabs: function(e){
      if ($(e.currentTarget).hasClass('active')) {
        // Close all tabs and reset tabs styles
        this.$container.removeClass('active')
        this.$tabs.removeClass('inactive active');
        this.$tabsContent.removeClass('selected');
      }else{
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
  });

  return TabsView;

});
