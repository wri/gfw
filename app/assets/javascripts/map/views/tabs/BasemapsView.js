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
      'click .landsat-years li': '_setMaptype'
    },

    initialize: function() {
      _.bindAll(this, 'selectMaptype');
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function(){
      this.$el.html(this.template());
      this.$maptypeslist = this.$el.find('.maptype-list');
      this.$maptypes = this.$el.find('.maptype');
    },

    _setMaptype: function(event) {
      var $currentTarget = $(event.currentTarget);
      var maptype = $currentTarget.data('maptype');
      if (maptype) {
        this.presenter.setMaptype(maptype);
        ga('send', 'event', 'Map', 'Toggle', maptype);
      }
    },

    /**
     * Add selected mapview to .maptype-selected
     * and close the widget.
     *
     * @param  {string} maptype
     */
    selectMaptype: function(maptype) {
      console.log(maptype);
      this.$maptypes.removeClass('selected');
      this.$maptypeslist.find('.' + maptype).addClass('selected');
    }
  });

  return BasemapsView;

});
