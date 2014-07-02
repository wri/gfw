/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'presenters/LayersNavPresenter',
  'text!templates/layersNav.html'
], function(Backbone, _, Presenter, tpl) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    el: '.layers-menu',
    template: _.template(tpl),

    events: {
      'click .layer-title': '_toggleLayer'
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
     * Used by LayersNavPresenter to toggle the selected class name
     * on a layer.
     *
     * @param  {string} layerSlug
     */
    _toggleSelected: function(layerSlug) {
      this.$el.find('li[data-layer="' + layerSlug + '"]')
        .toggleClass('selected');
    },

    /**
     * Handles a toggle layer change UI event by dispatching
     * to LayersNavPresenter.
     *
     * @param  {event} event Click event
     */
    _toggleLayer: function(event) {
      var $currentTarget = $(event.currentTarget);
      var layerSlug = $currentTarget.parents('li').data('layer');
      var category = $currentTarget.parents('ul').data('category');

      this.presenter.toggleLayer(category, layerSlug);
    },

  });

  var layersNavView = new LayersNavView();

  return layersNavView;

});
