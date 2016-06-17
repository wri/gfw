define([
 'backbone', 'moment', 'underscore'
], function(Backbone, moment, _) {

  'use strict';

  var Story = Backbone.Model.extend({
    urlRoot: window.gfw.config.GFW_API_HOST_V2 + '/story/',

    parse: function(response) {
      var attributes;
      if (response.data) {
        attributes = response.data.attributes;
      } else {
        attributes = response.attributes;
      }

      attributes.id = response.id;

      return attributes;
    },

    formattedDate: function() {
      var date = moment(this.get('date'));
      return date.format('MMMM DD, YYYY');
    },

    hasLocation: function() {
      return _.isNumber(this.get('lat')) && _.isNumber(this.get('lng'));
    }
  });

  return Story;

});
