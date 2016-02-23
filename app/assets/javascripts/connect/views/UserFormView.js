define([
  'Class', 'backbone', 'underscore', 'handlebars', 'mps',
  'map/models/UserModel',
  'text!connect/templates/userForm.handlebars'
], function(Class, Backbone, _, Handlebars, mps, User, tpl) {

  'use strict';

  var UserFormValidator = Class.extend({
    validations: {
      sign_up: {
        message: 'Please enter your email to sign up as an official tester',
        validator: function(user) {
          return !(user.get('sign_up') === 'yes' && _.isEmpty(user.get('email')));
        }
      }
    },

    messages: {},

    isValid: function(user) {
      this.messages = {};

      _.each(this.validations, function(attribute, attributeName) {
        if (attribute.validator(user) === false) {
          this.messages[attributeName] = attribute.message;
        }
      }.bind(this));

      return _.isEmpty(this.messages);
    }
  });

  var UserFormView = Backbone.View.extend({
    className: 'my-gfw-profile-form content-form',

    events: {
      'change select': '_handleSelectChange',
      'change input': '_handleInputChange',
      'click #submit': '_submit'
    },

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      options = options || {};
      this.isModal = options.isModal;

      this.user = new User();
      this.listenTo(this.user, 'sync', this.render);
      this.user.fetch();

      this.validator = new UserFormValidator();

      this.render();
    },

    render: function() {
      this.$el.html(this.template({
        action: window.gfw.config.GFW_API_HOST+'/user',
        redirect: window.location.href,
        user: this.user.toJSON(),
        errors: this.validator.messages,
        isModal: this.isModal
      }));

      this._renderSelectedOptions();
    },

    _renderSelectedOptions: function() {
      var selectFields = ['sector', 'job', 'country', 'use'],
          attributes = this.user.toJSON();

      selectFields.forEach(function(field) {
        var $select = this.$('select[name="'+field+'"]');

        if (!_.isEmpty(attributes[field])) {
          $select.val(attributes[field]);

          var selected = $select.val() || [];
          if (selected.indexOf('Other') > -1) {
            var $input = $select.siblings('input');
            $input.show();
            $input.val(_.last(attributes[field]));
          }
        }
      }.bind(this));

      this.$('input[value="' + attributes.sign_up + '"]').
        prop('checked', true);
    },

    _enableSubmit: function() {
      this.$('#submit').removeClass('disabled');
    },

    _handleInputChange: function(event) {
      this._enableSubmit();
    },

    _handleSelectChange: function(event) {
      this._enableSubmit();

      var $el = this.$(event.currentTarget),
          $input = $el.siblings('input');

      var selected = $el.val() || [];
      if (selected.indexOf('Other') > -1) {
        $input.show();
      } else {
        $input.hide();
        $input.val('');
      }
    },

    _submit: function() {
      this.$('#submit').hide();
      this.$('.profile-loading').show();

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
      if (this.validator.isValid(this.user)) {
        this.user.save().then(this._redirect.bind(this));
      } else {
        this.render();
        mps.publish('Notification/open', ['my-gfw-profile-errors']);
        window.location.hash = 'user-profile';
      }
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
        this.trigger('saved');
        window.scrollTo(0,0);
      }
    }
  });

  return UserFormView;

});
