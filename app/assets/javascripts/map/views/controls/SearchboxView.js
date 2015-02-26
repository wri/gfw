/**
 * The Searchbox module.
 *
 * @return searchbox class (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'handlebars',
  'keymaster',
  'map/presenters/controls/SearchboxPresenter',
  'text!map/templates/controls/searchbox.handlebars'
], function(_, Backbone, Handlebars, keymaster, Presenter, tpl) {

  'use strict';

  var SearchboxModel = Backbone.Model.extend({
    defaults:{
      hidden: true
    }
  });




  var Searchbox = Backbone.View.extend({

    el: '#control-searchbox',

    template: Handlebars.compile(tpl),

    initialize: function(map) {
      this.map = map;
      this.model = new SearchboxModel();
      this.presenter = new Presenter(this);
      _.bindAll(this, 'setAutocomplete', 'onPlaceSelected');

      this.render();
      //cacheVars
      this.$input = this.$el.find('input');

      this.setListeners();
      this.setAutocomplete();

    },

    setListeners: function(){
      this.$input.on('keyup', _.bind(function(e){
        if (e.keyCode === 27) {
          this.model.set('hidden', false);
          this.toggleSearch();
        }
      }, this ));

      google.maps.event.addListener(this.map, 'click',_.bind(function() {
        this.model.set('hidden', false);
        this.toggleSearch();
      }, this));
    },

    render: function(){
      this.$el.html(this.template);
    },

    toggleSearch: function(){
      var hidden = this.model.get('hidden');
      if (hidden) {
        this.$el.show(0);
        this.$input.focus();
        this.model.set('hidden', false);
        setTimeout(_.bind(function(){
          this.$input.val('');
        }, this),1);
      }else{
        this.$el.hide(0);
        this.$input.blur();
        this.model.set('hidden', true);
      }
    },

    setAutocomplete: function() {
      this.autocomplete = new google.maps.places.SearchBox(this.$input[0]);
      google.maps.event.addListener(this.autocomplete, 'places_changed', this.onPlaceSelected);
    },

    onPlaceSelected: function() {
      var place = this.autocomplete.getPlaces();
      if (place.length == 1) {
        place = place[0];
        if (place && place.geometry && place.geometry.viewport) {
          this.presenter.fitBounds(place.geometry.viewport);
        }
        if (place && place.geometry && place.geometry.location && !place.geometry.viewport) {
          var index = [];
          for (var x in place.geometry.location) {
             index.push(x);
          }
          this.presenter.setCenter(place.geometry.location[index[0]],place.geometry.location[index[1]]);
        }
        this.model.set('hidden', false);
        this.toggleSearch();
      };
      ga('send', 'event', 'Map', 'Searchbox', 'Find location');
    }

  });

  return Searchbox;
});
