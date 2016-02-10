/**º
 * The ToggleModulesPresenter class for the ToggleModulesPresenter view.
 *º
 * @return ToggleModulesPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var ToggleModulesPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'MapControlsToggleModules/toggle': function(hide) {
        this.view.toggleModules(hide);
      }
    }, {
      'LayerNav/change': function() {
        this.view.toggleModules(true);
      }
    }],
  });

  return ToggleModulesPresenter;
});
