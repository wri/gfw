define([
 'backbone'
], function(Backbone) {

  'use strict';

  var getCookie = function(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) { return parts.pop().split(';').shift(); }
  };

  var User = Backbone.Model.extend({
    url: window.gfw.config.GFW_API_HOST + '/user',

    loadFromCookie: function() {
      var authCookie = getCookie('_eauth');

      if (authCookie !== undefined) {
        this.set('cookie', authCookie);
        this.fetch({ xhrFields: { withCredentials: true } });
      }
    }
  });

  return User;

});
