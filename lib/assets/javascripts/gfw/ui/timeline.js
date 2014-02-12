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

    this.imazon_timeline = new gfw.ui.view.TimelineImazon();
    this.$el.append(this.imazon_timeline.$el);

    this.modis_timeline = new gfw.ui.view.TimelineModis();
    this.$el.append(this.modis_timeline.$el);
  },

  _updateCoordinates: function() {
    this.loss_timeline && this.loss_timeline.updateCoordinates();
    this.modis_timeline && this.modis_timeline.updateCoordinates();
    this.forma_timeline && this.forma_timeline.updateCoordinates();
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
    var that = this;

    var baselayer = this.model.get('baselayer');

    this.$el.animate({ opacity: 0 }, 250, function() {
      if (baselayer === 'loss') {
        that.loss_timeline.show();
      } else {
        that.loss_timeline.hide();
      }

      if (baselayer === 'forma') {
        that.forma_timeline.show();
      } else {
        that.forma_timeline.hide();
      }

      if (baselayer === 'imazon') {
        that.imazon_timeline.show();
      } else {
        that.imazon_timeline.hide();
      }

      if (baselayer === 'modis') {
        that.modis_timeline.show();
      } else {
        that.modis_timeline.hide();
      }
    }).delay(250).animate({ opacity: 1 }, 250);
  },

  render: function() {
    return this.$el;
  },
});
