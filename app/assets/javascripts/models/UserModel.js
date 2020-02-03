define([
 'backbone', 'underscore', 'bluebird'
], function(Backbone, _, Promise) {

  'use strict';

  var User = Backbone.Model.extend({

    urlRoot: window.gfw.config.GFW_API + '/user',

    setEmailIfEmpty: function(email) {
      if (_.isEmpty(this.get('email'))) {
        this.set('email', email);
      }
    },

    setLanguageIfEmpty: function(language) {
      if (_.isEmpty(this.get('language'))) {
        this.set('language', language);
      }
    },

    parse: function(response) {
      var attributes = {};

      if (response.data) {
        attributes = response.data.attributes;
        attributes.id = response.data.id;
      }

      return attributes;
    },

    sync: function(method, model, options) {
      options || (options = {});

      if (!options.crossDomain) {
        options.crossDomain = true;
      }

      if (!options.xhrFields) {
        options.xhrFields = {withCredentials:true};
      }

      return Backbone.sync.call(this, method, model, options);
    },

    getLanguage: function() {
      var userLanguage = this.get('language');
      var browserLang = navigator.language || navigator.userLanguage;
      browserLang = browserLang.replace('-', '_');

      if (!userLanguage) {
        if (browserLang.indexOf('_') !== -1) {
          var lang = browserLang.split('_');
          userLanguage = lang[0].toLowerCase() + '_' + lang[1].toUpperCase();
        } else {
          userLanguage = browserLang;
        }
      }

      return userLanguage;
    },

    checkLogged: function () {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: window.gfw.config.GFW_API + '/auth/check-logged',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          success: function (response) {
            resolve(response);
          },
          error: function (error) {
            reject(error);
          }
        });
      });
    },

  });

  return User;

});
