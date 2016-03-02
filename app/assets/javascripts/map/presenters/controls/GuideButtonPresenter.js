/**º
 * The GuideButtonPresenter class for the GuideButtonPresenter view.
 *º
 * @return GuideButtonPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var GuideButtonPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Tour/finish': function() {
        this.view.pulse();
      }
    }],

    initTour: function(tour) {
      mps.publish('Tour/open', [tour]);
    }

  });

  return GuideButtonPresenter;
});
