define([
  'underscore',
  'Class',
  'mps',
  'map/helpers/layersHelper'
], function(_, Class, mps, layersHelper) {

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
      mps.subscribe('Dialog/new', _.bind(function(resource) {
        if (!_.isObject(resource)) {
          throw 'No resource found for the dialog';
        }

        this._newResource(resource);
      }, this));
    },

    /**
     * Dispaches to the view to render the dialog from a
     * suplied valid resource.
     * eg. resource:
     *   {type: 'layer', slug: 'forestgain'}
     *
     * @param  {Object} resource Resource identificator
     */
    _newResource: function(resource) {
      var resourceTpl;

      if (resource.type == 'layer') {
        resourceTpl = layersHelper[resource.slug].dialogTpl;
      }

      if (resourceTpl) {
        this.view.render(resourceTpl);
      }
    }
  });

  return DialogPresenter;
});
