/**
 * The SharePresenter class for the ThresholdView.
 *
 * @return SharePresenter class.
 */
define([
  'Class'
], function(Class) {

  'use strict';

  var SharePresenter = Class.extend({

    /**
     * Constructs new SharePresenter.
     *
     * @param  {ThresholdView} view Instance of ThresholdView
     *
     * @return {class} The SharePresenter class
     */
    init: function(view) {
      this.view = view;
    }

  });

  return SharePresenter;

});
