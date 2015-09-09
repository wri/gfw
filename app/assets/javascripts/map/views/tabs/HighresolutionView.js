/**
 * The BasemapsView selector view.
 *
 * @return BasemapsView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'map/presenters/tabs/BasemapsPresenter',
  'text!map/templates/tabs/Highresolution.handlebars'
], function(_, Handlebars, enquire, Presenter, tpl) {

  'use strict';

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click .maptype': '_setMaptype',
      'click .landsat-years li': '_setMaptype',
      'click .landsatSelector' : 'toggleLandsat',
      'mouseover .landsat' : 'showLandsat',
      'mouseout .landsat' : 'hideLandsat'
    },

    initialize: function() {
      _.bindAll(this, 'selectMaptype');
      this.presenter = new Presenter(this);
      this.render();
      //Experiment
      //this.presenter.initExperiment('source');
      this.cartoAttribution =  'Map tiles by <a href="http://cartodb.com/attributions#Highresolution">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.';
    },

    render: function(){
      this.$el.html(this.template());
      this.$maptypeslist = this.$el;
      this.$maptypes = this.$el.find('.maptype');
      this.$landsatYears = $('.landsat-years');
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = false;
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = true;
        },this)
      });

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
      // if (maptype == 'positron' || maptype == 'dark') {
      //   console.log(this.cartoAttribution);
      //   // debugger;
      //   var self = this;
      //   setTimeout(_.bind(function() {
      //     $('#map').find('.gmnoprint span').ready(function(){
      //       debugger
      //       $(this).addClass('showimportant').html(self.cartoAttribution)
      //     });
      //   }, self ), 2000);
      // }
      this.$maptypes.removeClass('selected');
      this.$maptypeslist.find('.' + maptype).addClass('selected');
    },

    showLandsat: function(){
      if (!this.mobile) {
        this.$landsatYears.addClass('active');
      }
    },

    hideLandsat: function(){
      if (!this.mobile) {
        this.$landsatYears.removeClass('active');
      }
    },

    toggleLandsat: function(){
      if (this.mobile) {
        this.$landsatYears.toggleClass('active');
      }
    }



  });

  return HighresolutionView;

});

