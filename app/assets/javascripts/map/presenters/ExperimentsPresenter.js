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
      var $source = $('.source');
      var variation = cxApi.chooseVariation();
      if (variation) {
        $source.addClass('info2');
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
