define([
 'backbone', 'moment', 'underscore'
], function(Backbone, moment, _) {

  'use strict';

  var Media = Backbone.Model.extend({

    defaults: {
      order: 0
    }

  });

  return Media;

});
