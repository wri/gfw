/**
 * The ShareView selector view.
 *
 * @return ShareView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/tabs/ThresholdPresenter',
  'text!map/templates/tabs/threshold.handlebars'
], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var ShareView = Backbone.View.extend({

    el: '#threshold-tab',

    template: Handlebars.compile(tpl),

    initialize: function(parent) {
      this.parent = parent;
      this.presenter = new Presenter(this);
      this.render();
      this.setListeners()
    },

    cacheVars: function(){
    },

    setListeners: function(){
    },

    render: function(){
      this.$el.html(this.template());
      this.cacheVars();
    },


  });
  return ShareView;

});
