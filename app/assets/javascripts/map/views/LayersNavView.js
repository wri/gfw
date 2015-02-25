/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'amplify',
  'chosen',
  'map/presenters/LayersNavPresenter',
  'handlebars',
  'text!map/templates/layersNav.handlebars',
  'text!map/templates/layersNavByCountry.handlebars'
], function(Backbone, _, amplify, chosen, Presenter, Handlebars, tpl, tplCountry) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    el: '.layers-menu',

    template: Handlebars.compile(tpl),
    templateCountry: Handlebars.compile(tplCountry),

    events: {
      'click .layer': '_toggleLayer',
      'change #country-select' : 'changeIso'
    },

    initialize: function() {
      _.bindAll(this, '_toggleSelected');
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
      //Experiment
      this.presenter.initExperiment('source');

      //Init
      this.$layersCountry = $('#layers-country-nav');
      this.$countrySublayer = $('.country-sublayer-box')
      this.getCountries();
    },


    /**
     * Used by LayersNavPresenter to toggle the class
     * name selected.
     *
     * @param  {object} layerSpec
     */
    _toggleSelected: function(layers) {
      // Toggle sublayers
      _.each(this.$el.find('.layer'), function(li) {
        var $li = $(li);
        var $toggle = $li.find('.onoffradio, .onoffswitch');
        var $toggleIcon = $toggle.find('span');
        var $layerTitle = $li.find('.layer-title');
        var layer = layers[$li.data('layer')];

        if (layer) {
          var isBaselayer = (layer.category_slug === 'forest_clearing');

          $li.addClass('selected');
          $toggle.addClass('checked');
          $layerTitle.css('color', layer.title_color);

          if (!isBaselayer) {
            $toggle.css('background', layer.title_color);
          } else {
            $toggle.css('border-color', layer.title_color);
            $toggleIcon.css('background-color', layer.title_color);
          }
          ga('send', 'event', 'Map', 'Toogle', 'Layer: ' + layer.slug);
        } else {
          $li.removeClass('selected');
          $toggle.removeClass('checked').css('background', '').css('border-color', '');
          $toggleIcon.css('background-color', '');
          $layerTitle.css('color', '');
        }
      });
    },

    /**
     * Handles a toggle layer change UI event by dispatching
     * to LayersNavPresenter.
     *
     * @param  {event} event Click event
     */
    _toggleLayer: function(e) {
      e && e.preventDefault();
      // this prevents layer change when you click in source link
      if (!$(e.target).hasClass('source')) {
        var layerSlug = $(e.currentTarget).data('layer'),
            fil_type = 'ifl_2013_deg';

        if ($(e.currentTarget).hasClass('ifl') || $(e.currentTarget).hasClass('c_f_peru')) {
          if ($(e.currentTarget).hasClass('c_f_peru')) {
            fil_type = 'concesiones_forestalesNS';
          }
          var $elem = $(e.currentTarget);
          if ($elem.hasClass('selected')) {$elem.find('input').prop('checked',false);}
          else {$elem.find('[data-layer="' + fil_type + '"] input').prop('checked', true);}
          if ($elem.prop('tagName') !== 'LI'){
            for (var i=0;i < $elem.siblings().length; i++) {
              if ($($elem.siblings()[i]).hasClass('selected')) {
                this.presenter.toggleLayer($($elem.siblings()[i]).data('layer'));
              }
            }
            $elem.parents('li').data('layer' , $elem.data('layer')).addClass('selected');
          }
        }
        this.presenter.toggleLayer(layerSlug);
        ga('send', 'event', 'Map', 'Toogle', 'Layer: ' + layerSlug);
      }
    },

    _getIsoLayers: function(layers) {
      this.layersIso = layers;
    },

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

    /**
     * Print countries.
     */
    printCountries: function(){
      //Country select
      this.$countrySelect = $('#country-select');
      this.countries = amplify.store('countries');

      //Loop for print options
      var options = "<option></option>";
      _.each(_.sortBy(this.countries, function(country){ return country.name }), _.bind(function(country, i){
        options += '<option value="'+ country.iso +'">'+ country.name + '</option>';
      }, this ));
      this.$countrySelect.append(options);
      this.$countrySelect.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });

    },

    // Select change iso
    changeIso: function(){
      this.iso = this.$countrySelect.val();
      _.each(this.$layersCountry.find('.layer'), _.bind(function(el){
        ($(el).hasClass('selected')) ? $(el).trigger('click') : null;
      }, this ));
      this.setIsoLayers();
      if (this.iso) {
        this.presenter._analizeIso(this.iso);
      }
    },

    // For autoselect country and region when youn reload page
    setSelect: function(iso){
      this.$countrySelect.val(iso.country).trigger("liszt:updated");
      this.iso = this.$countrySelect.val();
      _.each(this.$layersCountry.find('.layer'), _.bind(function(el){
        ($(el).hasClass('selected')) ? $(el).trigger('click') : null;
      }, this ));
      this.setIsoLayers();
    },



    /**
     * Render Iso Layers.
     */
    setIsoLayers: function(e){
      var layersToRender = [];
      _.each(this.layersIso, _.bind(function(layer){
        if (layer.iso === this.iso) {
          layersToRender.push(layer);
        }
      }, this ));
      if (layersToRender.length > 0) {
        this.$countrySublayer.addClass('active');
      }else{
        this.$countrySublayer.removeClass('active');
      }
      this.renderIsoLayers(layersToRender);
    },

    renderIsoLayers: function(layers){
      this.$layersCountry.html(this.templateCountry({layers: layers }));
    }

  });

  return LayersNavView;

});
