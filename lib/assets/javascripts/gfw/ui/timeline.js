gfw.ui.model.Timeline = Backbone.Model.extend({
  defaults: {
    hidden: true,
    baselayer: 'loss'
  }
});

gfw.ui.view.Timeline = cdb.core.View.extend({
  className: 'timeline_container',

  initialize: function() {
    this.model = new gfw.ui.model.Timeline();

    // Bindings
    this.model.on('change:baselayer', this._toggleBaselayer, this);
    this.model.on('change:coordinates', this._updateCoordinates, this);

    this.$container = this.options.container;

    this._initViews();

    this.render();
  },

  _initViews: function() {
    this.loss_timeline = new gfw.ui.view.TimelineLoss();
    this.addView(this.loss_timeline);

    this.forma_timeline = new gfw.ui.view.TimelineLoss();
    this.addView(this.forma_timeline);

    this.imazon_timeline = new gfw.ui.view.TimelineLoss();
    this.addView(this.imazon_timeline);

    this.modis_timeline = new gfw.ui.view.TimelineLoss();
    this.addView(this.modis_timeline);
  },

  _updateCoordinates: function() {

  },

  _toggleBaselayer: function() {
    var baselayer = this.model.get('baselayer');

    if (baselayer !== 'umd') {
      this.loss_timeline.hide();
    } else if (baselayer !== 'forma') {
      this.forma_timeline.hide();
    } else if (baselayer !== 'imazon') {
      this.imzon_timeline.hide();
    } else if (baselayer !== 'modis') {
      this.modis_timeline.hide();
    }
  }
});
