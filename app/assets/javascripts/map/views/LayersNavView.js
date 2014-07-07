/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'presenters/LayersNavPresenter',
  'handlebars',
  'text!templates/layersNav.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    el: '.layers-menu',
    template: Handlebars.compile(tpl),

    events: {
      'click .layer': '_toggleLayer'
    },

    initialize: function() {
      _.bindAll(this, '_toggleSelected');
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    },

    /**
     * Used by LayersNavPresenter to toggle the class
     * name selected.
     *
     * @param  {object} layerSpec
     */
    _toggleSelected: function(layerSpec) {
      var activeLayers = {};

      _.each(layerSpec, function(category) {
        _.extend(activeLayers, category);
      });

      _.each(this.$el.find('.layer'), function(li) {
        var $li = $(li);
        var layer = activeLayers[$li.data('layer')];

        if (layer) {
          $li.addClass('selected').css('color', layer.title_color);
          $li.find('.onoffswitch').addClass('checked').css('background', layer.category_color);
        } else {
          $li.removeClass('selected').css('color', '');
          $li.find('.onoffswitch').removeClass('checked').css('background', '');
        }
      });
    },

    /**
     * Handles a toggle layer change UI event by dispatching
     * to LayersNavPresenter.
     *
     * @param  {event} event Click event
     */
    _toggleLayer: function(event) {
      var $currentTarget = $(event.currentTarget);
      var layerSlug = $currentTarget.data('layer');
      var category = $currentTarget.parents('ul').data('category');

      this.presenter.toggleLayer(category, layerSlug);
    },

  });

  return LayersNavView;

});
