/**
 * The MaptypeSelector selector view.
 *
 * @return MaptypeSelector instance (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'mps',
  'views/widget',
  'text!map/templates/maptype_selector.html'
], function(Backbone, _, mps, Widget, maptypeSelectorTpl) {

  'use strict';

  var MaptypeSelector = Widget.extend({

    className: 'widget maptype-selector',
    template: _.template(maptypeSelectorTpl),

    initialize: function() {
      MaptypeSelector.__super__.initialize.apply(this);
    },


  });

  var maptypeSelector = new MaptypeSelector();

  return maptypeSelector;

});
