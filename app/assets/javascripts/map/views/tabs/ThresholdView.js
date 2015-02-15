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

    valuesMap: {
      0: 10,
      1: 15,
      2: 20,
      3: 25,
      4: 30,
      5: 50,
      6: 75
    },

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
      this.$el.html(this.template({values: this.valuesMap }));
      this.cacheVars();
    },


  });
  return ShareView;

});
