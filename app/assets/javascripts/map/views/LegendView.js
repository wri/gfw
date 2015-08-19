/**
 * Legend module.
 *
 * @return singleton instance of the legend class (extends Widget).
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/LegendPresenter',
  'text!map/templates/legend/legend.handlebars',
  'text!map/templates/legend/loss.handlebars',
  'text!map/templates/legend/imazon.handlebars',
  'text!map/templates/legend/fires.handlebars',
  'text!map/templates/legend/forest2000.handlebars',
  'text!map/templates/legend/pantropical.handlebars',
  'text!map/templates/legend/idnPrimary.handlebars',
  'text!map/templates/legend/intact2013.handlebars',
  'text!map/templates/legend/grump.handlebars',
  'text!map/templates/legend/stories.handlebars',
  'text!map/templates/legend/terra_i.handlebars',
  'text!map/templates/legend/concesiones_forestales.handlebars',
  'text!map/templates/legend/concesiones_forestalesType.handlebars',
  'text!map/templates/legend/hondurasForest.handlebars',
  'text!map/templates/legend/colombiaForestChange.handlebars',
  'text!map/templates/legend/tigers.handlebars',
  'text!map/templates/legend/dam_hotspots.handlebars',
  'text!map/templates/legend/us_land_cover.handlebars',
  'text!map/templates/legend/global_land_cover.handlebars',
  'text!map/templates/legend/forma.handlebars',
  'text!map/templates/legend/bra_biomes.handlebars',
  'text!map/templates/legend/gfw_plantations_by_type.handlebars',
  'text!map/templates/legend/gfw_plantations_by_species.handlebars',

], function(_, Handlebars, Presenter, tpl, lossTpl, imazonTpl, firesTpl,
    forest2000Tpl, pantropicalTpl, idnPrimaryTpl, intact2013Tpl, grumpTpl, storiesTpl, terra_iTpl, concesionesTpl, concesionesTypeTpl, hondurasForestTPL,colombiaForestChangeTPL, tigersTPL, dam_hotspotsTPL, us_land_coverTPL, global_land_coverTPL, formaTPL,bra_biomesTPL, gfwPlantationByTypeTpl, gfwPlantationBySpeciesTpl) {

  'use strict';

  var LegendModel = Backbone.Model.extend({
    defaults:{
      hidden: true,
      categories_status: [],
    }
  });



  var LegendView = Backbone.View.extend({

    el: '#module-legend',

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
      grump2000: Handlebars.compile(grumpTpl),
      user_stories:  Handlebars.compile(storiesTpl),
      terrailoss: Handlebars.compile(terra_iTpl),
      concesiones_forestales: Handlebars.compile(concesionesTpl),
      concesiones_forestalesNS: Handlebars.compile(concesionesTypeTpl),
      WMSLayer: Handlebars.compile(hondurasForestTPL),
      colombia_forest_change: Handlebars.compile(colombiaForestChangeTPL),
      tigers: Handlebars.compile(tigersTPL),
      dam_hotspots: Handlebars.compile(dam_hotspotsTPL),
      us_land_cover: Handlebars.compile(us_land_coverTPL),
      global_land_cover : Handlebars.compile(global_land_coverTPL),
      us_land_cover_change : Handlebars.compile(us_land_coverTPL),
      forma : Handlebars.compile(formaTPL),
      bra_biomes : Handlebars.compile(bra_biomesTPL),
      gfw_plantations_by_type: Handlebars.compile(gfwPlantationByTypeTpl),
      gfw_plantations_by_species: Handlebars.compile(gfwPlantationBySpeciesTpl),

    },

    subtitleTemplates: {
      loss: '(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)',
      gain: '(12 years, 30m, global, Hansen/UMD/Google/USGS/NASA)',
      prodes: '(annual, 30m, Brazilian Amazon, INPE)',
      forma: '(monthly, 500m, humid tropics, WRI/CGD)',
      terrailoss: '(monthly, 250m, Latin America, CIAT)',
      imazon: '(monthly, 250m, Brazilian Amazon, Imazon)',
      modis: '(quarterly, 5km, <37 degrees north, NASA)',
      fires: '(daily, 1km, global, NASA)'
    },

    options: {
      hidden: true
    },

    events: {
      'click .category-name' : '_toogleCategory',
      'click .layer-sublayer': '_toggleLayer',
      'click .canopy-button' : '_showCanopy',
      'click .layer-close'   : '_removeLayer',
      'click .close' : 'toogleLegend',
      'click #title-dialog-legend' : 'toogleEmbedLegend',
    },

    initialize: function() {
      _.bindAll(this, 'update');
      this.presenter = new Presenter(this);
      this.model = new LegendModel();
      this.embed = $('body').hasClass('is-embed-action');
      this.$el.removeClass('hide');
      this.setListeners();
    },

    setListeners: function(){
      this.model.on('change:hidden', this.toogleModule, this);
    },

    toogleModule: function(){
      this.$el.toggleClass('hide', this.model.get('hidden'));
    },

    toogleEmbedLegend: function(e){
      e && e.preventDefault();
      var active = this.$titleDialog.hasClass('active');
      this.$titleDialog.toggleClass('active', !active);
      this.$categories.toggleClass('active', !active);
      this.$buttonLegendBox.toggleClass('active', !active);

    },

    openGFW: function(){
      if (this.embed && !!this.$linkLegendBox) {
        var href = window.location.href.replace('/embed','');
        this.$linkLegendBox.attr('href', href);
      }
    },

    /**
     *
     * @param  {array}  categories layers ordered by category
     * @param  {object} options    legend options
     */
    _renderLegend: function(categories, options, geographic) {
      var iso = null;
      var layersGlobal = [];
      var layersIso = [];
      var categoriesGlobal = [];
      var categoriesIso = [];
      var layers = _.flatten(categories);
      var layersLength = layers.length;

      // Append details template to layer.
      _.each(layers, function(layer) {
        layer.source = (layer.slug === 'nothing') ? null : layer.slug;
        if (this.detailsTemplates[layer.slug]) {
          layer.detailsTpl = this.detailsTemplates[layer.slug]({
            threshold: options.threshold || 30,
            layerTitle: layer.title
          });
        }

        if (this.subtitleTemplates[layer.slug]) {
          layer.subtitle = this.subtitleTemplates[layer.slug];
        }

        if (layer.iso) {
          var countries = amplify.store('countries');
          iso = layer.iso;
          layersIso.push(layer);
          layer.category_status = layer.category_slug+'-iso';
        } else {
          layersGlobal.push(layer);
          layer.category_status = layer.category_slug+'-global'
        }
        layer.geographic = geographic ? 'checked' : '';
      }, this);

      categoriesGlobal = this.statusCategories(_.groupBy(layersGlobal, function(layer){ return layer.category_slug }));
      categoriesIso = this.statusCategories(_.groupBy(layersIso, function(layer){ return layer.category_slug }));

      if (iso) {
        var country = _.find(amplify.store('countries'), _.bind(function(country){
          return country.iso === iso;
        }, this ));
      }
      var name = (country) ? country.name : iso;

      var html = this.template({
        categories: (jQuery.isEmptyObject(categoriesGlobal)) ? false : categoriesGlobal,
        categoriesIso: categoriesIso,
        layersLength: layersLength,
        iso: iso,
        name: name
      });

      this.render(html);
    },

    statusCategories: function(array){
      // Search for layer 'nothing'
      var categories_status = this.model.get('categories_status');
      _.each(array, function(category) {
        for (var i = 0; i< category.length; i++) {
          // Mantain categories closed in rendering
          (categories_status.indexOf(category[i]['category_status']) != -1) ? category['closed'] = true : category['closed'] = false;
          // Get layer's length of each category
          category['layers_length'] = i + 1;
        }
      }, this);

      return array;
    },

    toogleLegend: function(bool){
      var to = (bool && bool.currentTarget) ? false : bool;
      this.$el.toggleClass('active', to);
      this.presenter.toggleOverlay(to);
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

    render: function(html) {
      this.$el.html(html);
      this.$titleDialog = $('#title-dialog-legend');
      this.$categories = this.$el.find('.categories');
      this.$buttonLegendBox =  $('#button-box-embed-legend');
      this.$linkLegendBox =  $('#link-embed-legend');
    },

    /**
     * Set widget from layers object.
     *
     * @param  {array} layers
     */
    update: function(categories, options, geographic) {
      if (categories.length === 0) {
        this.model.set('hidden', true);
      } else {
        this.model.set({'hidden': false, 'boxClosed': false});
        this._renderLegend(categories, options, geographic);
      }
      //Experiment
      //this.presenter.initExperiment('source');
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
    },

    _toogleCategory: function(e){
      if ($(window).width() > window.gfw.config.GFW_MOBILE) {
        // Save category status in an array
        var categories_status = this.model.get('categories_status');
        var slug = $(e.currentTarget).data('category_slug');
        var index = categories_status.indexOf(slug);
        (index != -1) ? categories_status.splice(index, 1) : categories_status.push(slug);
        this.model.set('categories_status',categories_status);

        $(e.currentTarget).parent().toggleClass('closed');
        $(e.currentTarget).parent().children('.layers').toggleClass('closed');
      }
    },

    _removeLayer: function(e){
      e && e.preventDefault();
      var layerSlug = $(e.currentTarget).data('slug');
      this.presenter.toggleLayer(layerSlug);
    },

    _showCanopy: function(e){
      e && e.preventDefault();
      this.presenter.showCanopy();
    }





  });

  return LegendView;
});
