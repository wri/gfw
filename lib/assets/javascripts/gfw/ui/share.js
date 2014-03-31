gfw.ui.model.Share = cdb.core.Model.extend();

gfw.ui.view.Share = cdb.core.View.extend({
  className: 'share',

  events: {
    'click .share_control' : '_openShare',
  },

  initialize: function() {
    this.model = new gfw.ui.model.Share();

    this.model.on('change:hidden', this._toggle);

    var template = $('#share-template').html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });

    this._initViews();
  },

  _initViews: function() {
    this.share = new gfw.ui.view.ShareDialog();
    $('body').append(this.share.render());
  },

  _openShare: function() {
    this.share.show();
  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$analysis_control = this.$el.find('.analysis_control');
    $(this.$analysis_control).tipsy({ title: 'data-tip', fade: true, gravity: 'w' });

    return this.$el;
  }
});


gfw.ui.model.ShareDialog = Backbone.Model.extend({

  defaults: {
    title: "Share this map view",
    help: "Paste link in email or IM",
    hidden: false,
    mode: "link"
  }

});

gfw.ui.view.ShareDialog = gfw.ui.view.Widget.extend({
  className: 'share_dialog',

  events: {
    'click .close': 'hide'
  },

  initialize: function() {
    _.bindAll( this, 'toggle', '_toggleMode', '_onKeyDown' );

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.ShareDialog();

    this.model.on('change:hidden', this.toggle);

    this.$backdrop = $('.backdrop');

    var template = $('#share_dialog-template').html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  show: function() {
    var that = this;

    this.$el.fadeIn(250);
    this.$backdrop.show();

    $(document).on('keydown', this._onKeyDown);

    this.$backdrop.on('click', function() {
      that.hide();
    });
  },

  hide: function(e) {
    e && e.preventDefault();

    var that = this;

    this.$el.fadeOut(250, function() {
      that._setMode('subscribe');
    });

    this.$backdrop.fadeOut(250);

    $(document).off('keydown');

    this.$backdrop.off('click');
  },

  _onKeyDown: function(e) {
    if (e.which == 27) this._onEscKey(e);
  },

  _onEscKey: function(e) {
    e && e.preventDefault();

    this.hide();
  },

  _setMode: function(mode) {
    if (mode === 'link') {

    } else if (mode === 'embed') {

    }
  },

  _toggleMode: function() {
    var mode = this.model.get('mode');

    if (mode === 'link') {

    } else if (mode === 'embed') {

    }
  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    return this.$el;
  }
});
