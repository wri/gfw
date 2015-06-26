/**
 * The ExperimentsPresenter.
 *
 * @return ExperimentsPresenter class
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var ExperimentsPresenter = PresenterClass.extend({

    init: function() {
      this._super();
      this._experiments = {
        'source' : this._source
      }
    },

    /**
     * Google Experiments.
     */
    _source: function(){
      var cxApi = cxApi || false;
      if (cxApi) {
        this.variation = (this.variation !== undefined) ? this.variation : cxApi.chooseVariation();
        // this.variation = (this.variation !== undefined) ? this.variation : Math.floor(Math.random()*3);
        switch(this.variation){
          case 0:
            $('.source').removeClass('default green yellow').addClass('default');
          break;
          case 1:
            $('.source').removeClass('default green yellow').addClass('green');
          break;
          case 2:
            $('.source').removeClass('default green yellow').addClass('yellow');
          break;
        }
      }
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Experiment/choose': function(id) {
        this._experiments[id]();
      }
    }]

  });

  return ExperimentsPresenter;
});
