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
], function(Backbone, _, chosen, Presenter, CountryCollection, Handlebars, tpl) {

  'use strict';

  var LayersCountryView = Backbone.View.extend({

    el: '#country-layers',

    template: Handlebars.compile(tpl),

    events: {
      'change #layers-country-select' : 'changeIso'
    },

    initialize: function() {
      // Init presenter
      this.presenter = new Presenter(this);

      // Init country service
      this.countries = new CountryCollection();
      this.countries.fetch().done(function(){
        this.render();
      }.bind(this))
    },

    render: function() {
      this.$el.html(this.template({
        countries: this.countries.toJSON()
      }));
      this.cache();
      this.chosen();
    },

    cache: function() {
      this.$select = this.$el.find('#layers-country-select');
    },

    chosen: function() {
      this.$select.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });
      this.$select.trigger('liszt:open');
    },

    // EVENTS //
    changeIso: function(e) {
      var country = this.$select.val();
      this.presenter.publishIso({
        country: country, 
        region: null
      });
    }


  });

  return LayersCountryView;

});
