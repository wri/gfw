/**
 * The Timeline view module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 *
 * @return Timeline view (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'moment',
  'd3',
  'handlebars',
  'enquire',
  'text!templates/timelineYear.handlebars',
  'text!templates/timelineYear-mobile.handlebars'
], function(_, Backbone, moment, d3, Handlebars, enquire, tpl, tplMobile) {

  'use strict';

  var TimelineYearClass = Backbone.View.extend({

    className: 'timeline-year',
    template: Handlebars.compile(tpl),
    templateMobile: Handlebars.compile(tplMobile),

    defaults: {
      dateRange: [moment([2001]), moment()],
      playSpeed: 400,
      width: 750,
      height: 50
    },

    events: {
      'click .play': 'togglePlay',
      'change .select-date' : 'setSelects'
    },

    initialize: function(layer, currentDate) {
      _.bindAll(this, 'onAnimationBrush', 'onBrush', 'onBrushEnd', 'updateCurrentDate');
      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({}, this.defaults, this.options || {});
      this.dateRangeStart = this.options.dateRange[0].utc();
      this.dateRangeEnd = this.options.dateRange[1].utc();
      if (currentDate && currentDate[0]) {
        this.currentDate = currentDate;
      } else {
        this.updateCurrentDate(this.options.dateRange);
      }

      // Status
      this.playing = false;

      // d3 slider objets
      this.svg = {};
      this.xscale = {};
      this.brush = {};
      this.slider = {};
      this.handlers = {
        left:{},
        right:{}
      };

      /**
       * Current extent position.
       * We use this because we need where the extent is going to be,
       * we can't get the values from the handlers because they
       * have animation.
       */
      this.ext = {
        left: 0,
        right: 0
      };

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render();
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.renderMobile();
        },this)
      });
    },


    /**
     * Render select of years.
     */
    renderMobile: function(){
      this.$timeline = $('.timeline-container');
      this.$el.html(this.templateMobile({name: this.layer.title}));
      this.$timeline.html('').append(this.el);

      // Cache
      this.$play = this.$el.find('.play');
      this.$playIcon = this.$el.find('.play-icon');
      this.$stopIcon = this.$el.find('.stop-icon');
      this.$time = this.$el.find('.time');

      // Timeline
      this.$selects = $('.select-date');
      this.$from = $('#from-timeline-year');
      this.$to = $('#to-timeline-year');


      this.fillSelects();
    },


    fillSelects: function(){
      var start = this.dateRangeStart.year(),
          end = this.dateRangeEnd.year(),
          range = end - start,
          options = '';
      for (var i = 0; i < range; i++) {
        options += '<option value="'+(start + i)+'">'+ (start + i) +'</option>';
      }
      if (! !!this.currentDate[0]._d) {
        this.currentDate[0] = moment(this.currentDate[0]);
        this.currentDate[1] = moment(this.currentDate[1]);
      }
      this.$from.html(options).val(this.currentDate[0].year());
      this.$to.html(options).val(this.currentDate[1].year() - 1);
      this.setSelects();
    },

    setSelects: function(){
      _.each(this.$selects,function(el){
        var date = $(el).val();
        var $dateButton = $('#'+$(el).attr('id')+'-button');
        $dateButton.text(date);
      });
      this.toggleDisabled();

    },

    toggleDisabled: function(){
      _.each(this.$selects,function(el){
        var $options = document.getElementById($(el).attr('id')).options;
        var compare = $($(el).data('compare'))[0].selectedIndex;
        var direction = Boolean(parseInt($(el).data('direction')));

        _.each($options, function(opt,i){
          if (direction) {
            (compare < i) ? $(opt).prop('disabled',true) : $(opt).prop('disabled',false);
          }else{
            (compare > i) ? $(opt).prop('disabled',true) : $(opt).prop('disabled',false);
          }
        });
      });

      this.updateCurrentDate([moment([this.$from.val()]), moment([parseInt(this.$to.val()) + 1])]);
    },



    /**
     * Render d3 timeline slider.
     */
    render: function() {
      var self = this, margin, width, height, ticks, center, handleY, yearWidth;

      this.$timeline = $('.timeline-container');
      this.$el.html(this.template());
      this.$timeline.html('').append(this.el);

      // Cache
      this.$play = this.$el.find('.play');
      this.$playIcon = this.$el.find('.play-icon');
      this.$stopIcon = this.$el.find('.stop-icon');
      this.$time = this.$el.find('.time');

      // Set Vars
      margin = {top: 0, right: 20, bottom: 0, left: 20};
      width = this.options.width - margin.left - margin.right;
      height = this.options.height - margin.bottom - margin.top;
      yearWidth = width/(moment(this.options.dateRange[1]).year() - moment(this.options.dateRange[0]).year());
      center = height/2 - 2;
      handleY = 14;
      ticks = moment(this.options.dateRange[1]).year() - moment(this.options.dateRange[0]).year();

      if (! !!this.options.player) {
        this.$play.addClass('hidden');
        this.$play.parent().addClass('no-play');
      }

      // Set xscale
      this.xscale = d3.scale.linear()
          .domain([moment(this.options.dateRange[0]).year(), moment(this.options.dateRange[1]).year()])
          .range([0, width])
          .clamp(true);

      this.xscaleYears = d3.scale.linear()
          .domain([moment(this.options.dateRange[0]).year(), moment(this.options.dateRange[1]).year() - 1])
          .range([0, width - yearWidth])
          .clamp(true);

      if (! !!this.currentDate[0]._d) {
        this.currentDate[0] = moment(this.currentDate[0]);
        this.currentDate[1] = moment(this.currentDate[1]);
      }
      this.ext.left = this.xscale(this.currentDate[0].year());
      this.ext.right = this.xscale(this.currentDate[1].year());

      // Set brush and listeners
      this.brush = d3.svg.brush()
          .x(this.xscale)
          .extent([0, 0])
          .on('brush', function() {
            self.onBrush(this);
          })
          .on('brushend', function() {
            self.onBrushEnd(this);
          });

      // Set SVG
      var timelineWidth = width + margin.left + margin.right;
      this.svg = d3.select(this.$time[0]).append('svg')
          .attr('width', timelineWidth)
          .attr('height', height + margin.top + margin.bottom)
          .style('width', timelineWidth + 'px')
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Dots xaxis
      this.svg.append('g')
          .attr('class', 'xaxis')
          .attr('transform', 'translate(0,{0})'.format(center))
          .call(d3.svg.axis()
            .scale(this.xscale)
            .orient('top')
            .ticks(this.options.dateRange[1].year() - this.options.dateRange[0].year())
            .tickFormat(function() {
              return '▪';
            })
            .tickSize(0)
            .tickPadding(0))
          .select('.domain').remove();

      this.svg.select('.xaxis').selectAll('g.line').remove();

      // Years xaxis
      var xAxis = d3.svg.axis()
          .scale(this.xscaleYears)
          .orient('bottom')
          .ticks(ticks)
          .tickSize(0)
          .tickPadding(0)
          .tickFormat(_.bind(function(d) {
            // return (d == 2000 && this.name == 'prodes') ? String('1997-2000') : String(d);
            return String(d);
          }, this ))

      this.svg.append('g')
          .attr('class', 'xaxis-years')
          .attr('transform', 'translate({0},{1})'.format(yearWidth/2, height/2 + 6))
          .call(xAxis)
          .style('cursor', 'pointer')
        .select('.domain').remove();

      // Handlers
      this.slider = this.svg.append('g')
          .attr('class', 'slider')
          .call(this.brush);

      this.handlers.left = this.slider.append('svg:image')
          .attr('class', 'handle')
          .attr('width', 16)
          .attr('height', 16)
          .attr('xlink:href', '/assets/svg/dragger2.svg')
          .attr('x', this.xscale(this.currentDate[0].year()))
          .attr('y', handleY);

      this.handlers.right = this.handlers.left
         .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
         .attr('x', this.xscale(this.currentDate[1].year()));

      this.slider.select('.background')
          .style('cursor', 'pointer')
          .attr('height', height - 22);

      // Tipsy
      this.tipsy = this.svg.append('g')
        .attr('class', 'tipsy')
        .style('visibility', 'hidden');

      this.trail = this.tipsy.append('svg:line')
        .attr('class', 'trail')
        .attr('x1', this.handlers.right.attr('x'))
        .attr('x2', this.handlers.right.attr('x'))
        .attr('y1', 0)
        .attr('y2', height);

      this.tooltip = d3.select(this.$time[0]).append('div')
        .attr('class', 'tooltip')
        .style('visibility', 'hidden')
        .style('left', this.handlers.right.attr('x') + 'px')
        .text(this.options.dateRange[0].year()-1);

      // Hidden brush for the animation
      this.hiddenBrush = d3.svg.brush()
          .x(this.xscale)
          .extent([0, 0])
          .on('brush', function() {
            self.onAnimationBrush(this);
          })
          .on('brushend', function() {
            self.onAnimationBrushEnd(this);
          });

      this.svg.selectAll('.extent,.resize')
          .remove();

      this.domain = this.svg.select('.xaxis')
        .insert('svg:line', ':first-child')
        .attr('class', 'domain')
        .attr('x1', this.handlers.left.attr('x'))
        .attr('x2', this.handlers.right.attr('x'));

      d3.select('.xaxis-years')
          .attr('class', 'xaxis-years '+this.name)
          .selectAll('.tick')
          .on('click',_.bind(function(value){
            this.selectYear(value);
          }, this ))
      this.formatXaxis();
    },

    /**
     * Event fired when user clicks play/stop button.
     */
    togglePlay: function() {
      (this.playing) ? this.stopAnimation() : this.animate();
    },

    stopAnimation: function() {
      if (!this.playing) {return;}
      // End animation extent hiddenBrush
      // this will call onAnimationBrushEnd
      this.trail
        .call(this.hiddenBrush.event)
        .interrupt();
    },

    /**
     * Play the timeline by extending hiddenBrush with d3 animation.
     */
    animate: function() {
      this.presenter.startPlaying();
      var hlx = this.handlers.left.attr('x');
      var hrx = this.handlers.right.attr('x');
      var trailFrom = Math.round(this.xscale.invert(hlx)) + 1; // +1 year left handler
      var trailTo = Math.round(this.xscale.invert(hrx));

      if (trailTo === trailFrom) {
        return;
      }

      var speed = (trailTo - trailFrom) * this.options.playSpeed;

      this.togglePlayIcon();
      this.playing = true;
      this.yearsArr = []; // clean years

      this.showTipsy();
      this.hiddenBrush.extent([trailFrom, trailFrom]);

      // Animate extent hiddenBrush to trailTo
      this.trail
          .call(this.hiddenBrush.event)
        .transition()
          .duration(speed)
          .ease('line')
          .call(this.hiddenBrush.extent([trailFrom, trailTo]))
          .call(this.hiddenBrush.event);
    },

    /**
     * Event fired when timeline is being played.
     * Updates handlers positions and timeline date when reach a year.
     */
    onAnimationBrush: function() {
      var value = this.hiddenBrush.extent()[1];
      var roundValue = Math.round(value); // current year

      // yearsArr keep track of the years already loaded.
      // reason to do this is that value is never an
      // absolute value so we don't know when the trail
      // is in the right position.
      if (this.yearsArr.indexOf(roundValue) < 0 &&
        roundValue > 0) {

        // Move domain right
        this.domain
          .attr('x2', this.xscale(roundValue));

        // Move trail
        this.trail
          .attr('x1', this.xscale(roundValue))
          .attr('x2', this.xscale(roundValue));

        // Move && update tooltip
        this.tooltip
          .text(roundValue - 1)
          .style('left', this.xscale(roundValue) + 'px');

        this.formatXaxis();

        // Update timeline
        var startYear = Math.round(this.xscale.invert(this.handlers.left.attr('x')));
        this.updateCurrentDate([moment([startYear]), moment([roundValue])]);

        this.yearsArr.push(roundValue);
      }
    },

    onAnimationBrushEnd: function (){
      var value = this.hiddenBrush.extent()[1];
      var hrl = this.ext.left;
      var trailFrom = Math.round(this.xscale.invert(hrl)) + 1; // +1 year left handler

      if (value > 0 && value !==  trailFrom) {
        this.presenter.stopPlaying();
        this.togglePlayIcon();
        this.playing = false;
      }
    },

    /**
     * Event fired when user click anywhere on the timeline
     * and keep pressing.
     * Updates just handlers positions.
     */
    onBrush: function(event) {
      var value = this.xscale.invert(d3.mouse(event)[0]);
      var roundValue = Math.round(value);

      var xl = this.handlers.left.attr('x');
      var xr = this.handlers.right.attr('x');

      this.hideTipsy();

      if (this.playing) {
        this.stopAnimation();
      }

      if (Math.abs(this.xscale(value) - xr) <
        Math.abs(this.xscale(value) - xl)) {
        if (this.ext.left > this.xscale(roundValue)) {
          return;
        }
        this.ext.right = this.xscale(roundValue);

        this.domain
          .attr('x1', this.ext.left);

        // Move right handler
        this.handlers.right
          .transition()
          .duration(100)
          .ease('line')
          .attr('x', this.xscale(roundValue));

        // Move domain right
        this.domain
          .transition()
          .duration(100)
          .ease('line')
          .attr('x2', this.xscale(roundValue));

      } else {
        if (this.ext.right < this.xscale(roundValue)) {
          return;
        }
        this.ext.left = this.xscale(roundValue);

        this.domain
          .attr('x2', this.ext.right);

        // Move left handler
        this.handlers.left
          .transition()
          .duration(100)
          .ease('line')
          .attr('x', this.xscale(roundValue));

        // Move domain left
        this.domain
          .transition()
          .duration(100)
          .ease('line')
          .attr('x1', this.xscale(roundValue));
      }

      this.formatXaxis();
    },

    formatXaxis: function() {
      var self = this;
      d3.select('.xaxis').selectAll('text').filter(function(d) {
        var left = self.ext.left;
        var right = self.ext.right;
        if (d >= Math.round(self.xscale.invert(left)) && d <= Math.round(self.xscale.invert(right))) {
          d3.select(this).classed('selected', true);
        } else {
          d3.select(this).classed('selected', false);
        }
      });
      d3.select('.xaxis-years').selectAll('text').filter(function(d) {
        var left = self.ext.left;
        var right = self.ext.right;
        if (d >= Math.round(self.xscale.invert(left)) && d < Math.round(self.xscale.invert(right))) {
          d3.select(this).classed('selected', true);
        } else {
          d3.select(this).classed('selected', false);
        }
      });
    },

    selectYear: function(val){
      // LEFT
      this.ext.left = this.xscale(val);

      this.domain
        .attr('x2', this.ext.right);

      // Move left handler
      this.handlers.left
        .transition()
        .duration(100)
        .ease('line')
        .attr('x', this.xscale(val));

      // Move domain left
      this.domain
        .transition()
        .duration(100)
        .ease('line')
        .attr('x1', this.xscale(val));

      //RIGHT
      this.ext.right = this.xscale(val + 1);

      this.domain
        .attr('x1', this.ext.left);

      // Move right handler
      this.handlers.right
        .transition()
        .duration(100)
        .ease('line')
        .attr('x', this.xscale(val + 1));

      // Move domain right
      this.domain
        .transition()
        .duration(100)
        .ease('line')
        .attr('x2', this.xscale(val + 1));

      this.formatXaxis();
      setTimeout(function() {
        this.onBrushEnd();
      }.bind(this), 100);

    },

    /**
     * Event fired when user ends the click.
     * Update the timeline date. (calls updateCurrentDate)
     */
    onBrushEnd: function() {
      // give time to finish animations.
      setTimeout(function() {
        var startYear = Math.round(this.xscale.invert(this.handlers.left.attr('x')));
        var endYear = Math.round(this.xscale.invert(this.handlers.right.attr('x')));

        this.updateCurrentDate([moment([startYear]), moment([endYear])]);
      }.bind(this), 100);
    },

    /**
     * Handles a timeline date change UI event by dispaching
     * to TimelinePresenter.
     *
     * @param {Array} timelineDate 2D array of moment dates [begin, end]
     */
    updateCurrentDate: function(date) {
      this.currentDate = date;
      this.presenter.updateTimelineDate(date);
    },

    togglePlayIcon: function() {
      this.$playIcon.toggle();
      this.$stopIcon.toggle();
    },

    showTipsy: function() {
      this.tipsy.style('visibility', 'visible');
      this.tooltip.style('visibility', 'visible');
    },

    hideTipsy: function() {
      this.tipsy.style('visibility', 'hidden');
      this.tooltip.style('visibility', 'hidden');
    },

    getName: function() {
      return this.name;
    },

    getCurrentDate: function() {
      return this.currentDate;
    }
  });

  return TimelineYearClass;

});
