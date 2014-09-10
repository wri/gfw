define([
  'views/dialogs/AnalysisSubscribeDialogView',
  'text!templates/dialogs/analysis_subscribe.handlebars'
], function(AnalysisSubscribeDialogView, analysisSubscribeTpl) {

  'use strict';

  var dialogsHelper = {
    analysis: {
      subscribe: {
        view: AnalysisSubscribeDialogView
      }
    }
  };

  return dialogsHelper;

});
