/**
 * The SharePresenter class for the ThresholdView.
 *
 * @return SharePresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

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
