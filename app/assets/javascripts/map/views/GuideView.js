define([
  'handlebars',
  'mps',
  'map/presenters/GuidePresenter',
  'text!map/templates/guideContainer.handlebars',
  'text!map/templates/guideBubble.handlebars'
], function(Handlebars, mps, GuidePresenter, tpl, tplBubble) {

  var GuideView = Backbone.View.extend({

    el: '#guide-container',

    defaults: {
      margin: 10
    },

    events: {
      'click .js-skip-tour' : 'stop',
      'click .js-prev-button' : 'prevStep',
      'click .js-next-button' : 'nextStep',
    },

    template: Handlebars.compile(tpl),
    templateBubble: Handlebars.compile(tplBubble),

    initialize: function() {
      this.presenter = new GuidePresenter(this);
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.cache();
    },

    cache: function() {
      this.$topMask = this.$el.find('.topMask');
      this.$bottomMask = this.$el.find('.bottomMask');
      this.$leftMask = this.$el.find('.leftMask');
      this.$rightMask = this.$el.find('.rightMask');
      this.$transparentMask = this.$el.find('.transparentMask');
      this.$bubble = this.$el.find('.guideBubble');
    },

    // START & STOP
    start: function() {
      // Set steps
      this.$el.addClass('-active');
      // this.model.set('steps', this.getSteps(this.model.get('tour')));

      // Set initial styles
      this.setStyles();
      this.updatePosition();
      this.setArrowNavigation();

      // Analytics
      ga('send', 'event', 'Map','Walk Through','Start');
    },

    stop: function(e) {
      e && e.preventDefault();

      // analytics
      if (e) {
        ga('send', 'event', 'Map', 'Walk Through', 'Give up');
      } else {
        ga('send', 'event', 'Map', 'Walk Through', 'Finish');
      }

      // clear states
      this.clearStates();

      // Hide el
      this.$el.removeClass('-active');

      // Reset presenter status
      this.presenter.clearTour();

      // Reset events
      $(document).off('keyup.tour-arrows');
    },



    // HELPERS
    getElementAttrs: function(element) {
      return {
        top: element.offset().top,
        left: element.offset().left,
        width: element.outerWidth(),
        height: element.outerHeight()
      }
    },

    setStyles: function() {
      this.$el.css("z-index", 9999999999);
    },

    clearStates: function() {
      $('#layersnav-forest-change').removeClass('tour-active');
    },



    // POSITIONING
    positionMask: function(i) {
      var steps = this.presenter.status.get('steps');
      var selector = steps[i].selector,
          margin = (steps[i].options && steps[i].options.margin != undefined) ? steps[i].options.margin : this.defaults.margin;

      if (!!selector) {
        var attrs = this.getElementAttrs($(selector)),

        top = attrs.top,
        left = attrs.left,
        width = attrs.width,
        height = attrs.height;

        this.$topMask.css({
          height: (top - margin > 0) ? (top - margin) : 0
        });

        this.$bottomMask.css({
          top: (height + top + margin) + "px",
          height: ($(document).height() - height - top - margin) + "px"
        });

        this.$leftMask.css({
          width: (left - margin) + "px",
          top: (top - margin) + "px",
          height: (height + margin*2) + "px"
        });

        this.$rightMask.css({
          left: (left + width + margin) + "px",
          top: (top - margin) + "px",
          height: (height + margin*2) + "px",
          width: ($(document).width() - width - left - margin) + "px",
        });

      } else {
        this.$topMask.css({
          width: '100%',
          height: '100%',
          top: 0,
          left: 0
        });
        // hide masks, we only need one
        this.$bottomMask.css({ top: "-9999px" });
        this.$leftMask.css({ top: "-9999px" });
        this.$rightMask.css({ top: "-9999px" });
      }
    },

    positionBubble: function(i) {
      var steps = this.presenter.status.get('steps');
      var element = $(steps[i].selector),
          margin = (steps[i].options && steps[i].options.margin != undefined) ? steps[i].options.margin : this.defaults.margin,
          align = (steps[i].options && steps[i].options.align != undefined) ? steps[i].options.align : null,
          position = (steps[i].options && steps[i].options.position) ? steps[i].options.position : 'top',
          top = (!!steps[i].selector) ? element.offset().top : '50%',
          left = (!!steps[i].selector) ? element.offset().left : '50%',
          width = (!!steps[i].selector) ? element.outerWidth() : 300,
          height = (!!steps[i].selector) ? element.outerHeight() : 300,
          css = {},
          step = _.extend(steps[i],{
            index: i + 1,
            prev: (i != 0) ? true : false,
            next: (i != steps.length - 1) ? true : false,
          });

      this.$bubble.html(this.templateBubble(step));

      switch(position) {
        case 'top':
          css = {
            top: top - this.$bubble.outerHeight() - margin - 10 + "px",
            left: left + (width/2) - (this.$bubble.outerWidth()/2) + "px",
            margin: 0
          }
        break;
        case 'left':
          css = {
            top: top - margin + "px",
            left: left + (-this.$bubble.outerWidth()) - margin - 10 + "px",
            margin: 0
          }
        break;
        case 'bottom':
          css = {
            top: top + height + margin + 10 + "px",
            left: left + (width/2) - (this.$bubble.outerWidth()/2) + "px",
            margin: 0
          }
        break;
        case 'right':
          css = {
            top: (align == 'bottom') ? top + margin - Math.abs(height - this.$bubble.outerHeight()) + "px" : top - margin + "px",
            left: left + width + margin + 10 + "px",
            margin: 0
          }
        break;

        case 'center':
          css = {
            top: top ,
            left: left,
            marginTop: - (height/2),
            marginLeft: - (width/2)
          }
        break;
      }
      this.$bubble.css(css);

      // scrollIntoView();
    },



    // NAVIGATION
    updatePosition: function() {
      // var position = this.model.get('position');
      // var steps = this.model.get('steps');
      var position = this.presenter.status.get('position');
      var steps = this.presenter.status.get('steps');

      if (!!steps[position].options && !!steps[position].options.callfront) {
        steps[position].options.callfront();
      }

      this.positionMask(position);
      this.positionBubble(position);

      if (!!steps[position].options && !!steps[position].options.callback) {
        steps[position].options.callback();
      }

    },

    updateMask: function() {
      this.positionMask(this.presenter.status.get('position'));
    },

    nextStep: function() {
      this.presenter.goToNextStep();
    },

    prevStep: function() {
      this.presenter.goToPrevStep();
    },

    setArrowNavigation: function() {
      $(document).on('keyup.tour-arrows', function(e) {
        switch(e.keyCode) {
          case 37:
            this.prevStep();
          break;
          case 39:
            this.nextStep();
          break;
        }
      }.bind(this));
    },

    scrollIntoView: function() {
      var position = this.presenter.status.get('position');
      var element = $(steps[position].selector);
      if (!!steps[position].selector) {
        if (($(document).scrollTop()>element.offset().top) || (($(document).scrollTop() + $("body").height())<element.offset().top)) {
          $('html, body').animate({
            scrollTop: element.offset().top - 20
          });
        }
      }
    },



  });

  return GuideView;

});
