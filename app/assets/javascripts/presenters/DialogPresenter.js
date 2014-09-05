define([
  'underscore',
  'Class',
  'mps',
  'helpers/dialogsHelper'
], function(_, Class, mps, dialogsHelper) {
  'use strict';

  var DialogPresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Dialog/new', _.bind(function(data) {
        if (!_.isObject(data)) {
          throw 'No dialog found';
        }

        this._newResource(data);
      }, this));
    },

    /**
     * Dispaches to the view to render the dialog from a
     * suplied valid resource.
     * eg. resource:
     *   {type: 'layer', id: 'forestgain'}
     *
     * @param  {Object} resource Resource identificator
     */
    _newResource: function(data) {
      var resource = {};
      var data;

      if (dialogsHelper[data.type] && dialogsHelper[data.type][data.id]) {
        resource = dialogsHelper[data.type][data.id];
      } else {
        return;
      }

      this.view.render(resource);
    }
  });

  return DialogPresenter;
});
