/**
 * The Feed view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'mps',
  'countries/helpers/CountryHelper',
  'countries/views/CountryShareDialogView',
  'text!countries/templates/shareCountries.handlebars',
  'text!countries/templates/shareCountriesLittle.handlebars',


], function($, Backbone, _, Handlebars, d3, mps, CountryHelper, CountryShareDialogView, shareTPL, shareLittleTPL) {

  'use strict';


  var CountryShareModel = Backbone.Model.extend({
    defaults: {
      tooltip: $('body').hasClass('home') ? "Share this map view" : "Share this graphic"
    }
  });



  var CountryShareView = Backbone.View.extend({
    className: 'share',

    templates: {
      templateShare: Handlebars.compile(shareTPL),
      templateShareLittle: Handlebars.compile(shareLittleTPL),
    },

    events: {
      'click a' : '_openShare'
    },


    initialize: function(options) {
      _.bindAll( this, '_toggle' );
      this.model = new CountryShareModel();

      this.model.on('change:hidden', this._toggle);

      this.options = options;
      if (this.options && this.options.template) {
        this.template = this.templates[this.options.template];
      } else {
        this.template = this.templateShareLittle;
      }
      this._initViews();
    },

    _initViews: function() {
      this.share = new CountryShareDialogView({
        bitly: {
          // key: "<%= ENV['BITLY_API_KEY'] %>",
          key: "aspdfiouapsodiufapoisduf",
          login: 'vizzuality'
        }
      });

      $('body').append(this.share.render());
    },

    _openShare: function(e) {
      e.preventDefault();
      $(e.target).closest('section').addClass('current_share');
      this.share.show();
    },

    _toggle: function() {
      if (this.model.get('hidden')) {
        this.$el.hide();
      } else {
        this.$el.show();
        ga('send', 'event', 'Country show', 'Info', 'Open Share');
      }
    },

    show: function() {
      this.model.set('hidden', false);
    },

    hide: function() {
      this.model.set('hidden', true);
    },

    render: function() {
      var that = this;
      this.$el.append(this.template( this.model.toJSON() ));
      this.$analysis_control = (this.$el.find('.analysis_control').length > 0) ? this.$el.find('.analysis_control') : null;
      if (!!this.$analysis_control) {
        $(this.$analysis_control).tipsy({ title: 'data-tip', fade: true, gravity: 'w' });
      }

      return this.$el;
    }

  });
  return CountryShareView;

});
