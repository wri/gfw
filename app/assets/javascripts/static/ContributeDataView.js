define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'validate',
  'jquery_fileupload',

], function($, Backbone, Handlebars, _, mps, validate, jquery_fileupload) {

  'use strict';

  var MAXFILESIZE = 2000000000;
  var TIMEOUT = 3600000;

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
    'data_uploaded': {
      presence: true
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
      'click .js-upload-file' : 'onClickFileUpload',
      'submit #new-contribution': 'onSubmitContribution',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.cache();
      this.listeners();
      this.setUploadField();
    },

    listeners: function() {
    },

    cache: function() {
      this.$form = this.$el.find('#new-contribution');
      this.$fieldsets = this.$el.find('.-js-fieldset');
      this.$fieldSubmit = this.$el.find('#submit');
      this.$fieldFileUpload = this.$el.find('#fileupload');
      this.$fieldFileUploaded = this.$el.find('#fileuploaded');
      this.$fieldFileName = this.$el.find('#fileupload-name');
      this.$fieldFileBtn = this.$el.find('#fileupload-btn');
    },

    setUploadField: function() {
      var that = this;

      this.$fieldFileUpload.fileupload({
        url: '/data/upload',
        dataType: 'json',
        autoUpload: true,
        maxFileSize: MAXFILESIZE, // 10 MB
        timeout: TIMEOUT,
      })

      .on('fileuploadadd', function (e, data) {
        console.log(data);
        _.each(data.files, function(file) {
          if (file && file.size > MAXFILESIZE) {
            mps.publish('Notification/open', ['notification-limit-exceed']);
            return;
          } else {
            // Set upload spinner
            that.$fieldFileBtn.find('.m-spinner').toggleClass('-start', true);
            // Set submit button
            that.$fieldSubmit.toggleClass('disabled', true);
            that.$fieldSubmit.prop('disabled', true);
            that.$fieldSubmit.val('Please wait...');
          }
        });
      })

      .on('fileuploaddone', function (e, data) {
        mps.publish('Notification/open', ['contribution-limit-exceed']);
        // Set 'data_uploaded' val and trigger the change
        that.$fieldFileUploaded.val(data.result.url).trigger("change");
        // Set upload spinner
        that.$fieldFileBtn.find('.m-spinner').toggleClass('-start', false);
        // Set name of file
        that.$fieldFileName.text(data.files[0].name);
        // Set submit button
        that.$fieldSubmit.toggleClass('disabled', false);
        that.$fieldSubmit.prop('disabled', false);
        that.$fieldSubmit.val('Submit data');

      })

      .on('fileuploadfail', function (e, data){
        mps.publish('Notification/open', ['notification-upload-error-server']);
        // Set 'data_uploaded' val and trigger the change
        that.$fieldFileUploaded.val(null);
        // Set upload spinner
        that.$fieldFileBtn.find('.m-spinner').toggleClass('-start', false);
        // Set name of file
        that.$fieldFileName.text('No file chosen');
        // Set submit button
        that.$fieldSubmit.toggleClass('disabled', false);
        that.$fieldSubmit.prop('disabled', false);
        that.$fieldSubmit.val('Submit data');
      });
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
      this.$form.find('[for]').removeClass('-error');
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
      var name = e.currentTarget.name,
          value = (e.currentTarget.value == 'on') ? true : e.currentTarget.value;

      this.validateInput(name, value);
      this.updateForm();
    },

    onClickFileUpload: function(e) {
      e && e.preventDefault();
      this.$fieldFileUpload.trigger('click');
    },

    onSubmitContribution: function(e) {
      e && e.preventDefault();
      var attributesFromForm = validate.collectFormValues(this.$form);

      if (this.validate(attributesFromForm)) {
        this.model.set(attributesFromForm).save()
          .then(function(){
            mps.publish('Notification/open', ['contribution-new-form-success']);
            $(document).scrollTop(0);
            setTimeout(function(){ window.location.reload(); }, 1000);
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
