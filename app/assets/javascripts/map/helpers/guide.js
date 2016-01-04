(function ( $ ) {

    var guide = function() {
        var container,
            defaults = {
                margin: 10
            },
            topMask = $("<div/>").addClass("guideMask"),
            bottomMask = $("<div/>").addClass("guideMask"),
            leftMask = $("<div/>").addClass("guideMask"),
            rightMask = $("<div/>").addClass("guideMask"),
            transparentMask = $("<div/>").addClass("guideMaskTransparent"),
            bubble = $("<div/>").addClass("guideBubble"),
            holdingSteps,
            steps,
            position,

            prevButton = $("<button/>").addClass("btn uppercase gray").html("Prev"),
            nextButton = $("<button/>").addClass("btn uppercase green").html("Next"),
            arrow = $("<div/>").addClass("guideBubble-arrow"),

            gotoStep = function(i) {
                if (steps[i].options && steps[i].options.callfront) {
                    steps[i].options.callfront();
                    positionMask(i);
                    positionBubble(i);
                } else {
                    positionMask(i);
                    positionBubble(i);
                }
            },
            nextStep = function() {
                position++;
                if (position>=steps.length) {
                    clearGuide();
                } else {
                    gotoStep(position);
                }
            },
            prevStep = function() {
                position--;
                if (position<0) {
                    position = steps.length - 1;
                }
                gotoStep(position);
            },
            getElementAttrs = function(element) {
                return {
                    top: element.offset().top,
                    left: element.offset().left,
                    width: element.outerWidth(),
                    height: element.outerHeight()
                }
            },
            positionMask = function(i) {
                var element = steps[i].element,
                    margin = (steps[i].options && steps[i].options.margin != undefined) ? steps[i].options.margin : options.margin,
                    attrs = getElementAttrs(element),
                    top = attrs.top,
                    left = attrs.left,
                    width = attrs.width,
                    height = attrs.height;

                topMask.css({
                    height: (top - margin) + "px"
                });

                bottomMask.css({
                    top: (height + top + margin) + "px",
                    height: ($(document).height() - height - top - margin) + "px"
                });

                leftMask.css({
                    width: (left - margin) + "px",
                    top: (top - margin) + "px",
                    height: (height + margin*2) + "px"
                });

                rightMask.css({
                    left: (left + width + margin) + "px",
                    top: (top - margin) + "px",
                    height: (height + margin*2) + "px",
                    width: ($(document).width() - width - left - margin) + "px",
                });
            },
            positionBubble = function(i) {
                var element = steps[i].element,
                    margin = (steps[i].options && steps[i].options.margin != undefined) ? steps[i].options.margin : options.margin,
                    align = (steps[i].options && steps[i].options.align != undefined) ? steps[i].options.align : null,
                    position = (steps[i].options && steps[i].options.position) ? steps[i].options.position : 'top',
                    top = element.offset().top,
                    left = element.offset().left,
                    width = element.outerWidth(),
                    height = element.outerHeight(),
                    css = {};

                $(".step", bubble).html(i + 1);
                $(".intro", bubble).html(steps[i].intro);

                switch(position) {
                    case 'top':
                        css = {
                            top: top - bubble.outerHeight() - margin - 10 + "px",
                            left: left + (width/2) - (bubble.outerWidth()/2) + "px"
                        }
                    break;
                    case 'left':
                        css = {
                            top: top - margin + "px",
                            left: left + (-bubble.outerWidth()) - margin - 10 + "px"
                        }
                    break;
                    case 'bottom':
                        css = {
                            top: top + height + margin + 10 + "px",
                            left: left + (width/2) - (bubble.outerWidth()/2) + "px"
                        }
                    break;
                    case 'right':
                        css = {
                            top: (align == 'bottom') ? top + margin - Math.abs(height - bubble.outerHeight()) + "px" : top - margin + "px",
                            left: left + width + margin + 10 + "px"
                        }
                    break;
                }
                // Arrow
                if(!!align) {
                  arrow.removeClass().addClass("guideBubble-arrow " + position+'-'+align);
                } else {
                  arrow.removeClass().addClass("guideBubble-arrow " + position);
                }

                // Bubble
                bubble.animate(css, 0, function() {
                    scrollIntoView();
                    if (steps[i].options.callback) {
                        steps[i].options.callback();
                    }
                });

                // Handle buttons
                if (i==0) {
                  prevButton.hide(0);
                } else {
                  prevButton.show(0)
                }

                if (i==(steps.length-1)) {
                    nextButton.html("Finish")
                } else {
                    nextButton.html("Next")
                }


                scrollIntoView();
            },
            scrollIntoView = function() {
                var element = steps[position].element;

                if (($(document).scrollTop()>element.offset().top) || (($(document).scrollTop() + $("body").height())<element.offset().top)) {
                    $('html, body').animate({
                        scrollTop: element.offset().top - 20
                    });
                }
            },
            clearGuide = function() {
                bubble.detach();
                transparentMask.detach();
                topMask.add(bottomMask).add(leftMask).add(rightMask).animate({
                    opacity: 0
                }, 500, function() {
                    topMask.add(bottomMask).add(leftMask).add(rightMask).detach();
                })

            },
            getMaximumZIndex = function() {
                var max = 0;
                $("*").each(function() {
                    var current = parseInt($(this).css("zIndex"), 10);
                    if(current > max) {
                        max = current;
                    }
                });
                return max;
            }


        return {
            init: function(opts) {
                container = $(this);
                options = $.extend({}, defaults, opts);
                steps = [];
                holdingSteps = [];
                position = -1;
                zIndex = getMaximumZIndex();
                topMask.add(bottomMask).add(leftMask).add(rightMask).css("z-index", zIndex + 2);
                transparentMask.css('z-index', zIndex + 1);
                bubble
                  .css("z-index", zIndex + 2)
                  .html("")
                  .append(arrow)
                  .append($("<div/>").addClass("guide-navigation")
                    .append($("<div/>").addClass("step").html("1"))
                    .append($("<div/>").addClass("btn-group pull-right")
                      .append(prevButton)
                      .append(nextButton)))
                  .append($("<div/>").addClass("intro"));

                prevButton.on("click", function() {
                    if (!$(this).hasClass("disabled")) {
                        prevStep();
                    }
                });
                nextButton.on("click", function() {
                    if (!$(this).hasClass("disabled")) {
                        nextStep();
                    }
                });

                topMask.add(bottomMask).add(leftMask).add(rightMask).on("click", function() {
                    clearGuide();
                });

                return {
                    addStep: function(selector, introduction, options) {
                        holdingSteps.push({
                            selector: selector,
                            intro: introduction,
                            options: options || {}
                        });
                    },
                    start: function() {
                        container.append(topMask, bottomMask, leftMask, rightMask, transparentMask);
                        container.append(bubble);
                        topMask.add(bottomMask).add(leftMask).add(rightMask).animate({
                            opacity: 0.5
                        }, 500);
                        position = -1;
                        steps = [];
                        $.each(holdingSteps, function(i, step) {
                            if ($(step.selector).length) {
                                var attrs = getElementAttrs($(step.selector));
                                if (attrs.width!=0 && attrs.height!=0) {
                                    steps.push({
                                        element: $(step.selector),
                                        selector: step.selector,
                                        intro: step.intro,
                                        options: step.options
                                    });
                                }
                            }
                        });
                        nextStep();
                    }
                }
            },

        }
    }();

    $.fn.extend({
        guide: guide.init
    });
}( jQuery ));
