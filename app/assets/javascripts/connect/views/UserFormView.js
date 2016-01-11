define([
  'backbone', 'handlebars',
  'map/models/UserModel',
  'text!connect/templates/userForm.handlebars'
], function(Backbone, Handlebars, User, tpl) {

  'use strict';

  var UserFormView = Backbone.View.extend({
    className: 'user-form content-form',

    events: {
      'click #submit' : '_submit'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.user = new User();
      this.listenTo(this.user, 'sync', this.render);
      this.user.fetch();

      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        action: window.gfw.config.GFW_API_HOST+'/user',
        redirect: window.location.href,
        user: this.user.toJSON()
      }));
    },

    _submit: function() {
      var formValues = this.$('form').
        serializeArray().
        reduce(function(prev, curr) {
          prev[curr.name] = curr.value;
          return prev;
        }, {});

      this.user.set(formValues);
      this.user.save().then(this._redirect);
    },

    _redirect: function() {
                        var match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
        query  = window.location.search.substring(1),
        urlParams = {};

      while((match = search.exec(query)) !== null) {
        urlParams[decode(match[1])] = decode(match[2]);
      }

      if (urlParams.redirect !== undefined) {
        window.location.href = urlParams.redirect;
      }
    }
  });

  return UserFormView;

});
