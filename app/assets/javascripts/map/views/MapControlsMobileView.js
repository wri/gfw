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
      'click .toggle-legend': 'toggleLegend',
      'click .toggle-analysis': 'toggleAnalysis',
      'click .toggle-countries': 'toggleCountries',
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.model = new MapControlsMobileModel();
      this.presenter = new Presenter(this);
      this.render();


      //cache
      this.$btnAnalysis = this.$el.find('.toggle-analysis');
      this.$btnCountries = this.$el.find('.toggle-countries');
    },

    render: function () {
      this.$el.html(this.template());
    },

    toggleLegend: function(){
      this.presenter.openLegend();
    },

    toggleAnalysis: function(){
      if (!this.$el.find('.toggle-analysis').hasClass('disabled')) {
        this.presenter.openAnalysis();
      }
    },

    toogleAnalysisBtn: function(to){
      this.$btnAnalysis.toggleClass('active',to);
      this.$el.toggleClass('analysis',to);
      $('.widget-timeline').toggleClass('analysis',to);
    },

    toggleCountries: function(){
      this.presenter.openCountriesTab();
    },

    toogleCountryBtn: function(iso,analyze){
      var to = !!iso.country;
      this.$btnCountries.toggleClass('active',to);
    },

    initCustomViews: function(){

    },
  });

  return MapControlsMobileView;

});
