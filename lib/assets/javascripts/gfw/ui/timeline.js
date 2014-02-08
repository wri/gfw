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
    this.model.on('change:hidden', this._toggle, this);
    this.model.on('change:baselayer', this._toggleBaselayer, this);
    this.model.on('change:coordinates', this._updateCoordinates, this);

    this.$container = this.options.container;

    this._initViews();

    this.render();
  },

  _initViews: function() {
    this.loss_timeline = new gfw.ui.view.TimelineLoss({ container: this.$el });
    this.loss_timeline.show();

    this.forma_timeline = new gfw.ui.view.TimelineLoss({ container: this.$el });

    this.imazon_timeline = new gfw.ui.view.TimelineLoss({ container: this.$el });

    this.modis_timeline = new gfw.ui.view.TimelineLoss({ container: this.$el });
  },

  _updateCoordinates: function() {

  },

  show: function() {
    this.model.set('hidden', false);
  },

  hide: function() {
    this.model.set('hidden', true);
  },

  _toggle: function() {
    if(this.model.get('hidden')) {
      this.$el.fadeOut();
    } else {
      this.$el.fadeIn();
    }
  },

  _toggleBaselayer: function() {
    var baselayer = this.model.get('baselayer');

    if (baselayer === 'loss') {
      this.loss_timeline.show();
    } else {
      this.loss_timeline.hide();
    }

    if (baselayer === 'forma') {
      this.forma_timeline.show();
    } else {
      this.forma_timeline.hide();
    }

    if (baselayer === 'imazon') {
      this.imazon_timeline.show();
    } else {
      this.imazon_timeline.hide();
    }

    if (baselayer === 'modis') {
      this.modis_timeline.show();
    } else {
      this.modis_timeline.hide();
    }
  },

  render: function() {
    return this.$el;
  },
});
