App.Views.ImazonLayer = App.Views.CartodbLayer.extend({

  initialize: function() {
    this.layerName = "imazon";
    this.url = 'dyynnn89u7nkm.cloudfront.net';
    this.table = 'imazon_clean2';
    this.global_version = 6;

    App.Views.ImazonLayer.__super__.initialize.apply(this);
    app.views.imazonTimeline = this.timeline = new App.Views.ImazonTimeline();
  }

});