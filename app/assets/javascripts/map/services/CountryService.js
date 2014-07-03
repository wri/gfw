/**
 * CountryService provides access to information about countries.
 */
define([
  'nsa',
  'Class',
  'uri'
], function (nsa, Class, UriTemplate) {

  'use strict';

  var CountryService = Class.extend({
    
    _uriTemplate:'http://beta.gfw-apis.appspot.com/countries/{iso}',

    init: function() {
    },

    _getUrl: function(iso) {
      return new UriTemplate(this._uriTemplate).fillFromObject({iso: iso});
    },

    execute: function(iso, successCb, failureCb) {
      var url = this._getUrl(iso);

      nsa.spy(
        url,
        {},
        function(response) {
          successCb(response);
        },
        function(responseText, status, error) {
          failureCb(responseText, status, error);
        });
    }
  });

  var service = new CountryService();

  return service;
});