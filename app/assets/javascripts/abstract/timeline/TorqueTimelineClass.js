/**
 * The Timeline view module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 *
 * @return Timeline view (extends Backbone.View).
 */
define([
  'underscore', 'backbone', 'moment', 'd3', 'handlebars',
  'text!templates/timelineTorque.handlebars',
  'map/presenters/TorqueTimelinePresenter'
], function(_, Backbone, moment, d3, Handlebars, tpl, Presenter) {

  'use strict';

  var TorqueTimelineClass = Backbone.View.extend({

    initialize: function(layer, currentDate) {
      this.layer = layer;
      this.presenter = new Presenter(this);
    },

    getCurrentDate: function() {
      if (this.torqueLayer === undefined) {
        return moment(this.layer.mindate);
      }
    }

  });

  return TorqueTimelineClass;

});
