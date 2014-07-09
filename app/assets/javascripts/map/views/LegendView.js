/**
 * Legend module.
 *
 * @return singleton instance of the legend class (extends Widget).
 */
define([
  'backbone',
  'underscore',
  'views/Widget',
  'presenters/LegendPresenter',
  'handlebars',
  'text!templates/legend/legend.handlebars',
  'text!templates/legend/category.html',
  'text!templates/legend/layer.html',
  'text!templates/legend/umd_loss.html'
], function(Backbone, _, Widget, Presenter, Handlebars, tpl, categoryTpl, layerTpl, lossTpl) {

  'use strict';

  var Legend = Widget.extend({

    className: 'widget legend',
    template: Handlebars.compile(tpl),
    categoryTemplate: _.template(categoryTpl),
    layerTemplate: _.template(layerTpl),

    events: function(){
      return _.extend({}, Legend.__super__.events, {
        'click .widget-closed': 'toggleClosed',
      });
    },

    widgetOpts: {
      hidden: true
    },

    // Optional layer details templates.
    layerTpl: {
      umd_tree_loss_gain : _.template(lossTpl)
    },

    initialize: function() {
      Legend.__super__.initialize.apply(this);
      _.bindAll(this, 'update');
      this.presenter = new Presenter(this);
      this.categoryViews = {};
      this.layerViews = {};
    },

    render: function() {
      Legend.__super__.render.apply(this);

      // Cache
      this.$layersCount = this.$el.find('.layers-count');
      this.$categories = this.$widgetOpened.find('.categories');
    },

    /**
     * Used by this.update.
     *
     * @param  {[type]} categories [description]
     */
    _renderCategories: function(categories) {
      var except = _.keys(categories);

      // Remove unactive categories
      _.each(this.categoryViews, _.bind(function(category, cName) {
        if (except.indexOf(cName) < 0) {
          category.remove();
          delete this.categoryViews[cName];
        }
      }, this));

      // Render categories
      _.each(categories, _.bind(function(category, cName) {
        if (!this.categoryViews[cName]) {
          var layer = category[Object.keys(category)[0]];
          var $category = $(this.categoryTemplate({layer: layer}));
          this.$categories.append($category);
          this.categoryViews[cName] = $category;
        }
      }, this));
    },

    _renderLayers: function(layers) {
      var self = this;
      var except = _.keys(layers)

      this.$layersCount.html(except.length);

      // Remove unactive layers
      _.each(this.layerViews, function(layer, lName) {
        if (except.indexOf(lName) < 0) {
          layer.remove();
          delete self.layerViews[lName];
        }
      });

      _.each(layers, function(layer, lName) {
        if (!self.layerViews[lName]) {
          var $layer = $(self.layerTemplate({layer: layer}));
          self.categoryViews[layer.category_slug].find('.layers').append($layer);

          if (self.layerTpl[lName]){
            var $layerDetails = $(self.layerTpl[lName]({layer: layer}));
            $layer.append($layerDetails);
          }

          self.layerViews[lName] = $layer;
        }
      });
    },

    /**
     * Update the legend layers from a layerSpec.
     *
     * @param  {object} layerSpec The layer spect object
     */
    update: function(layers, categories) {
      if (Object.keys(layers).length < 1) {
        this.model.set('hidden', true);
      } else {
        this.model.set({
          'hidden': false,
          'closed': false
        });
        this._renderCategories(categories);
        this._renderLayers(layers);
      }
    },
  });

  return Legend;
});
