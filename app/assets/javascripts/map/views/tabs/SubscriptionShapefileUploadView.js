define([
  'map/views/tabs/ShapefileUploadView',
  'text!map/templates/tabs/subscription_upload.handlebars'
], function(
  ShapefileUploadView,
  tpl
) {

  var SubscriptionShapefileUploadView = ShapefileUploadView.extend({

    template: Handlebars.compile(tpl),

  });

  return SubscriptionShapefileUploadView;

});
