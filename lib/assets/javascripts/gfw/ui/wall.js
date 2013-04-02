gfw.ui.model.Wall = Backbone.Model.extend({

  defaults: {
    title: "Sign in",
    subtitle: "Don’t you have a password?",
    hidden: false,
    placeholder: "Enter password",
    mode: "login",
    button_title: "Sign in",
    help: "Please, enter your email address to require access to the site"
  }

});

gfw.ui.view.Wall = gfw.ui.view.Widget.extend({

  className: 'wall',

  events: {

    "click .invite": "_gotoInvite",
    "click .send":   "_send"

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "_toggleMode", "_updateTitle", "_updateHelp", "_updateButtonTitle", "_updateSubtitle", "_updatePlaceholder" );

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.Wall();

    this.add_related_model(this.model);

    this.model.bind("change:hidden", this.toggle);

    this.model.bind("change:title",         this._updateTitle);
    this.model.bind("change:button_title",  this._updateButtonTitle);
    this.model.bind("change:subtitle",      this._updateSubtitle);
    this.model.bind("change:help",          this._updateHelp);
    this.model.bind("change:placeholder",   this._updatePlaceholder);
    this.model.bind("change:mode",          this._toggleMode);

    //this.model.bind("change:closed",    this.toggleOpen);
    //this.model.bind("change:draggable", this.toggleDraggable);

    this.$backdrop = $(".wall_backdrop");

    var template = $("#wall-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  _checkPass: function() {

    if (this.$el.find("input").val() == "123") {
      this.hide();
    } else {
      this._setMode("error", "Password wrong");
    }

  },

  hide: function() {
    this.$el.fadeOut(250);
    this.$backdrop.fadeOut(250);
  },

  _send: function(e) {
    var that = this;

    e.preventDefault();
    e.stopPropagation();

    var mode = this.model.get("mode");
    console.log(mode);

    if (mode == "request") {
      $.ajax({ url: "/", success: function() {
        that._setMode("thanks");
      }});
    } else {
      this._checkPass();
    }

  },

  _gotoInvite: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this._setMode("request");
  },

  _setMode: function(mode) {

    if (mode == "login") {
      this.model.set({ title: "Sign in", subtitle: "Don’t you have a password?", button_title: "Sign in", placeholder: "Enter password", mode: mode })
    } else if (mode == "request") {
      this.model.set({ title: "Request an invite", help: "Please, enter your email address to require access to the site", button_title: "Send", placeholder: "Enter your email", mode: mode })
    } else if (mode == "thanks") {
      this.model.set({ title: "Thank you :-)", help: "We sent you an email with the password to access the site", placeholder: "Enter password", button_title: "Sign in", mode: mode })
      this.$("input").val("");
    }

  },

  _toggleMode: function() {

    var mode = this.model.get("mode");

    if (mode == "login") {
      this.$(".invite").fadeIn(250);
      this.$(".help").fadeOut(250);;
    } else if (mode == "request") {
      this.$(".subtitle").fadeOut(250);;
      this.$(".help").fadeIn(250);
    } else if (mode == "thanks") {
      this.$(".subtitle").fadeOut(250);;
      this.$(".help").fadeIn(250);
    }

  },

  _updatePlaceholder: function() {
    this.$el.find("input[type='text']").attr("placeholder", this.model.get("placeholder"));
  },

  _updateHelp: function() {
    this.$el.find(".help").html(this.model.get("help"));
  },

  _updateSubtitle: function() {
    this.$el.find(".subtitle").html(this.model.get("subtitle"));
  },

  _updateButtonTitle: function() {
    this.$el.find(".send span").html(this.model.get("button_title"));
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

    this.$backdrop.fadeIn(250);
    this.$el.fadeIn(250);

    return this.$el;

  }

});
