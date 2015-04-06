/**
 * The MapControlsMobileView view.
 *
 * @return MapControlsMobileView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'map/presenters/MapControlsMobilePresenter',
  'text!map/templates/mapcontrolsmobile-mobile.handlebars'
], function(_, Handlebars, enquire, Presenter, tpl) {

  'use strict';

  var MapControlsMobileModel = Backbone.Model.extend({
    defaults: {
      hidden: false,
    }
  });



  var MapControlsMobileView = Backbone.View.extend({

    el: '#module-map-controls-mobile',

    events: {
      'click .toggle-legend': 'toggleLegend'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.model = new MapControlsMobileModel();
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function (mobile) {
      this.$el.html(this.template());
    },

    toggleLegend: function(){
      this.presenter.openLegend();
    },

    initCustomViews: function(){

    },
  });

  return MapControlsMobileView;

});
