
gfw.ui.model.Dialog = Backbone.Model.extend({

  defaults: {
    hidden: true,
    layerCount: 0
  }

});

gfw.ui.view.Dialog = gfw.ui.view.Widget.extend({

  id: 'dialog',

  className: 'dialog',

  events: {

    'click .close'  : "onClose",
    'click .accept' : "onAccept",
    'click .cancel' : "onCancel",

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "_toggleOpen", "onCancel", "onAccept", "onClose", "callback" );

    this.options = _.extend(this.options, this.defaults);

    this.model = this.options.model || new gfw.ui.model.Dialog();

    this.add_related_model(this.model);

    this.model.bind("change:hidden",    this.toggle);

    var template = $("#dialog-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  callback: function() {
    var callback = this.model.get("callback");

    callback && callback();

    this.hide();

  },

  onClose: function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    this.hide();

  },

  onAccept: function(e) {

    e.preventDefault();
    e.stopImmediatePropagation();

    this.callback();

  },

  onCancel: function(e) {

    e.preventDefault();
    e.stopImmediatePropagation();

    this.hide();

  },

  toggle: function() {

    var that = this;

    if (this.model.get("hidden")) {

      that.$el.fadeOut(that.defaults.speed/2, function() {
        that.$backdrop.fadeOut(that.defaults.speed);
      });

    } else {

      that.$backdrop.fadeIn(that.defaults.speed/2, function() {
        that.$el.fadeIn(that.defaults.speed);
      });

    }

  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$close    = this.$el.find(".close");
    this.$accept   = this.$el.find(".accept");
    this.$cancel   = this.$el.find(".cancel");
    this.$backdrop = $(".backdrop");

    return this.$el;

  }

});
