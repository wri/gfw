/**
 * The TabsView view.
 *
 * @return MapControlsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/TabsPresenter',
  'map/views/tabs/BasemapsView',
  'text!map/templates/tabs.handlebars'

], function(_, Handlebars, Presenter, BasemapsView, tpl) {

  'use strict';

  var MapControlsView = Backbone.View.extend({

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
      new BasemapsView();
    },

    toggleTabs: function(e){
      if ($(e.currentTarget).hasClass('active')) {
        this.$container.removeClass('active')
        this.$tabs.removeClass('inactive active');
        this.$tabsContent.removeClass('selected');
      }else{
        var id = $(e.currentTarget).data('tab');
        this.$container.addClass('active');
        // tabs
        this.$tabs.removeClass('active').addClass('inactive');
        $(e.currentTarget).removeClass('inactive').addClass('active');

        // tabs content
        this.$tabsContent.removeClass('selected');
        $('#'+ id).addClass('selected');
      }
    }
  });

  return MapControlsView;

});
