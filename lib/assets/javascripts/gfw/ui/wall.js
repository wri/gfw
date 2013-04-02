gfw.ui.model.Wall = Backbone.Model.extend({

  defaults: {
    title: "Sign in",
    subtitle: "Don’t you have a password?",
    hidden: false,
    placeholder: "Enter password",
    mode: "login",
    help: "Please, enter your email address to require access to the site"
  }

});

gfw.ui.view.Wall = gfw.ui.view.Widget.extend({

  className: 'wall',

  events: {

    "click .invite": "_gotoInvite",
    //"click .source": "onClickSource"

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "_toggleMode", "_updateTitle", "_updateSubtitle", "_updatePlaceholder" );

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.Wall();

    this.add_related_model(this.model);

    this.model.bind("change:hidden", this.toggle);

    this.model.bind("change:title",       this._updateTitle);
    this.model.bind("change:subtitle",    this._updateSubtitle);
    this.model.bind("change:placeholder", this._updatePlaceholder);
    this.model.bind("change:mode",        this._toggleMode);

    //this.model.bind("change:closed",    this.toggleOpen);
    //this.model.bind("change:draggable", this.toggleDraggable);

    this.$backdrop = $(".wall_backdrop");

    var template = $("#wall-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  _gotoInvite: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this._setMode("request");
  },

  _setMode: function(mode) {

    if (mode == "login") {
      this.model.set({ title: "Sign in", subtitle: "Don’t you have a password?", placeholder: "Enter password", mode: mode })
    } else if (mode == "request") {
      this.model.set({ title: "Request an invite", help: "Please, enter your email address to require access to the site", placeholder: "Enter your email", mode: mode })
    } else if (mode == "thanks") {
      this.model.set({ title: "Thank you :-)", help: "We sent you an email with the password to access the site", mode: mode })
    }

  },

  _toggleMode: function() {

    var mode = this.model.get("mode");

    if (mode == "login") {
      this.$(".invite").show();
      this.$(".help").hide();
    } else if (mode == "request") {
      this.$(".subtitle").hide();
      this.$(".help").show();
    } else if (mode == "thanks") {
      this.$(".subtitle").hide();
      this.$(".help").show();
    }

  },

  _updatePlaceholder: function() {
    this.$el.find("input[type='text']").attr("placeholder", this.model.get("placeholder"));
  },

  _updateSubtitle: function() {
    this.$el.find(".subtitle").html(this.model.get("subtitle"));
  },

  _updateTitle: function() {
    this.$el.find(".title").html(this.model.get("title"));
  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    //this.$content     = this.$el.find(".content");
    //this.$layer_count = this.$el.find(".layer_count");
    //this.$shadow      = this.$el.find(".shadow");

    this.$backdrop.show();
    this.$el.show();

    return this.$el;

  }

});
