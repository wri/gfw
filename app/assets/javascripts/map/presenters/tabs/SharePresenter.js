/**
 * The SharePresenter class for the SharePresenter view.
 *
 * @return SharePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var SharePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Tab/opened': function(id) {
        if (id === 'share-tab') {
          this.view.model.set('hidden',false);
          this.view.changeType();
        }else{
          this.view.model.set('hidden',true);
        }
      },
    },{
      'Place/update': function(place) {
        if (!this.view.model.get('hidden')) {
          this.view.setUrls();
        }
      }
    }],

    startSpinner: function(){
      mps.publish('Spinner/start');
    },

    stopSpinner: function(){
      mps.publish('Spinner/stop');
    }


  });

  return SharePresenter;
});
