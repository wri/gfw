/**
 * The BasemapsView selector view.
 *
 * @return BasemapsView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'moment',
  'map/presenters/tabs/HighresolutionPresenter',
  'text!map/templates/tabs/Highresolution.handlebars'
], function(_, Handlebars, enquire, moment, Presenter, tpl) {

  'use strict';

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click button' : '_setParams'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.params_new_url;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({today: moment().format('YYYY-MM-DD'), mindate: moment().subtract(1,'month').format('YYYY-MM-DD')}));
    },

    _setParams: function(e) {
      var $objTarget = $(e.target).closest('.maptype');
      var params = {
          'satellite' : $objTarget.data('maptype'),
           'color_filter': $objTarget.find('.color').val(),
           'cloud': $objTarget.find('.cloud').val(),
           'mindate': ($objTarget.find('.mindate').val().length > 0) ? $objTarget.find('.mindate').val() : '2000-09-01',
           'maxdate': ($objTarget.find('.maxdate').val().length > 0) ? $objTarget.find('.maxdate').val() : '2015-09-01'
         };
      sessionStorage.setItem('high-resolution', btoa(JSON.stringify(params)));

      this.params_new_url = {};
      var parts = location.search.substring(1).split('&');
      for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
          this.params_new_url[nv[0]] = nv[1] || true;
      }
      if (this.params_new_url.hres) {
        var destination = window.location.search.substring(0, window.location.search.indexOf('&hres='));
      } else {
        var destination = window.location.search.toString();
      }
      this.params_new_url['hres'] = btoa(JSON.stringify(params));
      this.params_new_url = destination+'&hres='+this.params_new_url.hres;
      this.toggleLayer($objTarget.data('maptype'));
    },

    toggleLayer: function(slug) {
      if (window.location.search.contains('&hres=')) {
        this.presenter.toggleLayer(slug); //this one hide the layer
      }
      setTimeout(_.bind(function() {
        this.presenter.toggleLayer(slug); //and this other one, reactivate it with the params
     },this), 50);
      setTimeout(_.bind(function() {
        window.history.pushState("object or string", document.title, this.params_new_url);
      },this), 1500);
    }
  });

  return HighresolutionView;

});

