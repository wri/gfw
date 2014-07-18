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

    className: 'widget threshold',

    template: Handlebars.compile(tpl),

    options: {
      hidden: true
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      ThresholdView.__super__.initialize.apply(this);
    }

  });

  return ThresholdView;
});
