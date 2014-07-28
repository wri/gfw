/**
 * Legend module.
 *
 * @return singleton instance of the legend class (extends Widget).
 */
define([
  'underscore',
  'handlebars',
  'views/Widget',
  'presenters/LegendPresenter',
  'text!templates/legend/legend.handlebars',
  'text!templates/legend/loss.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl, lossTpl) {

  'use strict';

  var LegendView = Widget.extend({

    className: 'widget widget-legend',

    template: Handlebars.compile(tpl),

    /**
     * Optional layers detail templates.
     */
    detailsTemplates: {
      umd_tree_loss_gain : _.template(lossTpl)
    },

    options: {
      hidden: true
    },

    events: function(){
      return _.extend({}, LegendView.__super__.events, {
        'click .widget-closed': '_toggleBoxClosed',
        'click .layer-sublayer': '_toggleLayer'
      });
    },

    initialize: function() {
      _.bindAll(this, 'update');
      this.presenter = new Presenter(this);
      LegendView.__super__.initialize.apply(this);
    },

    /**
     * Render legends.
     *
     * @param  {array} layers
     */
    _renderLegend: function(categories) {
      var layersLength = _.flatten(categories).length;

      _.each(_.flatten(categories), function(layer) {
        if (this.detailsTemplates[layer.slug]) {
          layer.detailsTpl = this.detailsTemplates[layer.slug]();
        }
      }, this);

      var html = this.template({
        categories: categories,
        layersLength: layersLength
      });

      this._update(html);
    },

    /**
     * Toggle selected sublayers on the legend widget.
     *
     * @param  {object} layers The layers object
     */
    toggleSelected: function(layers) {
      _.each(this.$el.find('.layer-sublayer'), function(div) {
        var $div = $(div);
        var $toggle = $div.find('.onoffswitch');
        var layer = layers[$div.data('sublayer')];

        if (layer) {
          $toggle.addClass('checked');
          $toggle.css('background', layer.category_color);
        } else {
          $toggle.removeClass('checked').css('background', '');
        }
      }, this);
    },

    /**
     * Set widget from layers object.
     *
     * @param  {array} layers
     */
    update: function(categories) {
      if (categories.length === 0) {
        this.model.set('hidden', true);
      } else {
        this.model.set({'hidden': false, 'boxClosed': false});
        this._renderLegend(categories);
      }
    },

    /**
     * Handles a toggle layer change UI event by dispatching
     * to LegendPresenter.
     *
     * @param  {event} event Click event
     */
    _toggleLayer: function(event) {
      var layerSlug = $(event.currentTarget).data('sublayer');
      this.presenter.toggleLayer(layerSlug);
    }

  });

  return LegendView;
});
