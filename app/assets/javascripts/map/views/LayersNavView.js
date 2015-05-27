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
  'text!map/templates/layersNavByCountry.handlebars',
  'text!map/templates/layersNavByCountryWrapper.handlebars'
], function(Backbone, _, amplify, chosen, Presenter, Handlebars, tpl, tplCountry, tplCountryWrapper) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    template: Handlebars.compile(tpl),
    templateCountry: Handlebars.compile(tplCountry),
    templateCountryWrapper: Handlebars.compile(tplCountryWrapper),

    events: {
      'click .category-name' : '_toggleLayersNav',
      'click .layer': '_toggleLayer',
      'click .wrapped-layer': '_toggleLayerWrap',
      'click .grouped-layers-trigger' : 'toggleLayersGroup',
      'click #country-layers' : '_showNotification',
      'click #country-layers-reset' : '_resetIso'
    },

    initialize: function() {
      _.bindAll(this, '_toggleSelected');
      this.presenter = new Presenter(this);
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.setElement('#layers-menu');
          this.render();
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.setElement('#layers-tab');
          this.render();
        },this)
      });
    },

    render: function() {
      this.$el.html('').append(this.template());
      //Experiment
      this.presenter.initExperiment('source');

      //Init
      this.$groupedLayers = $('.grouped-layers-trigger');
      this.$toggleUMD = $('#toggleUmd');
      this.$categoriesList = $('.categories-list');
      this.$categoriesNum = $('.category-num');
      this.$layersCountry = $('#layers-country-nav');
      this.$countryLayers = $('#country-layers');
      this.$countryLayersReset = $('#country-layers-reset');

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
          $layerTitle.css('color', layer.title_color);
          $toggle.css('background', layer.title_color);

          ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layer.slug);
        } else {
          $li.removeClass('selected');
          $toggle.removeClass('checked').css('background', '').css('border-color', '');
          $toggleIcon.css('background-color', '');
          $layerTitle.css('color', '');
        }
      });
      this.toogleSelectedWrapper();
      this.checkLayersGroup();
      this.setNumbersOfLayers();
    },

    setNumbersOfLayers: function(){
      // Filter layers without iso and then group them by category
      var layersByCategory = _.groupBy(_.filter(this.layers, function(layer){ return !layer.iso }), function(layer){ return layer.category_slug; });
      this.$categoriesNum.text('');
      _.each(layersByCategory, _.bind(function(v,k){
        $('#'+k+'-category-num').text(v.length);
      },this));
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
      if (!$(event.target).hasClass('source') && !$(event.target).parent().hasClass('source')) {
        var layerSlug = $(event.currentTarget).data('layer');

        if ($(event.currentTarget).hasClass('wrapped')) {
          event && event.stopPropagation();

          var $elem = $(event.currentTarget);
          if ($elem.prop('tagName') !== 'LI'){
            //as the toggle are switches, we should turn off the others (siblings) before turning on our layer
            for (var i=0;i < $elem.siblings().length; i++) {
              if ($($elem.siblings()[i]).hasClass('selected')) {
                this.presenter.toggleLayer($($elem.siblings()[i]).data('layer'));
              }
              $elem.parents('li').data('layer' , $elem.data('layer')).addClass('selected');
            }
          }
        }
        this.presenter.toggleLayer(layerSlug);
        ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layerSlug);
      }
    },

    _toggleLayersNav: function(e){
      if (!$(e.currentTarget).parent().hasClass('disabled')) {
        $(e.currentTarget).toggleClass('show');
        $(e.currentTarget).parent().children('.layers-nav').toggleClass('show');
      }
    },

    _toggleLayerWrap: function(e){
      if (!$(e.target).hasClass('source') && !$(e.target).parent().hasClass('source') && !$(e.target).hasClass('layer')) {
        var $layers = $(e.currentTarget).find('.layer');

        if ($(e.currentTarget).hasClass('selected')) {
          _.each($layers, _.bind(function(layer){
            if ($(layer).hasClass('selected')) {
              $(layer).click();
            }
          }, this ))
        }else{
          $($layers[0]).click();
        }
      }
    },

    toogleSelectedWrapper: function(layers){
      // Toggle sublayers
      _.each(this.$el.find('.wrapped-layer'), function(li) {
        var $li = $(li);
        var $toggle = $li.find('.onoffradio, .onoffswitch');
        var $toggleIcon = $toggle.find('span');
        var $layerTitle = $li.find('.layer-title');
        var selected = 0;
        var layer = $li.hasClass('active');
        var $layers = $li.find('.layer');

        _.each($layers, _.bind(function(layer){
          if ($(layer).hasClass('selected')) {
            selected ++;
          }
        }, this ))

        if (selected > 0) {
          var color = $li.data('color') || '#cf7fec';
          $li.addClass('selected');
          $toggle.addClass('checked');
          $layerTitle.css('color', color);
          $toggle.css('background', color);
        } else {
          $li.removeClass('selected');
          $toggle.removeClass('checked').css('background', '').css('border-color', '');
          $toggleIcon.css('background-color', '');
          $layerTitle.css('color', '');
        }
      });

    },


    // GROUPED LAYERS
    // This 2 functions are used to control grouped layers clicks. To enable or disable layers inside
    toggleLayersGroup: function(e){
      var groupedLayers = $(e.currentTarget).parent().find('.layer');
      var checked = $(e.currentTarget).find('.onoffradio').hasClass('checked') || $(e.currentTarget).find('.onoffswitch').hasClass('checked');
      _.each(groupedLayers, _.bind(function(layer){
        var selected = $(layer).hasClass('selected');
        if (checked) {
          (selected) ? $(layer).trigger('click') : null;
        }else{
          (!selected) ? $(layer).trigger('click') : null;
        }
      }, this));
    },

    checkLayersGroup: function(){
      _.each(this.$groupedLayers, _.bind(function(group){
        var count = 0;
        var layers = $(group).parent().find('.layer');
        _.each(layers, _.bind(function(layer){
          if ($(layer).hasClass('selected')) {
            count ++;
          }
        }, this));
        var color = (count == layers.length) ? $(group).data('color') : '';
        $(group).find('.onoffradio, .onoffswitch').toggleClass('checked', (count == layers.length));
        $(group).find('.onoffswitch').css('background-color', color);
        $(group).find('.onoffradio').css({'background-color': color, 'border-color' : color });


      }, this ))
    },

    /**
     * Set and update iso
     */
    setIso: function(iso){
      this.iso = iso.country;
      this.region = iso.region;
      this.setIsoLayers();
    },

    updateIso: function(iso){
      // This is for preventing blur on layers nav
      this.$categoriesList.width('auto');
      (iso.country !== this.iso) ? this.resetIsoLayers() : null;
      this.iso = iso.country;
      this.region = iso.region;
      this.setIsoLayers();
    },

    _resetIso: function(){
      this.presenter.resetIso();
    },

    /**
     * Render Iso Layers.
     */
    _getIsoLayers: function(layers) {
      this.layersIso = layers;
    },

    resetIsoLayers: function(){
      _.each(this.$countryLayers.find('.layer'),function(li){
        if ($(li).hasClass('selected')) {
          $(li).click();
        }
      })
    },

    setIsoLayers: function(e){
      var layersToRender = [];
      _.each(this.layersIso, _.bind(function(layer){
        if (layer.iso === this.iso) {
          layersToRender.push(layer);
        }
      }, this ));

      if (!!this.iso && this.iso !== 'ALL') {
        this.$countryLayersReset.removeClass('hidden');
      }else{
        this.$countryLayersReset.addClass('hidden');
      }


      if(layersToRender.length > 0) {
        this.$countryLayers.addClass('active').removeClass('disabled');
        this.$countryLayersReset.addClass('active').removeClass('disabled');
      }else{
        this.$countryLayers.removeClass('active').addClass('disabled');
        this.$countryLayersReset.removeClass('active').addClass('disabled');
      }
      this.renderIsoLayers(layersToRender);
    },

    renderIsoLayers: function(layers){
      var country = _.find(amplify.store('countries'), _.bind(function(country){
        return country.iso === this.iso;
      }, this ));
      var name = (country) ? country.name : 'Country';
      (country) ? this.$countryLayers.addClass('iso-detected') : this.$countryLayers.removeClass('iso-detected');
      this.$countryLayers.html(this.templateCountry({ country: name ,  layers: layers }));
      for (var i = 0; i< layers.length; i++) {
        if (!!layers[i].does_wrapper) {
          var self = this;
          var wrapped_layers = JSON.parse(layers[i].does_wrapper);
          self.$countryLayers.find('.does_wrapper').html(self.templateCountryWrapper({layers: wrapped_layers}));
          var removeLayerFromCountry = function(layer) {
            self.$countryLayers.find('[data-layer="' +  layer.slug + '"]:not(.wrapped)').remove();
          }
          _.each(wrapped_layers,removeLayerFromCountry);
        }
      }

      this.fixLegibility();

      this.presenter.initExperiment('source');
      this._toggleSelected(this.layers);
    },

    fixLegibility: function(){
      var w = this.$categoriesList.width();
      if (w%2 != 0) {
        // This is for preventing blur on layers nav
        this.$categoriesList.width(w+1);
      }

    },

    _showNotification: function(e){
      if ($(e.currentTarget).hasClass('disabled')) {
        if($(e.currentTarget).hasClass('iso-detected')){
          this.presenter.notificate('not-country-not-has-layers');
        }else{
          this.presenter.notificate('not-country-choose');
          $('#countries-tab-button').addClass('pulse');
          setTimeout(function(){
            $('#countries-tab-button').removeClass('pulse');
          },3000);
        }
      }
    }

  });

  return LayersNavView;

});
