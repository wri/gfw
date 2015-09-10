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
      'click button' : '_setParams'
    },

    initialize: function() {
      _.bindAll(this, 'selectMaptype');
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function(){
      this.$el.html(this.template());
      this.$maptypeslist = this.$el;
      this.$maptypes = this.$el.find('.maptype');
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
      this.$maptypes.removeClass('selected');
      this.$maptypeslist.find('.' + maptype).addClass('selected');
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
      console.log(params)
      sessionStorage.setItem($objTarget.data('maptype'), params);
    }
  });

  return HighresolutionView;

});

