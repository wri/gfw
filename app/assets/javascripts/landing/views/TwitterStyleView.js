define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  'use strict';

  var TwitterStyleView = Backbone.View.extend({

    el: '.mod-tweets',

    /**
     * Init
     */
    initialize: function() {
      this.iframe = this.$el.find('iframe').contents().find('head');

      var css = '<style type="text/css">' +
                'body,span{color:#555!important;}' +
                'span.p-nickname{ color: #AAA !important;}' +
                '.cards-base p,.cards-base p a{color:#999!important;}'+
                'a.customisable{color:#97bd3d!important;}'+
                'a.expand.customisable-highlight:hover,a.expand.customisable-highlight:focus{color:#97bd3d!important;}'+
                '.thm-dark a:hover .ic-mask, .thm-dark a:focus .ic-mask{background-color:transparent!important;}'+
                '.tweet .e-entry-title{color:#555!important;font-size:13px !important;}' +
                '.tweet .e-entry-title a{color:#97bd3d!important;}' +
                'button.load-more{color:#97bd3d!important;border:none !important;background:none !important;box-shadow:none !important;}' +
                 window.streamStyle +
                '</style>';

      this.iframe.append(css);
    }

  });

  return TwitterStyleView;

});
