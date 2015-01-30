/**
 * The ToggleWidgetsView view.
 * Hides and shows the widgets displayed on the map
 *
 * @return ToggleWidgetsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'map/views/Widget',
  'map/presenters/ToggleWidgetsPresenter',
  'text!map/templates/togglewidgets.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var ToggleWidgetsView = Widget.extend({

    className: 'widget widget-togglewidgets',

    template: Handlebars.compile(tpl),

    options: {
      boxDraggable: false,
      boxClosed: false
    },

    events: function(){
      return _.extend({}, ToggleWidgetsView.__super__.events, {
        'click .widget-box': 'toggle'
      });
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      ToggleWidgetsView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      ToggleWidgetsView.__super__._cacheSelector.apply(this);
      this.$widget_elements = false;
      this.$map_elements = false;
      this.$status_button = this.$el.find('span');
    },

    toggle: function() {

      this.$widget_elements = (this.$widget_elements) ? this.$widget_elements : $('.widget:visible').not('.widget-timeline, .widget-togglewidgets');
      this.$map_elements = $('#viewfinder, .timeline-latlng');
      ga('send', 'event', 'Map', 'ToggleBoxes', this.$el);

      if($(this.$widget_elements[0]).is(':visible')) {
        this.$widget_elements.fadeOut();
        this.$map_elements.fadeOut();
        this.$status_button.removeClass('visible');
      } else {
        this.$widget_elements.fadeIn();
        this.$map_elements.fadeIn();
        this.$status_button.addClass('visible');
      }
    }
  });

  return ToggleWidgetsView;

});
