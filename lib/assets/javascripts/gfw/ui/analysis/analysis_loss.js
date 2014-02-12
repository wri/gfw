gfw.ui.view.AnalysisLoss = gfw.ui.view.Widget.extend({
  className: 'analysis_info',

  events: {

  },

  defaults: {

  },

  initialize: function() {
    this._initSubscribes();
  },

  _initSubscribes: function() {
    subscribe('timeline:change_date_loss', _.bind(function(start_year, end_year) {
      this.start = start_year;
      this.end = end_year;

      var url = Timeline.getAlertCount();

      console.log(url);
    }, this));
  },

  show: function() {

  },

  hide: function() {

  },

  render: function() {
    var that = this;

    this.$el.html(this.template.render( options ));

    this.$content     = this.$el.find(".content");
    this.$info_title  = this.$el.find(".info_title");
    this.$title       = this.$el.find(".info .titles .title");
    this.$dataset     = this.$el.find(".alert .title");
    this.$shadow      = this.$el.find(".shadow");
    this.$alert_count = this.$el.find("#alerts-count");
    this.$subtitle    = this.$el.find(".subtitle");

    this.downloadDropdown = new gfw.ui.view.DownloadDropdown({
      model: this.model,
      downloadEl: this.$el.find('.download')
    });

    this.$el.append(this.downloadDropdown.render());

    return this.$el;
  }
});
