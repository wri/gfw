/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'chosen',
  'map/presenters/LayersCountryPresenter',
  'map/collections/CountryCollection',
  'handlebars',
  'text!map/templates/layersCountry.handlebars',
  'text!map/templates/layersCountryAtlas.handlebars',
], function(Backbone, _, chosen, Presenter, CountryCollection, Handlebars, tpl, tplAtlas) {

  'use strict';

  var LayersCountryModel = Backbone.Model.extend({});


  var LayersCountryView = Backbone.View.extend({

    el: '#country-layers',

    template: Handlebars.compile(tpl),
    templateAtlas: Handlebars.compile(tplAtlas),

    model: new (Backbone.Model.extend({
      country: null,
      countryName: null,
      countryLayers: null
    })),

    events: {
      'click .tab' : 'toggleTabs',
      'change #layers-country-select' : 'changeIso',
      'click #layers-country-reset' : 'resetIso',
      'click #layers-country-analyze' : 'analyzeIso'
    },

    initialize: function(map, countries) {
      // Init presenter
      this.presenter = new Presenter(this);
      this.map = map;
      this.countries = _.sortBy(countries, 'name');

      this.render();
      this.listeners();
    },

    render: function() {
      this.$el.html(this.template({
        countries: this.countries,
        country: this.model.get('country'),
        countryName: this.model.get('countryName') || 'Country',
        countryGFWLayers: this.getCountriesGFWLayers(),
        countryUserLayers: this.getCountriesUserLayers()
      }));

      this.cache();
      this.renderChosen();
    },

    cache: function() {
      this.$select = this.$el.find('#layers-country-select');
      this.$selectChosenId = '#layers_country_select_chosen';
      this.$atlas = this.$el.find('#layers-country-atlas');

      this.$btnAnalysis = this.$el.find('#layers-country-analyze');
      this.$btnSubscribe = this.$el.find('#layers-country-subscribe');

      // Tabs
      this.$tabs = this.$el.find('.tab');
      this.$tabList = this.$el.find('.tab-list');
      this.$tabsContent = this.$el.find('.tab-content');
      this.$container = this.$el.find('.content');
    },

    listeners: function() {
      this.model.on('change:country', this.setCountryLayers.bind(this));
    },

    // Plugins & helpers
    renderChosen: function() {
      this.$select.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      })

      this.$select.trigger('chosen:open');

      // BUG:solved, whenever you mousedown inside chosen container the scroll of the countries go back to top
      // It would be nice if we can improve this code :)
      $(this.$selectChosenId + ' .chosen-results, '+this.$selectChosenId+' .chosen-single').on("mousedown", function(e){
        e && e.stopPropagation() && e.preventDefault();
        if (!$(e.currentTarget).hasClass('chosen-results')) {
          this.$select.trigger('chosen:open');
        }
        return false;
      }.bind(this))
    },

    renderAtlas: function(data) {
      this.$atlas.html(this.templateAtlas(data));
    },

    getCountriesGFWLayers: function() {
      return _.where(this.model.get('countryLayers'), { user_data: false });
    },

    getCountriesUserLayers: function() {
      return _.where(this.model.get('countryLayers'), { user_data: true });
    },

    // SETTERS
    setLayers: function(layers) {
      this.model.set('layers', layers);
    },

    setCountry: function(iso) {
      var country = (!!iso && !!iso.country && iso.country != 'ALL') ? iso.country : null;
      var countryName = (!!iso && !!iso.country && iso.country != 'ALL') ? _.findWhere(this.countries, {iso: iso.country }).name : null;
      this.model.set('countryName', countryName);
      this.model.set('country', country);
    },

    setCountryLayers: function() {
      var country = this.model.get('country'),
          layers = this.model.get('layers'),
          countryLayers = (!!country) ? _.where(layers, {iso: country}) : null;

      // Set country layers, if they don't exists we need to
      // set it to null because visualization depends
      // on the existence of countryLayers
      this.model.set('countryLayers', countryLayers);

      this.render();
    },

    // EVENTS //
    changeIso: function(e) {
      var country = this.$select.val();
      this.presenter.publishIso({
        country: country,
        region: null
      });
    },

    resetIso: function() {
      this.presenter.publishIso({
        country: null,
        region: null
      });
    },

    resetCountryLayers: function(){
      _.each(this.model.get('countryLayers'),_.bind(function(layer){
        this.presenter._removeLayer(layer);
      }, this ))
    },

    analyzeIso: function(e) {
      e && e.preventDefault();
      this.presenter.analyzeIso();
    },

    setAnalysisButtonStatus: function(boolean) {
      this.$btnAnalysis.toggleClass('-disabled', !boolean);
    },

    setSubscribeButtonStatus: function(boolean) {
      this.$btnSubscribe.toggleClass('-disabled', !boolean);
    },

    toggleTabs: function(e){
      if ($(e.currentTarget).hasClass('active')) {
        // Close all tabs and reset tabs styles
        this.$container.removeClass('active')
        this.$tabs.removeClass('inactive active');
        this.$tabsContent.removeClass('selected');
      } else {
        if (!$(e.currentTarget).hasClass('disabled')) {
          // Open current tab
          var id = $(e.currentTarget).data('tab');
          this.$container.addClass('active');

          // tabs
          this.$tabs.removeClass('active').addClass('inactive');
          $(e.currentTarget).removeClass('inactive').addClass('active');

          // tabs content
          this.$tabsContent.removeClass('selected');
          $('#'+ id).addClass('selected');
        }
      }
    }

  });

  return LayersCountryView;

});
