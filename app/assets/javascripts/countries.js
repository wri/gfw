/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'handlebars',
  'mps',
  'topojson',
  'views/HeaderView',
  'views/FooterView',
  'views/DialogView',
  'countries/views/CountryListView',
  'countries/views/CountryOverviewView',
  'countries/views/CountryShowView',
  '_string',
], function($, _, Class, Backbone, Handlebars, mps, topojson, HeaderView, FooterView, DialogView, CountryListView, CountryOverviewView, CountryShowView) {
  'use strict';

  var CountryPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Landing Views.
     */
    _initViews: function() {
      //shared
      new HeaderView();
      new FooterView();
      new DialogView();

      //countries
      new CountryListView();
      new CountryOverviewView();
      new CountryShowView({ iso: ISO });
    }
  });

  new CountryPage();

});



//= require jquery/dist/jquery
//= require geojson
//= require d3/d3
//= require topojson/topojson
//= require scrollIt.min
//= require jquery.qtip.min
//= require simple_statistics

//= require gfw
//= require gfw/helpers
//= require gfw/ui/widget
//= require gfw/ui/sourcewindow
//= require gfw/ui/share
//= require gfw/ui/umd_options

//= require_tree ./countries

// $(document).ready(function() {
//   window.ga = window.ga || function() {};

//   cdb.init(function() {

//     // mobile-menu
//     window.countries_header = new gfw.ui.view.CountriesHeader();

//     if ($('.is-index-action').length > 0) {
//       window.countries_index = new gfw.ui.view.CountriesIndex();
//     }
//     if ($('.is-overview-action').length > 0 || $('.countries_overview').length > 0) {
//       window.countries_overview = new gfw.ui.view.CountriesOverview();
//     }
//     if ($('.is-show-action').length > 0) {
//       window.countries_show = new gfw.ui.view.CountriesShow({
//         iso: ISO
//       });
//     }
//   });
// });
