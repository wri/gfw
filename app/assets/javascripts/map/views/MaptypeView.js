/**
 * The MaptypeView selector view.
 *
 * @return MaptypeView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'map/views/Widget',
  'map/presenters/MaptypePresenter',
  'text!map/templates/maptype.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var MaptypeView = Widget.extend({

    className: 'widget widget-maptype',

    template: Handlebars.compile(tpl),

    events: function(){
      return _.extend({}, MaptypeView.__super__.events, {
        'click .maptype-selected li': '_toggleBoxClosed',
        'click .widget-opened .maptype': '_setMaptype',
        'click .landsatSelector': '_toggleLandsatDropdown',
        'click .landsat-years li': '_setMaptype'
      });
    },

    initialize: function() {
      _.bindAll(this, 'selectMaptype');
      this.presenter = new Presenter(this);
      MaptypeView.__super__.initialize.apply(this);
    },

    _setMaptype: function(event) {
      var $currentTarget = $(event.currentTarget);
      var maptype = $currentTarget.data('maptype');

      if (maptype) {
        this.presenter.setMaptype(maptype);
        ga('send', 'event', 'Map', 'Toggle', maptype);
      }
    },

    _cacheSelector: function() {
      MaptypeView.__super__._cacheSelector.apply(this);
      this.$landsatYears = this.$el.find('.landsat-years');
    },

    _toggleBoxClosed: function() {
      MaptypeView.__super__._toggleBoxClosed.apply(this);
      this.$landsatYears.addClass('hidden');
    },

    _toggleLandsatDropdown: function() {
      this.$landsatYears.toggleClass('hidden');
    },

    /**
     * Add selected mapview to .maptype-selected
     * and close the widget.
     *
     * @param  {string} maptype
     */
    selectMaptype: function(maptype) {
      var html = this.$widgetOpened.find('[data-maptype="{0}"]'.format(maptype)).clone();
      this.$el.find('.maptype-selected').html(html);
      this.model.set('boxClosed', true);
    }
  });

  return MaptypeView;

});
