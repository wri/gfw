/**
 * The CountriesView selector view.
 *
 * @return CountriesView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'amplify',
  'chosen',
  'map/presenters/tabs/CountriesPresenter',
  'text!map/templates/tabs/countries.handlebars',
  'text!map/templates/tabs/countriesIso.handlebars',
  'text!map/templates/tabs/countriesButtons.handlebars',
], function(_, Handlebars, amplify, chosen, Presenter, tpl, tplIso, tplButtons) {

  'use strict';

  var CountriesModel = Backbone.Model.extend({
    defaults: {
      country_layers: null
    }
  });



  var CountriesView = Backbone.View.extend({

    el: '#countries-tab',

    template: Handlebars.compile(tpl),
    templateIso: Handlebars.compile(tplIso),
    templateButtons: Handlebars.compile(tplButtons),

    events: {
      //countries
      'click #countries-analyze-button' : 'analyzeIso',
      'change #countries-country-select' : 'changeIso',
      'change #countries-region-select' : 'changeArea',
      'click .layer': 'toggleLayer',
      'click .wrapped-layer': 'toggleLayerWrap'

    },


    initialize: function(map) {
      this.embed = $('body').hasClass('is-embed-action');
      this.map = map;
      this.model = new CountriesModel();
      this.presenter = new Presenter(this);
      this.render();
      this.cacheVars();
      //Experiment
      this.presenter.initExperiment('source');
    },

    render: function(){
      this.$el.html(this.template());
    },

    cacheVars: function(){

      //toggle-countries-content
      this.$toggle = $('#toggle-countries-content');
      //buttons
      this.$buttons = $('#countries-buttons');
      //layers
      this.$layers = $('#countries-layers');

      //country
      this.$selects = this.$el.find('.chosen-select');
      this.$countrySelect = $('#countries-country-select');
      this.$regionSelect = $('#countries-region-select');
      this.inits();
    },

    inits: function(){
      // countries
      this.setStyle(0.45);
      this.getCountries();
      if (!this.embed) {
        setTimeout(_.bind(function(){
          this.presenter.openTab('#countries-tab-button');
        },this), 0);
      }
    },

    /**
     * Set geojson style.
     */
    setStyle: function(opacity) {
      this.style = {
        strokeWeight: 2,
        fillOpacity: opacity,
        fillColor: '#FFF',
        strokeColor: '#A2BC28',
        icon: new google.maps.MarkerImage(
          '/assets/icons/marker_exclamation.png',
          new google.maps.Size(36, 36), // size
          new google.maps.Point(0, 0), // offset
          new google.maps.Point(18, 18) // anchor
        )
      };

      this.map.data.setStyle(this.style);
    },

    getIsoLayers: function(layers){
      this.isoLayers = layers;
    },

    setIsoLayers: function(){
      var layersToRender = [];
      _.each(this.isoLayers, _.bind(function(layer){
        if (layer.iso === this.iso) {
          layersToRender.push(layer);
        }
      }, this ));

      this.renderIsoLayer(layersToRender);
    },

    renderIsoLayer: function(layersToRender){
      this.$layers.html(this.templateIso({ layers: layersToRender }));
      this.$layers.find('.layers-list').html($('#country-layers .layers-list').html())
      this._selectSubIsoLayer();
    },

    _selectSubIsoLayer: function() {
      var parentSelected = this.$layers.find('.layer:first').hasClass('selected');
      var subLayersSelected = this.$layers.find('.wrapped.selected').length > 0;
      if (!subLayersSelected && parentSelected) {
        this.$layers.find('.wrapped:first').click();
      }
    },

    toggleLayer: function(event) {
      // event.stopPropagation();
      event.preventDefault();

      if (!$(event.target).hasClass('source') && !$(event.target).parent().hasClass('source')) {
        var $li = $(event.currentTarget);
        var layerSlug = $li.data('layer');
        var layer = _.where(this.isoLayers, {slug: layerSlug})[0];

        if (layer) {
          $('#country-layers [data-layer="'+layerSlug+'"]:first').click()
          ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layerSlug);
        }
      }
    },

    toggleLayerWrap: function(e){
      if (!$(e.target).hasClass('source') && !$(e.target).parent().hasClass('source') && !$(e.target).hasClass('layer')) {
        var $li = $(e.currentTarget);
        var layerSlug = $li.data('layer');
        $('#country-layers [data-layer="'+layerSlug+'"]:first').click();
      }
    },

    setButtons: function(to, country){
      this.$toggle.toggleClass('active', to);
      this.$buttons.html(this.templateButtons( {iso: this.iso, country: country} ));
    },

    analyzeIso: function(e){
      this.presenter.setAnalyze(null);
    },


    /**
     * COUNTRY
     */

    /**
     * Ajax for getting countries.
     */
    getCountries: function(){
      if (!amplify.store('countries')) {
        var sql = ['SELECT c.iso, c.name FROM gfw2_countries c WHERE c.enabled = true'];
        $.ajax({
          url: 'https://wri-01.cartodb.com/api/v2/sql?q='+sql,
          dataType: 'json',
          success: _.bind(function(data){
            amplify.store('countries', data.rows);
            this.printCountries();
          }, this ),
          error: function(error){
            console.log(error);
          }
        });
      }else{
        this.printCountries()
      }
    },

    getSubCountries: function(){
      this.$regionSelect.attr('disabled', true).trigger("liszt:updated");
      var sql = ["SELECT gadm_1_all.cartodb_id, gadm_1_all.iso, gadm2_provinces_simple.id_1, gadm2_provinces_simple.name_1 as name_1 FROM gadm_1_all, gadm2_provinces_simple where gadm_1_all.iso = '"+this.iso+"' AND gadm2_provinces_simple.iso = '"+this.iso+"' AND gadm2_provinces_simple.id_1 = gadm_1_all.id_1 order by id_1 asc"];
      $.ajax({
        url: 'https://wri-01.cartodb.com/api/v2/sql?q='+sql,
        dataType: 'json',
        success: _.bind(function(data){
          this.printSubareas(data.rows);
        }, this ),
        error: function(error){
          console.log(error);
        }
      });
    },

    /**
     * Print countries.
     */
    printCountries: function(){
      //Country select
      this.countries = amplify.store('countries');

      //Loop for print options
      var options = "<option></option>";
      _.each(_.sortBy(this.countries, function(country){ return country.name }), _.bind(function(country, i){
        options += '<option value="'+ country.iso +'">'+ country.name + '</option>';
      }, this ));
      this.$countrySelect.append(options);
      this.$selects.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });
    },

    printSubareas: function(subareas){
      var subareas = subareas;
      var options = "<option></option>";
      _.each(_.sortBy(subareas, function(area){ return area.name_1 }), _.bind(function(area, i){
        options += '<option value="'+ area.id_1 +'">'+ area.name_1 + '</option>';
      }, this ));
      this.$regionSelect.empty().append(options).removeAttr('disabled');
      this.$regionSelect.val(this.area).trigger("liszt:updated");
    },

    // Select change iso
    changeIso: function(e){
      this.iso = $(e.currentTarget).val() || null;
      this.setIsoLayers();
      this.setButtons(!!this.iso);
      this.presenter.changeIso({country: this.iso, region: null});
    },

    // For autoselect country and region when youn reload page
    setSelects: function(iso){
      this.iso = iso.country;
      // this.area = iso.region;
      this.setIsoLayers();
      this.setButtons(!!this.iso);
      this.$countrySelect.val(this.iso).trigger("liszt:updated");
      // this.$regionSelect.val(this.area).trigger("liszt:updated");
      if (this.iso) {
        this.getAdditionalInfoCountry();
      }
    },

    getAdditionalInfoCountry: function(){
      if (!amplify.store('country-'+this.iso)) {
        $.ajax({
          url: window.gfw.config.GFW_API_HOST + '/countries/'+this.iso,
          dataType: 'json',
          success: _.bind(function(data){
            amplify.store('country-'+this.iso, data);
            this.setAdditionalInfoCountry();
          }, this ),
          error: function(error){
            console.log(error);
          }
        });
      }else{
        this.setAdditionalInfoCountry()
      }
      // #{ENV['GFW_API_HOST']}/countries/#{iso}
    },

    setAdditionalInfoCountry: function(){
      var country = amplify.store('country-'+this.iso);
      this.setButtons(!!this.iso, country);
    },

  });

  return CountriesView;

});
