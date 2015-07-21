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

    events: {
      'click' : 'onClick',
      'click .searching-kinds' : '_setType'
    },

    initialize: function(map) {
      this.map = map;
      this.model = new SearchboxModel();
      this.presenter = new Presenter(this);
      _.bindAll(this, 'setAutocomplete', 'onPlaceSelected');

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


      this.render();
      //cacheVars
      this.$input = this.$el.find('input');

      this.setListeners();
      this.setAutocomplete();

    },

    checkSearchType: function(address) {
      if (this.$searchbox.hasClass('blocked')) return;
      var isLatLong = function(address) {
        return (address.includes("º") || address.includes("°")) && (address.includes("'") || address.contains("′")) && (address.includes("W") || address.includes("E")) && (address.includes("N") || address.includes("S"));
      }
      var isDegrees = function(address) {
        if (address.contains('º'))
          address = address.replace(/º/g,'');
        if (address.contains('°'))
          address = address.replace(/°/g,'');
        if (address.contains(","))
          address = address.split(",");
        else
          address = address.split(" ");
        if (!!address && address.length != 2) return false;
        if (!(~~address[0] != 0 && ~~address[1] != 0)) return false; //avoid mistakes with coordinates, degrees have no letters, so everything must be numbers ~~NaN will be 0

        var degrees = new Uint8Array(new ArrayBuffer(2));
        var aux = new Array(2);
        aux = address[0].split('.');
        degrees[0] = Math.abs(aux[0]);
        aux = address[1].split('.');
        degrees[1] = Math.abs(aux[0]);
        if (degrees[0] <= 90 && degrees[1] <= 180) {
          return true;
        }
        return false;
      }
      if (isLatLong(address)) {
        //user typed a latitude and longitude coordinates
        this._setType(null,"coordinates");
      } else if (isDegrees(address)) {
        //user typed a degrees coordinates
        this._setType(null,"degrees");
      } else {
        //user typed a regular address
        this._setType(null,"regular");
      }
    },

    _latLongToDecimal: function(address) {
      var degrees = address || this.$searchbox.find('.degrees input').val();
      if (degrees.contains(","))
        degrees = degrees.split(",");
      else if (degrees.contains("E "))
        degrees = degrees.split("E ");
      else if (degrees.contains("W "))
        degrees = degrees.split("W ");
      else
        degrees = degrees.split(" ");
      return this._parseDMS(degrees[0]) + ', ' + this._parseDMS(degrees[1]);
    },

    _setType: function(e, kind) {
      this.$searchbox.addClass('blocked');
      if (!!e && ! !!kind) {
        var $target = $(e.target);
        if ($target.hasClass('selected')) return;
        this.$searchbox.find('.search.selected').removeClass('selected');

        $(e.target).parent().find('.selected').removeClass('selected');
        $target.addClass('selected').focus();
        this.$searchbox.find('.search.'+$target.data('kind')).addClass('selected');
        $target = null;
      } else if (typeof(kind) === "string") {
        if (this.$searchbox.find('.search.'+kind).hasClass('selected')) return;
        var $prevInput = this.$searchbox.find('.search.selected input');
        this.$searchbox.find('.search.'+kind+' input').val($prevInput.val());
        $prevInput.val('');
        $prevInput = null;

        this.$searchbox.find('.search.selected').removeClass('selected');
        this.$searchbox.find('.search.'+kind).addClass('selected').focus();
        this.$searchbox.find('.kind').removeClass('selected');
        this.$searchbox.find('*[data-kind="' + kind + '"]').addClass('selected');
      }
    },

    _parseDMS: function(dmsStr) {
      // check for signed decimal degrees without NSEW, if so return it directly
      if (typeof dmsStr == 'number' && isFinite(dmsStr)) return Number(dmsStr);

      // strip off any sign or compass dir'n & split out separate d/m/s
      var dms = String(dmsStr).trim().replace(/^-/, '').replace(/[NSEW]$/i, '').split(/[^0-9.,]+/);
      if (dms[dms.length-1]=='') dms.splice(dms.length-1);  // from trailing symbol

      if (dms == '') return NaN;

      // and convert to decimal degrees...
      var deg;
      switch (dms.length) {
          case 3:  // interpret 3-part result as d/m/s
              deg = dms[0]/1 + dms[1]/60 + dms[2]/3600;
              break;
          case 2:  // interpret 2-part result as d/m
              deg = dms[0]/1 + dms[1]/60;
              break;
          case 1:  // just d (possibly decimal) or non-separated dddmmss
              deg = dms[0];
              // check for fixed-width unseparated format eg 0033709W
              //if (/[NS]/i.test(dmsStr)) deg = '0' + deg;  // - normalise N/S to 3-digit degrees
              //if (/[0-9]{7}/.test(deg)) deg = deg.slice(0,3)/1 + deg.slice(3,5)/60 + deg.slice(5)/3600;
              break;
          default:
              return NaN;
      }
      if (/^-|[WS]$/i.test(dmsStr.trim())) deg = -deg; // take '-', west and south as -ve

      return Number(deg);
    },

    setListeners: function() {
      this.$input.on('keyup', _.bind(function(e){
        if (e.keyCode === 27) {
          this.model.set('hidden', false);
          this.toggleSearch();
        } else if (e.keyCode === 13) {
          var geom = [0,0];
          if (this.$searchbox.find('.search.selected').hasClass('degrees')) {
            geom = this.$searchbox.find('.search.selected input').val();
            if (geom.contains('º'))
              geom = geom.replace(/º/g,'');
            if (geom.contains('°'))
              geom = geom.replace(/°/g,'');
            if (geom.contains(","))
              geom = geom.split(",");
            else
              geom = geom.split(" ");
            this.presenter.setCenter(geom[0],geom[1]);
            geom = null;
            this.toggleSearch();
          } else if (this.$searchbox.find('.search.selected').hasClass('coordinates')) {
            geom = this._latLongToDecimal(this.$searchbox.find('.coordinates input').val());
            if (! !!geom) {
              this.$input[0] = this.$searchbox.find('.search input').val();
              mps.publish('Notification/open', ['coordinates-not-standard']);
              this._setType(null,"regular");
              return;
            }
            geom = geom.split(",");
            this.presenter.setCenter(geom[1],geom[0]);
          }
          geom = null;
          this.toggleSearch();
        } else {
          if (! !! e.target.value) return;
          this.checkSearchType(e.target.value);
        }
      }, this ));

      google.maps.event.addListener(this.map, 'click',_.bind(function() {
        this.model.set('hidden', false);
        this.toggleSearch();
      }, this));
    },

    render: function() {
      this.$el.html(this.template);
      this.$searchbox = $('.search-box');
    },

    onClick: function(e) {
      if ($(e.target).hasClass('control-searchbox')) {
        this.model.set('hidden', false);
        this.toggleSearch();
      }
    },

    toggleSearch: function() {
      var hidden = this.model.get('hidden');
      if (hidden) {
        // This is for android keyboard. It pushes all content up, we want to prevent it
        if (this.mobile) {
          $('html,body').height($(window).height());
        }
        this.$el.show(0);
        this.$input.focus();
        this.model.set('hidden', false);
        setTimeout(_.bind(function(){
          this.$input.val('');
        }, this),1);
      }else{
        // This is for android keyboard. It pushes all content up, we want to prevent it
        if (this.mobile) {
          $('html,body').height('100%');
        }
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
