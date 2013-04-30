// Widget --------------------------------------

gfw.ui.model.Widget = Backbone.Model.extend({ });

gfw.ui.view.Widget = gfw.core.View.extend({

  defaults: {
    speed: 300
  },

  initialize: function() {

    _.bindAll( this, "toggle", "_toggleOpen", "toggleDraggable", "toggleResizable", "onStopDragging", "onStopResizing" );

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:draggable", this.toggleDraggable);
    this.model.bind("change:resizable", this.toggleResizable);

  },

  setLeft: function(x, animated) {

    var y = this.model.get("top");
    this.setPosition(x, y, animated);

    return this;

  },

  setTop: function(y, animated) {

    var x = this.model.get("left");
    this.setPosition(x, y, animated);

    return this;

  },

  setBottom: function(y, animated) {

    var x = this.model.get("left");
    this.setPosition(x, y, animated);

    return this;

  },

  setWidth: function(w, animated) {

    this.model.set("width", w);

    if (animated) {
      this.$el.animate({ width: w }, this.defaults.speed);
    } else {
      this.$el.css({ width: w });
    }

    return this;

  },

  setHeight: function(h, animated) {

    this.model.set("height", h);

    if (animated) {
      this.$el.animate({ height: h }, this.defaults.speed);
    } else {
      this.$el.css({ height: h });
    }

    return this;

  },


  setSize: function(w, h, animated) {

    this.model.set("width", w);
    this.model.set("height", h);

    if (animated) {
      this.$el.animate({ width: w, height: h }, this.defaults.speed);
    } else {
      this.$el.css({ width: w, height: h });
    }

    return this;

  },

  setDimensions: function(dimensions) {

    this.setPosition(dimensions.x, dimensions.y);
    this.setSize(dimensions.w, dimensions.h);

    return this;

  },

  width: function() {

    if ( this.model.get("width") == undefined )
      this.model.set("width", this.$el.width());

    return this.model.get("width");

  },

  height: function() {

    if ( this.model.get("height") == undefined )
      this.model.set("height", this.$el.height());

    return this.model.get("height");

  },

  left: function() {

    if ( this.model.get("left") == undefined )
      this.model.set("left", this.$el.position().left);

    return this.model.get("left");

  },

  top: function() {

    if ( this.model.get("top") == undefined )
      this.model.set("top", this.$el.position().top);

    return this.model.get("top");

  },

  bottom: function() {

    if ( this.model.get("bottom") == undefined )
      this.model.set("bottom", this.$el.position().bottom);

    return this.model.get("bottom");

  },

  getSize: function() {

    return { w: this.model.get("width"), h: this.model.get("height") };

  },

  getDimensions: function() {

    return {
      x: this.model.get("left"),
      y: this.model.get("top"),
      w: this.model.get("width"),
      h: this.model.get("height")
    };

  },

  setPosition: function(left, top, animated) {

    this.model.set("top", top);
    this.model.set("left", left);

    if (animated) {
      this.$el.animate({ top: top, left: left }, this.defaults.speed);
    } else {
      this.$el.css({ top: top, left: left });
    }

    return this;

  },

  getPosition: function() {

    return { x: this.model.get("left"), y: this.model.get("top") };

  },

  absoluteVerticalCenter: function(animated) {

    var x = $(document).width() /2 - this.width()/2;

    this.model.set("left", x);

    if (animated) {
      this.$el.animate({ left: x }, this.defaults.speed );
    } else {
      this.$el.css({ left: x });
    }

  },

  animate: function(properties, animated, callback) {

    var that = this;

    _.each(properties, function(value, property) {
      that.model.set(property, value);
    });

    if (animated) {

      this.$el.animate( properties, this.defaults.speed, function() {
        callback && callback();
      });

    } else {
      this.$el.css(properties);
      callback && callback();
    }

  },

  verticalCenter: function(w, animated) {

    var x = w/2 - this.width()/2;

    this.model.set("left", x);

    if (animated) {
      this.$el.animate({ left: x }, this.defaults.speed );
    } else {
      this.$el.css({ left: x });
    }

  },

  center: function(w, h, animated) {

    var x = w/2 - this.width()/2;
    var y = h/2 - this.height()/2;

    this.model.set("left", x);
    this.model.set("top", y);

    if (animated) {

      this.$el.animate({ left: x, top: y }, this.defaults.speed );

    } else {

      this.$el.css({ left: x, top: y });

    }

  },

  toggle: function() {
    if (this.model.get("hidden")) {

      this.$el.fadeOut(this.defaults.speed);

    } else {

      this.$el.fadeIn(this.defaults.speed);

    }

  },

  toggleHidden: function() {

    this.model.get("hidden") ? this.show() : this.hide();

  },

  _toggleOpen: function(e) {

    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    this.model.get("closed") ? this.open() : this.close();

  },

  open: function(callback) {
    this.model.set("closed", false);

    callback && callback();

    return this;
  },

  close: function(callback) {
    this.model.set("closed", true);

    callback && callback();

    return this;
  },


  show: function(callback) {
    this.model.set("hidden", false);

    callback && callback();

    return this;
  },

  hide: function(callback) {
    this.model.set("hidden", true);

    callback && callback();

    return this;
  },

  setResizable: function(resizable) {

    this.model.set("resizable", resizable);

  },

  toggleResizable: function() {

    var that = this;

    if (this.model.get("resizable")) {

      this.$el.resizable({ disabled: false, stop: this.onStopResizing })

    } else {

      this.$el.resizable('destroy');
      this.$el.find(".ui-resizable-handle").remove(); // remove the handlers

    }

  },

  setDraggable: function(draggable) {

    this.model.set("draggable", draggable);

  },

  toggleDraggable: function() {

    var that = this;

    if (this.model.get("draggable")) {

      if (this.model.get('containment')) {

        this.$el.draggable({ containment: this.model.get("containment"), disabled: false, stop: this.onStopDragging })

      } else {

        this.$el.draggable({ disabled: false, stop: this.onStopDragging })

      }

    } else {

      this.$el.draggable({ disabled: true });

    }

  },

  onStopDragging: function(e, el) {

    //e && e.preventDefault();
    //e && e.stopImmediatePropagation();

    this.setPosition(el.position.left, el.position.top);

  },

  onStopResizing: function(e, el) {

    this.setSize(el.size.width, el.size.height);

  },


});
