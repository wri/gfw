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
  'qtip',
  'scrollit',
  'views/HeaderView',
  'views/FooterView',
  'views/SourceMobileFriendlyView',
  'countries/views/CountryListView',
  'countries/views/CountryOverviewView',
  'countries/views/CountryShowView',
  'views/SourceWindowView',
  '_string',
], function($, _, Class, Backbone, Handlebars, mps, topojson, qtip, scrollit, HeaderView, FooterView, SourceMobileFriendlyView, CountryListView, CountryOverviewView, CountryShowView, SourceWindowView) {
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
      new SourceMobileFriendlyView();
      new SourceWindowView();

      //countries
      new CountryListView();
      new CountryOverviewView();
      new CountryShowView();

      this._checkDialogs();
    },

    /**
    * Display a dialog from the Landing Index First Steps options
    */
    _checkDialogs: function() {
      $(document).ready(function(type){
        if (!sessionStorage.getItem('DIALOG')) return;
        var dialog = JSON.parse(sessionStorage.getItem('DIALOG'));

        if (!dialog.display) return;

        var $container = $('.countries_list_index')[0],
            $trigger   = $( "<a data-source='" + dialog.type +"' class='source hidden hide' style='display: none'></a>" )
        $trigger.appendTo($container).trigger('click');
        sessionStorage.removeItem('DIALOG');
        window.setTimeout(function(){$('.backdrop').css('opacity', '0.3');},500);
      });
    }
  });

  new CountryPage();

});
