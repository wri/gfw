define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'validate',

], function($, Backbone, Handlebars, _, mps, validate) {

  'use strict';

  var constraints = {
    'data_format': {
      presence: true,
    },
    'data_show': {
      presence: true,
    },
    'data_email': {
      presence: true,
      email: true,
    },
    'data_agree': {
      presence: true,
      inclusion: {
        within: [true],
      }
    },
    'data_terms': {
      presence: true,
      inclusion: {
        within: [true],
      }
    },
    'metadata_title': {
      presence: true
    },
    'metadata_function': {
      presence: true
    },
    'metadata_geographic_coverage': {
      presence: true
    },
    'metadata_source': {
      presence: true
    },
    'metadata_date_of_content': {
      presence: true
    },
    'metadata_cautions': {
      presence: true
    },
  };


  var ContributeDataView = Backbone.View.extend({
    el: '#contributeDataView',

    model: new (Backbone.Model.extend({
      urlRoot: window.gfw.config.GFW_API_HOST_NEW_API + '/contribution-data/',
    })),

    events: {
      'change .js-radio-fieldset' : 'onChangeFieldset',
      'change input,textarea,select' : 'onChangeInput',
      'submit #new-contribution': 'onSubmitContribution',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.cache();
      this.listeners();
    },

    listeners: function() {
    },

    cache: function() {
      this.$form = this.$el.find('#new-contribution');
      this.$fieldsets = this.$el.find('.-js-fieldset');
    },

    /**
     * VALIDATIONS && FORM UPDATE
     * - validate
     * - validateInput
     */
    validate: function(attributesFromForm) {
      // Validate form, if is valid the response will be undefined
      this.errors = validate(attributesFromForm, constraints);
      return ! !!this.errors;
    },

    // TO-DO: validate checkbox
    validateInput: function(name, value) {
      let errors = validate.single(value, constraints[name]);
      if (!!errors) {
        this.errors[name] = errors[0];
      } else {
        this.errors && this.errors[name] && delete this.errors[name];
      }
    },

    updateForm: function() {
      this.$form.find('input, textarea, select').removeClass('-error');
      this.$form.find('label').removeClass('-error');
      for (var key in this.errors) {
        var $input = this.$form.find('[name='+key+']');
        var $label = this.$form.find('[for='+key+']');
        $input.addClass('-error');
        $label.addClass('-error');
      }
    },

    /**
     * UI EVENTS
     * - onChangeFieldset
     * - onChangeInput
     * - onSubmitContribution
     */
    onChangeFieldset: function(e) {
      var fieldset = this.$form.find('input[name="data_show"]:checked').data('fieldset');
      this.$fieldsets.toggleClass('-active', false);
      this.$fieldsets.filter('#fieldset-'+fieldset).toggleClass('-active', true);
    },

    onChangeInput: function(e) {
      this.validateInput(e.currentTarget.name, e.currentTarget.value);
      this.updateForm();
    },

    onSubmitContribution: function(e) {
      e && e.preventDefault();
      var attributesFromForm = validate.collectFormValues(this.$form);

      if (this.validate(attributesFromForm)) {
        this.model.set(attributesFromForm).save()
          .then(function(){
            mps.publish('Notification/open', ['contribution-new-form-success']);
          })
          .fail(function(){
            mps.publish('Notification/open', ['contribution-new-form-error']);
          })

      } else {
        this.updateForm();
        mps.publish('Notification/open', ['contribution-new-form-error']);
        $(document).scrollTop(0);
      }
    }
  });

  return ContributeDataView;

});
