define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'helpers/dialogsHelper'
], function(_, mps, PresenterClass, dialogsHelper) {
  'use strict';

  var DialogPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Dialog/new': function(data, params) {
        if (!_.isObject(data)) {
          throw 'No dialog found';
        }

        this._newResource(data, params);
      }
    }],

    /**
     * Dispaches to the view to render the dialog from a
     * suplied valid resource.
     * eg. resource:
     *   {type: 'layer', id: 'forestgain'}
     *
     * @param  {Object} resource Resource identificator
     */
    _newResource: function(data, params) {
      var resource = {};
      var data;

      if (dialogsHelper[data.type] && dialogsHelper[data.type][data.id]) {
        resource = dialogsHelper[data.type][data.id];
      } else {
        return;
      }

      this.view.render(resource, params);
    }
  });

  return DialogPresenter;
});
