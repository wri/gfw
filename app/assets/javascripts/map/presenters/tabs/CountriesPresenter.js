/**
 * The CountriesPresenter class for the CountriesPresenter view.
 *
 * @return CountriesPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      iso: null,
      dont_analyze: null
    }
  });



  var CountriesPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
      this.status = new StatusModel();
      mps.publish('Place/register', [this]);
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        this._handlePlaceGo(place.params);
      }
    },{
      'LocalMode/updateIso': function(iso) {
        this.status.set('iso', iso);
        this.view.setSelects(iso);
      }
    },{
      'Layers/isos': function(layers_iso) {
        this.view.getIsoLayers(layers_iso);
      }
    }],

    _handlePlaceGo: function(params){
      if(params.iso.country && params.iso.country !== 'ALL'){
        this.status.set('iso', params.iso);
        this.view.setSelects(params.iso);
      }
    },
    /**
     * Used by PlaceService to get the current threshold value.
     *
     * @return {Object} threshold
     */




    getPlaceParams: function() {
      var p = {};
      p.dont_analyze = this.status.get('dont_analyze');
      return p;
    },

    setAnalyze: function(to){
      this.status.set('dont_analyze', to);
      mps.publish('Place/update', [{go: false}]);
      mps.publish('Countries/changeIso',[this.status.get('iso'),this.status.get('dont_analyze')]);
    },

    initExperiment: function(id){
      mps.publish('Experiment/choose',[id]);
    },

    changeIso: function(iso){
      this.status.set('iso', iso);
      this.status.set('dont_analyze', true);
      mps.publish('Countries/changeIso',[iso,this.status.get('dont_analyze')]);
    }



  });

  return CountriesPresenter;
});
