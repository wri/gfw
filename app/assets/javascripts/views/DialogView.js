define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  'use strict';

  var ModalView = Backbone.View.extend({

    events: {
      'click #closeBtn': 'remove',
      'click .m-modal-background': 'remove'
    },

    initialize: function() {
      _.bindAll(this, '_onKeyup');
      $(document).keyup(this._onKeyup);
    },

    render: function() {
    },

    remove: function() {
    },

    /**
     * Triggered by a keyup event. Hide the modal
     * if the user clicks esc.
     *
     * @param  {Object} e Event
     */
    _onKeyup: function(e) {
      if (e.keyCode === 27) {
        this.remove();
      }
    },

  });

  return ModalView;

});
