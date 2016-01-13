define([
  'backbone', 'handlebars', 'mps',
  'map/models/UserModel',
  'text!connect/templates/userForm.handlebars'
], function(Backbone, Handlebars, mps, User, tpl) {

  'use strict';

  var UserFormView = Backbone.View.extend({
    className: 'user-form content-form',

    events: {
      'click #submit' : '_submit',
      'click #skip': '_redirect'
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

      this._renderSelectedOptions();
    },

    _renderSelectedOptions: function() {
      var selectFields = ['sector', 'job', 'country', 'use'],
          attributes = this.user.toJSON();

      selectFields.forEach(function(field) {
        var $select = this.$('select[name="'+field+'"]');
        $select.val(attributes[field]);
      }.bind(this));

      this.$('input[value="' + attributes.sign_up + '"]').
        prop('checked', true);
    },

    _submit: function() {
      var formValues = this.$('form').
        serializeArray().
        reduce(function(prev, curr) {
          if (prev[curr.name] !== undefined) {
            prev[curr.name] = [].concat(prev[curr.name]);
            prev[curr.name].push(curr.value);
          } else {
            prev[curr.name] = curr.value;
          }
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
      } else {
        mps.publish('Notification/open', ['my-gfw-profile-saved']);
        window.scrollTo(0,0);
      }
    }
  });

  return UserFormView;

});
