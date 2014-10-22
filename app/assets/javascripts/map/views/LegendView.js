/**
 * Legend module.
 *
 * @return singleton instance of the legend class (extends Widget).
 */
define([
  'underscore',
  'handlebars',
  'map/views/Widget',
  'map/presenters/LegendPresenter',
  'text!map/templates/legend/legend.handlebars',
  'text!map/templates/legend/loss.handlebars',
  'text!map/templates/legend/imazon.handlebars',
  'text!map/templates/legend/fires.handlebars',
  'text!map/templates/legend/forest2000.handlebars',
  'text!map/templates/legend/pantropical.handlebars',
  'text!map/templates/legend/idnPrimary.handlebars',
  'text!map/templates/legend/intact2013.handlebars',
  'text!map/templates/legend/grump.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl, lossTpl, imazonTpl, firesTpl,
    forest2000Tpl, pantropicalTpl, idnPrimaryTpl, intact2013Tpl, grumpTpl) {

  'use strict';

  var LegendView = Widget.extend({

    className: 'widget widget-legend',

    template: Handlebars.compile(tpl),

    /**
     * Optional layers detail templates.
     */
    detailsTemplates: {
      loss: Handlebars.compile(lossTpl),
      imazon: Handlebars.compile(imazonTpl),
      fires: Handlebars.compile(firesTpl),
      forest2000: Handlebars.compile(forest2000Tpl),
      pantropical: Handlebars.compile(pantropicalTpl),
      idn_primary: Handlebars.compile(idnPrimaryTpl),
      ifl_2013_deg: Handlebars.compile(intact2013Tpl),
      grump2000: Handlebars.compile(grumpTpl)
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
     * Update legend widget by calling widget._update.
     *
     * @param  {array}  categories layers ordered by category
     * @param  {object} options    legend options
     */
    _renderLegend: function(categories, options) {
      var layers = _.flatten(categories);
      var layersLength = layers.length;

      // Append details template to layer.
      _.each(layers, function(layer) {
        if (this.detailsTemplates[layer.slug]) {
          layer.detailsTpl = this.detailsTemplates[layer.slug]({
            threshold: options.threshold || 10,
            layerTitle: layer.title
          });
        }
        // if (layer.slug === 'loss') layer.source = 'loss';
      }, this);

      // Search for layer 'nothing'
      _.each(categories, function(category) {
        for (var i = 0; i< category.length; i++) {
          if(category[i]['slug'] === 'nothing'){
            category[i]['source'] = null;
          } else {
            category[i]['source'] = category[i]['slug'];
          }
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
    update: function(categories, options) {
      if (categories.length === 0) {
        this.model.set('hidden', true);
      } else {
        this.model.set({'hidden': false, 'boxClosed': false});
        this._renderLegend(categories, options);
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
