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
     * Used by LayersNavPresenter to toggle the class
     * name selected.
     *
     * @param  {object} layerSpec
     */
    _toggleSelected: function(layerSpec) {
      var activeLayers = _.flatten(_.map(layerSpec, function(value, key) {
        return _.keys(value);
      }));

      _.each(this.$el.find('.layer'), function(li) {
        var $li = $(li);

        if (activeLayers.indexOf($li.data('layer')) > -1) {
          $li.addClass('selected');
        } else {
          $li.removeClass('selected');
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
      var layerSlug = $currentTarget.parents('li').data('layer');
      var category = $currentTarget.parents('ul').data('category');

      this.presenter.toggleLayer(category, layerSlug);
    },

  });

  return LayersNavView;

});
