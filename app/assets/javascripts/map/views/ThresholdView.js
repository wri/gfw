/**
 * The ThresholdView view.
 *
 * @return ThresholdView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'views/Widget',
  'presenters/ThresholdPresenter',
  'text!templates/threshold.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var ThresholdView = Widget.extend({

    className: 'widget widget-threshold',

    template: Handlebars.compile(tpl),

    options: {
      hidden: true,
      boxHidden: true
    },

    events: function(){
      return _.extend({}, ThresholdView.__super__.events, {
        'change .slider': '_updateThreshold',
        'input .slider': '_setVisibleRange'
      });
    },

    /**
     * Map input values > threshold
     */
    valuesMap: {
      10: 10,
      20: 15,
      30: 20,
      40: 25,
      50: 30,
      60: 50,
      70: 75
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      ThresholdView.__super__.initialize.apply(this);
      this.$slider = this.$el.find('.slider');
      this.$visibleRange = this.$el.find('.visible-range');
    },

    _updateThreshold: function() {
      var threshold = this.valuesMap[this.$slider.val()];
      this.presenter.changeThreshold(threshold);
      this._setVisibleRange();
    },

    _setVisibleRange: function() {
      this.$visibleRange = this.$visibleRange.css('width', '{0}%'.format(
        (100/7) * ((80 - this.$slider.val() - 2.5) / 10)
      ));
    }
  });

  return ThresholdView;

});
