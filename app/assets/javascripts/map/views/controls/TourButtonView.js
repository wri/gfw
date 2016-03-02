/**
 * The TourButtonView module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'handlebars',
  'map/presenters/controls/TourButtonPresenter',
  'text!map/templates/controls/tour-button.handlebars'
], function(_, Backbone, Handlebars, Presenter, tpl) {

  'use strict';

  var TourButtonView = Backbone.View.extend({

    el: 'body',

    template: Handlebars.compile(tpl),

    events: {
      'click #guide-tour-button' : 'initTour'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
      this.cache();
    },

    cache: function() {
      this.$button = this.$el.find('#guide-tour-button');
    },

    initTour: function(e) {
      var tour = $(e.currentTarget).data('tour');
      this.presenter.initTour(tour);
    },

    pulse: function() {
      this.$button.addClass('is-pulse');
      setTimeout(function(){
        this.$button.removeClass('is-pulse');
      }.bind(this),3000);      
    }


  });

  return TourButtonView;
});
