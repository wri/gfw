define([
  'map/views/tabs/ShapefileUploadView',
  'text!map/templates/tabs/analysis_upload.handlebars'
], function(
  ShapefileUploadView,
  tpl
) {

  var AnalysisShapefileUploadView = ShapefileUploadView.extend({

    template: Handlebars.compile(tpl),

  });

  return AnalysisShapefileUploadView;

});