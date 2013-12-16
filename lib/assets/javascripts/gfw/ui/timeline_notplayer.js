gfw.ui.model.TimelineNotPlayer = Backbone.Model.extend({
  defaults: {
    hidden: true,
    handle: false
  }
});

gfw.ui.view.TimelineNotPlayer = gfw.ui.view.Widget.extend({
  className: "timeline timeline_notplayer",

  events: {
    "click .quarters li .year":  "_onClickYear"
  },

  initialize: function() {
    _.bindAll(this, "toggle");

    var template = $("#timeline_notplayer-template").html();

    this.model = new gfw.ui.model.TimelineNotPlayer({
      startYear: 2011,
      endYear: 2014,
      year: "2013",
      month: "09"
    });

    this.add_related_model(this.model);

    // Bindings
    this.model.on("change:hidden", this.toggle);
    this.model.on("change:line", this._onChangeLine, this);

    // Defaults
    this.grid_x = 81;
    this.tipsy_visible = false;

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

    this.render();
  },

  show: function() {
    if (analysis.analyzing) return;

    this.model.set("hidden", false);

    return this;
  },

  hide: function() {
    this.model.set("hidden", true);

    return this;
  },

  _updateMap: function(month, year) {
    this.trigger('change_date', month, year);
  },

  _onClickYear: function(e){
    e && e.preventDefault();
    e && e.stopPropagation();

    var year = $(e.target).attr("data-year"),
        month = $(e.target).attr("data-month");
        quarter = $(e.target).attr("data-quarter");

    if($(e.target).hasClass("active") && (year !== this.model.get("year") || month !== this.model.get("month"))){
      $('.year').removeClass("selected");
      $(e.target).addClass("selected");

      this.$line.find(".tipsy span").html(config.QUARTERNAMES[quarter] + " " + year);
      this.model.set("line", $(e.target).position().left + $(e.target).width()/2);

      this.model.set("month", month);
      this.model.set("year", year);

      this._updateMap(month, year);
    }
  },

  _onChangeLine: function() {
    if(this.model.get("handle")) {
      this.$line.animate({
        left: this.model.get("line")
      }, 150);
    } else {
      this.$line.css("left", this.model.get("line"));

      this.$line.fadeIn();

      this.model.set("handle", true);
    }
  },

  _addYears: function() {
    var start = parseInt(this.model.get("startYear"), 10),
        end = parseInt(this.model.get("endYear"), 10);

    var yearCount = (end - start),
        quarters = 4;

    var liWidth = this.grid_x + 6,
        padding = 51 + 13 * 2;

    var width = padding + (yearCount) * liWidth * 4;

    this.setWidth(width);

    this.$el.css({
      marginLeft: -width/2,
      left: "50%",
      height: "50px"
    });

    for(var i = 0; i <= yearCount; i++) {
      if(i < yearCount) {
        for(var j = 0; j < quarters; j++) {
          var quarter = ( ((j+1)*3 <= 9) ? "0" + (j+1)*3 : (j+1)*3 ),
              current_quarter = (j + 1);

          this.$quarters.append("<li><a href='#' class='year q"+ (start + i)+""+quarter+"' data-year='"+ (start + i) +"' data-month='"+ quarter +"' data-quarter='"+ j +"'>" + (start + i) + " Q" + current_quarter + "</a></li>");
          this.$months.append("<li><div class='interval'></div></li>");
        }
      } else {
        this.$quarters.append("<li><a href='#' class='year' data-year='"+ (start + i) +"'>" + (start + i) + " Q1</a></li>");
      }
    }
  },

  _init: function() {
    if (this.initialized) return;

    this.initialized = true;

    this.$line = this.$el.find(".line");
    this.$tipsy = this.$line.find(".tipsy");

    this.$quarters = this.$el.find(".quarters");
    this.$months = this.$el.find(".visible_quarters");

    this.$coordinates = this.$el.find(".coordinates");

    this._addYears();
    this._loadDefaultQuarter();

    this.options.container.append(this.$el);
  },

  _loadDefaultQuarter:function() {
    var that = this;

    var start = parseInt(this.model.get("startYear"), 10),
        end = parseInt(this.model.get("endYear"), 10);

    var yearCount = (end - start),
        quarters = 4,
        sql = 'SELECT ';

    for(var i = 0; i <= yearCount; i++) {
      for(var j = 1; j <= quarters; j++) {
        var quarter = ( (j*3 <= 9) ? "0" + j*3 : j*3 );

        sql += '(SELECT COUNT(*) FROM modis_forest_change_copy WHERE EXTRACT(YEAR FROM date) = ' + (start + i) + ' AND EXTRACT(MONTH FROM date) = ' + quarter + ') as q'+ (start + i) + '' + quarter

        if(i < yearCount || j < quarters) {
          sql += ', ';
        }
      }
    }

    $.getJSON('http://wri-01.cartodb.com/api/v2/sql/?q='+sql, function(data) {
      _.each(data.rows[0], function(value, key) {
        if(value !== 0) {
          $('.'+key).addClass("active");
        }
      });

      var $selected = $(".q"+that.model.get("year")+""+that.model.get("month"));

      $selected.addClass("selected");
      that.$line.find(".tipsy span").html(config.QUARTERNAMES[$selected.attr("data-quarter")] + " " + that.model.get("year"));
      that.model.set("line", $selected.position().left + $selected.width()/2);
    });
  },

  toggle: function() {
    if(this.model.get("hidden")) {
      this.$el.fadeOut(this.defaults.speed);
    } else {
      this.$el.fadeIn(this.defaults.speed);
      this._init();
    }
  },

  updateCoordinates: function(latLng) {
    var lat = parseFloat(latLng.lat()),
        lng = parseFloat(latLng.lng());

    lat = lat.toFixed(6);
    lng = lng.toFixed(6);

    if (this.$coordinates) {
      this.$coordinates.html("Lat/Long: "+lat + "," + lng);
    }
  },

  render: function() {
    this.$el.append(this.template.render( this.model.toJSON() ));

    return this.$el;
  }
});
