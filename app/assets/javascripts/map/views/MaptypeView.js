/**
 * The MaptypeView selector view.
 *
 * @return MaptypeView instance (extends Backbone.View).
 */
define([
  'underscore',
  'views/Widget',
  'presenters/MaptypePresenter',
  'handlebars',
  'text!templates/maptype.handlebars'
], function(_, Widget, Presenter, Handlebars, tpl) {

  'use strict';

  var MaptypeView = Widget.extend({

    className: 'widget widget-maptype',

    template: Handlebars.compile(tpl),

    events: function(){
      return _.extend({}, MaptypeView.__super__.events, {
        'click .maptype-selected li': '_toggleBoxClosed',
        'click .widget-opened .maptype-list li': '_setMaptype',
        'click .landsat_years li': '_setMaptype'
      });
    },

    initialize: function() {
      _.bindAll(this, 'selectMaptype');
      this.presenter = new Presenter(this);
      MaptypeView.__super__.initialize.apply(this);
    },

    _setMaptype: function(event) {
      var landsat_list = this.$el.find('.landsat_years');
      var $currentTarget = $(event.currentTarget);
      if (landsat_list.is(':visible')) landsat_list.fadeOut();
      if ($currentTarget.hasClass('landsatSelector')) {
        landsat_list.fadeIn();
        return;
      }
      var maptype = $currentTarget.data('maptype');
      if (maptype) {
        this.presenter.setMaptype(maptype);
      }
    },

    /**
     * Add selected mapview to .maptype-selected
     * and close the widget.
     *
     * @param  {string} maptype
     */
    selectMaptype: function(maptype) {
      if (maptype.indexOf('landsat') === 0) maptype = 'landsat';
      this.$el.find('.maptype-selected').html(
        this.$widgetOpened.find('[data-maptype="' + maptype + '"]').clone());

      this.model.set('boxClosed', true);
    }
  });

  return MaptypeView;

});
