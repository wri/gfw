/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */

/* eslint-disable */

define(
  [
    'backbone',
    'underscore',
    'amplify',
    'chosen',
    'handlebars',
    'enquire',
    'map/presenters/LayersNavPresenter',
    'text!map/templates/layersNav.handlebars',
    'map/views/LayersCountryView'
  ],
  function(
    Backbone,
    _,
    amplify,
    chosen,
    Handlebars,
    enquire,
    Presenter,
    tpl,
    LayersCountryView
  ) {
    'use strict';

    var LayersNavView = Backbone.View.extend({
      template: Handlebars.compile(tpl),

      events: {
        'click .category-name': '_toggleLayersNav',
        'click .layer': '_toggleLayer',
        'click .wrapped-layer': '_toggleLayerWrap',
        'click .grouped-layers-trigger': 'toggleLayersGroup'
      },

      initialize: function(map, countries) {
        _.bindAll(this, '_toggleSelected');
        this.presenter = new Presenter(this);
        this.map = map;
        this.countries = countries;

        enquire.register(
          'screen and (min-width:' + window.gfw.config.GFW_MOBILE + 'px)',
          {
            match: _.bind(function() {
              this.setElement('#layers-menu');
              this.render();
            }, this)
          }
        );
        enquire.register(
          'screen and (max-width:' + window.gfw.config.GFW_MOBILE + 'px)',
          {
            match: _.bind(function() {
              this.setElement('#layers-tab');
              this.render();
            }, this)
          }
        );
      },

      render: function() {
        this.$el.html('').append(
          this.template({
            staging: window.gfw.config.FEATURE_ENV !== 'production'
          })
        );
        this.cache();
        this.fixLegibility();
        // Initialize Country dropdown layers
        new LayersCountryView(this.map, this.countries);
      },

      cache: function() {
        //Init
        this.$groupedLayers = $('.grouped-layers-trigger');
        this.$toggleUMD = $('#toggleUmd');
        this.$categoriesList = $('.categories-list');
        this.$categoriesNum = $('.category-num');
      },

      /**
       * Used by LayersNavPresenter to toggle the class
       * name selected.
       *
       * @param  {object} layerSpec
       */
      _toggleSelected: function(layers) {
        this.layers = layers;

        // Toggle sublayers
        _.each(this.$el.find('.layer'), function(li) {
          var $li = $(li);
          var $toggle = $li.find('.onoffradio, .onoffswitch');
          var $toggleIcon = $toggle.find('span');
          var $layerTitle = $li.find('.layer-title');
          var layer = layers[$li.data('layer')];

          if (layer) {
            // var isBaselayer = (layer.category_slug === 'forest_clearing');

            $li.addClass('selected');
            $toggle.addClass('checked');
            // $layerTitle.css('color', layer.title_color);
            $toggle.css('background', layer.title_color);

            ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layer.slug);
          } else {
            $li.removeClass('selected');
            $toggle
              .removeClass('checked')
              .css('background', '')
              .css('border-color', '');
            // $toggleIcon.css('background-color', '');
            // $layerTitle.css('color', '');
          }
        });
        this.toogleSelectedWrapper();
        this.checkLayersGroup();
        this.setNumbersOfLayers();
      },

      setNumbersOfLayers: function() {
        // Filter layers without iso and then group them by category
        var layersByCategory = _.groupBy(
          _.filter(this.layers, function(layer) {
            return !layer.iso;
          }),
          function(layer) {
            return layer.category_slug;
          }
        );
        this.$categoriesNum.text('');
        _.each(
          layersByCategory,
          _.bind(function(v, k) {
            $('#' + k + '-category-num').text(v.length);
          }, this)
        );
      },

      /**
       * Handles a toggle layer change UI event by dispatching
       * to LayersNavPresenter.
       *
       * @param  {event} event Click event
       */
      _toggleLayer: function(event) {
        event && event.preventDefault();
        // this prevents layer change when you click in source link
        if (
          !$(event.target).hasClass('source') &&
          !$(event.target)
            .parent()
            .hasClass('source')
        ) {
          var $elem = $(event.currentTarget);
          var layerSlug = $elem.data('layer');
          var isSubLayer = $elem.data('parent') || false;
          var openWithSublayer = $elem.data('open-with-sublayer');

          if ($elem.hasClass('wrapped')) {
            event && event.stopPropagation();

            if (
              $elem.prop('tagName') !== 'LI' &&
              !$elem.siblings().hasClass('sublayer')
            ) {
              //as the toggle are switches, we should turn off the others (siblings) before turning on our layer
              for (var i = 0; i < $elem.siblings().length; i++) {
                if ($($elem.siblings()[i]).hasClass('selected')) {
                  this.presenter.toggleLayer(
                    $($elem.siblings()[i]).data('layer'),
                    null
                  );
                }
                $elem
                  .parents('li')
                  .data('layer', $elem.data('layer'))
                  .addClass('selected');
              }
            }
          }
          if (!isSubLayer) {
            this._toggleSubLayers($elem, layerSlug);
          } else {
            this._toggleParent($elem);
          }

          this.presenter.toggleLayer(layerSlug, openWithSublayer);
          ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layerSlug);
        }
      },

      _toggleLayersNav: function(e) {
        if (
          !$(e.currentTarget)
            .parent()
            .hasClass('disabled')
        ) {
          $(e.currentTarget).toggleClass('show');
          $(e.currentTarget)
            .parent()
            .children('.layers-nav')
            .toggleClass('show');
        }
      },

      _toggleSubLayers: function($parent, layerSlug) {
        var $subLayers = $parent.find("[data-parent='" + layerSlug + "']");
        var layerChecked = $parent.find('.onoffswitch').hasClass('checked');
        if ($subLayers.length > 0) {
          var _this = this;
          $subLayers.each(function() {
            var subLayerSlug = $(this).data('layer');
            var subLayerChecked = $(this)
              .find('.onoffswitch')
              .hasClass('checked');
            var sublayerAuto = $(this).data('autotoggle');
            if (
              subLayerSlug &&
              layerChecked === subLayerChecked &&
              ((!layerChecked && sublayerAuto) || layerChecked)
            ) {
              setTimeout(function() {
                _this.presenter.toggleLayer(subLayerSlug, null);
                ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + subLayerSlug);
              }, 100);
            }
          });
        }
      },

      _toggleParent: function($elem) {
        var parentSlug = $elem.data('parent');
        var $parentEl = $elem.closest("[data-layer='" + parentSlug + "']");
        if (!$elem.hasClass('selected')) {
          if (!$parentEl.hasClass('selected')) {
            this.presenter.toggleLayer(parentSlug, null);
            ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + parentSlug);
          }
        }
      },

      _toggleLayerWrap: function(e) {
        if (
          !$(e.target).hasClass('source') &&
          !$(e.target)
            .parent()
            .hasClass('source') &&
          !$(e.target).hasClass('layer')
        ) {
          var $layers = $(e.currentTarget).find('.layer');
          if ($(e.currentTarget).hasClass('selected')) {
            _.each(
              $layers,
              _.bind(function(layer) {
                if ($(layer).hasClass('selected')) {
                  var layerSlug = $(layer).data('layer');
                  this.presenter.toggleLayer(layerSlug, null);
                }
              }, this)
            );
          } else {
            var layerSlug = $($layers[0]).data('layer');
            this.presenter.toggleLayer(layerSlug, null);
          }
        }
      },

      toogleSelectedWrapper: function(layers) {
        // Toggle sublayers
        _.each(this.$el.find('.wrapped-layer'), function(li) {
          var $li = $(li);
          var $toggle = $li.find('.onoffradio, .onoffswitch');
          var $toggleIcon = $toggle.find('span');
          var $layerTitle = $li.find('.layer-title');
          var selected = 0;
          var layer = $li.hasClass('active');
          var $layers = $li.find('.layer');

          _.each(
            $layers,
            _.bind(function(layer) {
              if ($(layer).hasClass('selected')) {
                selected++;
              }
            }, this)
          );

          if (selected > 0) {
            var color = $li.data('color') || '#cf7fec';
            $li.addClass('selected');
            $toggle.addClass('checked');
            $toggle.css('background', color);
          } else {
            $li.removeClass('selected');
            $toggle
              .removeClass('checked')
              .css('background', '')
              .css('border-color', '');
            $toggleIcon.css('background-color', '');
          }
        });
      },

      // GROUPED LAYERS
      // This 2 functions are used to control grouped layers clicks. To enable or disable layers inside
      toggleLayersGroup: function(e) {
        if (
          !$(e.target).hasClass('source') &&
          !$(e.target)
            .parent()
            .hasClass('source') &&
          !$(e.target).hasClass('layer')
        ) {
          var groupedLayers = $(e.currentTarget)
            .parent()
            .find('.layer');
          var checked =
            $(e.currentTarget)
              .find('.onoffradio')
              .hasClass('checked') ||
            $(e.currentTarget)
              .find('.onoffswitch')
              .hasClass('checked');
          _.each(
            groupedLayers,
            _.bind(function(layer) {
              var selected = $(layer).hasClass('selected');
              var layerSlug = $(layer).data('layer');
              if (checked) {
                selected ? this.presenter.toggleLayer(layerSlug, null) : null;
              } else {
                !selected ? this.presenter.toggleLayer(layerSlug, null) : null;
              }
            }, this)
          );
        }
      },

      checkLayersGroup: function() {
        _.each(
          this.$groupedLayers,
          _.bind(function(group) {
            var count = 0;
            var layers = $(group)
              .parent()
              .find('.layer');
            _.each(
              layers,
              _.bind(function(layer) {
                if ($(layer).hasClass('selected')) {
                  count++;
                }
              }, this)
            );
            var color = count == layers.length ? $(group).data('color') : '';
            $(group)
              .find('.onoffradio, .onoffswitch')
              .toggleClass('checked', count == layers.length);
            $(group)
              .find('.onoffswitch')
              .css('background-color', color);
            $(group)
              .find('.onoffradio')
              .css({ 'background-color': color, 'border-color': color });
          }, this)
        );
      },

      // BUG: If the menu has an odd width the text will be blurred
      // Theres is a css hack to fix this (http://stackoverflow.com/questions/29236793/css3-transform-blurring-and-flickering-issue-on-container-with-odd-numbered)
      // but it doesn't work or I don't know how to do it
      fixLegibility: function() {
        this.$categoriesList.width('auto');
        var w = this.$categoriesList.width();
        if (w % 2 != 0 && window.innerWidth > 1500) {
          // This is for prevent blur on layers nav
          this.$categoriesList.width(w + 1);
        }
      }
    });

    return LayersNavView;
  }
);
