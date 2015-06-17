/**
 * The BasemapsView selector view.
 *
 * @return BasemapsView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/tabs/BasemapsPresenter',
  'text!map/templates/tabs/basemaps.handlebars'
], function(_, Handlebars, Presenter, tpl) {

  'use strict';

  var BasemapsView = Backbone.View.extend({

    el: '#basemaps-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click .maptype': '_setMaptype',
      'click .landsat-years li': '_setMaptype',
      'mouseover .landsat' : 'showLandsat',
      'mouseout .landsat' : 'hideLandsat'
    },

    initialize: function() {
      _.bindAll(this, 'selectMaptype');
      this.presenter = new Presenter(this);
      this.render();
      //Experiment
      this.presenter.initExperiment('source');
    },

    render: function(){
      this.$el.html(this.template());
      this.$maptypeslist = this.$el;
      this.$maptypes = this.$el.find('.maptype');
      this.$landsatYears = $('.landsat-years');
    },

    _setMaptype: function(e) {
      e && e.preventDefault();
      if (!$(e.target).hasClass('source') && !$(e.target).parent().hasClass('source')) {
        var $currentTarget = $(e.currentTarget);
        var maptype = $currentTarget.data('maptype');
        if (maptype) {
          this.presenter.setMaptype(maptype);
          ga('send', 'event', 'Map', 'Toggle', maptype);
        }
      }
    },

    /**
     * Add selected mapview to .maptype-selected
     * and close the widget.
     *
     * @param  {string} maptype
     */
    selectMaptype: function(maptype) {
      this.$maptypes.removeClass('selected');
      this.$maptypeslist.find('.' + maptype).addClass('selected');
    },

    showLandsat: function(){
      this.$landsatYears.addClass('active');
    },

    hideLandsat: function(){
      this.$landsatYears.removeClass('active');
    },



  });

  return BasemapsView;

});
