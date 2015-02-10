/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'map/presenters/LayersNavPresenter',
  'handlebars',
  'text!map/templates/layersNav.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    el: '.layers-menu',
    template: Handlebars.compile(tpl),

    events: {
      'click .layer': '_toggleLayer'
    },

    initialize: function() {
      _.bindAll(this, '_toggleSelected');
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
      //Experiment
      this.presenter.initExperiment('source');
    },


    /**
     * Used by LayersNavPresenter to toggle the class
     * name selected.
     *
     * @param  {object} layerSpec
     */
    _toggleSelected: function(layers) {
      // Toggle sublayers
      _.each(this.$el.find('.layer'), function(li) {
        var $li = $(li);
        var $toggle = $li.find('.onoffradio, .onoffswitch');
        var $toggleIcon = $toggle.find('span');
        var $layerTitle = $li.find('.layer-title');
        var layer = layers[$li.data('layer')];

        if (layer) {
          var isBaselayer = (layer.category_slug === 'forest_clearing');

          $li.addClass('selected');
          $toggle.addClass('checked');
          $layerTitle.css('color', layer.title_color);

          if (!isBaselayer) {
            $toggle.css('background', layer.title_color);
          } else {
            $toggle.css('border-color', layer.title_color);
            $toggleIcon.css('background-color', layer.title_color);
          }
          ga('send', 'event', 'Map', 'Toogle', 'Layer: ' + layer.slug);
        } else {
          $li.removeClass('selected');
          $toggle.removeClass('checked').css('background', '').css('border-color', '');
          $toggleIcon.css('background-color', '');
          $layerTitle.css('color', '');
        }
      });
    },

    /**
     * Handles a toggle layer change UI event by dispatching
     * to LayersNavPresenter.
     *
     * @param  {event} event Click event
     */
    _toggleLayer: function(event) {
      var layerSlug = $(event.currentTarget).data('layer'),
          fil_type = 'ifl_2013_deg';

      if ($(event.currentTarget).hasClass('ifl') || $(event.currentTarget).hasClass('c_f_peru')) {
        if ($(event.currentTarget).hasClass('c_f_peru')) {
          fil_type = 'concesiones_forestalesNS';
        }
        event && event.stopPropagation();
        var $elem = $(event.currentTarget);
        if ($elem.hasClass('selected')) {$elem.find('input').prop('checked',false);}
        else {$elem.find('[data-layer="' + fil_type + '"] input').prop('checked', true);}
        if ($elem.prop('tagName') !== 'LI'){
          for (var i=0;i < $elem.siblings().length; i++) {
            if ($($elem.siblings()[i]).hasClass('selected')) {
              this.presenter.toggleLayer($($elem.siblings()[i]).data('layer'));
            }
          }
          $elem.parents('li').data('layer' , $elem.data('layer')).addClass('selected');
        }
      }
      this.presenter.toggleLayer(layerSlug);
      ga('send', 'event', 'Map', 'Toogle', 'Layer: ' + layerSlug);
    },

  });

  return LayersNavView;

});
