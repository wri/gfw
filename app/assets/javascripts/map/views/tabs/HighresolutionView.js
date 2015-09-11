/**
 * The BasemapsView selector view.
 *
 * @return BasemapsView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'map/presenters/tabs/HighresolutionPresenter',
  'text!map/templates/tabs/Highresolution.handlebars'
], function(_, Handlebars, enquire, Presenter, tpl) {

  'use strict';

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click button' : '_setParams'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function(){
      this.$el.html(this.template());
    },

    _setMaptype: function(e) {
      this.presenter.setMaptype('urthe');
    },

    _setParams: function(e) {
      var $objTarget = $(e.target).closest('.maptype');
      var params = JSON.stringify(
         {
           'color_filter': $objTarget.find('.color').val(),
           'cloud': $objTarget.find('.cloud').val(),
           'mindate': ($objTarget.find('.mindate').val().length > 0) ? $objTarget.find('.mindate').val() : '2000-09-01',
           'maxdate': ($objTarget.find('.maxdate').val().length > 0) ? $objTarget.find('.maxdate').val() : '2015-09-01'
         });
      sessionStorage.setItem($objTarget.data('maptype'), params);
      this._setMaptype();
    }
  });

  return HighresolutionView;

});

