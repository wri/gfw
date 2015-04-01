/**º
 * The SearchboxPresenter class for the SearchboxPresenter view.
 *º
 * @return SearchboxPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var SearchboxPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'MapControlsToggleModules/toggle': function() {
        this.view.toggleModules();
      }
    }],
  });

  return SearchboxPresenter;
});
