/**
 * The TabsView view.
 *
 * @return MapControlsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/TabsPresenter',
  'text!map/templates/tabs.handlebars'

], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var MapControlsView = Backbone.View.extend({

    el: '#module-tabs',

    className: 'module',

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.presenter = new Presenter(this);
      this.render();
      this.setListeners();
    },

    setListeners: function(){

    },

    render: function(){
      this.$el.html(this.template());
      this.initCustomViews();
    },

    initCustomViews: function(){

    },


  });

  return MapControlsView;

});
