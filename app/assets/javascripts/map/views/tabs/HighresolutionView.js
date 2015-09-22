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
      this.$el.html(this.template({today: moment().format('YYYY-MM-DD'), mindate: moment().subtract(3,'month').format('YYYY-MM-DD')}));
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
      var b64 = btoa(JSON.stringify(params));
      sessionStorage.setItem('high-resolution', b64);
      this.toggleLayer($objTarget.data('maptype'), b64);
    },

    toggleLayer: function(slug, params) {
        this.presenter.toggleLayer(slug); //this one hides the layer
        this.presenter.setHres(params);
    }
  });

  return HighresolutionView;

});

