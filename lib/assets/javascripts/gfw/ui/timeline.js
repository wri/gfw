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

    this.initialized = false;

    this.$container = this.options.container;

    this._initViews();

    this.render();
  },

  _initViews: function() {
    this.loss_timeline = new gfw.ui.view.TimelineLoss();
    this.$el.append(this.loss_timeline.$el);

    this.forma_timeline = new gfw.ui.view.TimelineForma();
    this.$el.append(this.forma_timeline.$el);

    this.imazon_timeline = new gfw.ui.view.TimelineLoss();
    this.$el.append(this.imazon_timeline.$el);

    this.modis_timeline = new gfw.ui.view.TimelineModis();
    this.$el.append(this.modis_timeline.$el);
  },

  _updateCoordinates: function() {
    this.loss_timeline && this.loss_timeline.updateCoordinates(this.model.get('coordinates'));
    this.modis_timeline && this.modis_timeline.updateCoordinates(this.model.get('coordinates'));
    this.forma_timeline && this.forma_timeline.updateCoordinates(this.model.get('coordinates'));
  },

  show: function() {
    this.model.set('hidden', false);
  },

  hide: function() {
    this.model.set('hidden', true);
  },

  _toggle: function() {
    var that = this;

    if(this.model.get('hidden')) {
      this.$el.fadeOut();
    } else {
      this.$el.fadeIn(200, function() {
        if (!that.initialized) {
          that.loss_timeline.show();

          that.initialized = true;
        }
      });
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
