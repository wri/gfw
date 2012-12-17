///////////////////////////////////////////////////////////////////////////////
//
// jquery.stylishSelect
// Version: 1.0 (2010-02-20)
//
// Copyright (c) 2010 Scott W. Bradley (scottwb@gmail.com)
//
// Dual licensed under the MIT and GPL licenses:
//   http://www.opensource.org/licenses/mit-license.php
//   http://www.gnu.org/licenses/gpl.html
//
///////////////////////////////////////////////////////////////////////////////
(function($){
    $.fn.stylishSelect = function(options) {

        ////////////////////////////////////////////////////////////
        // Private Methods
        ////////////////////////////////////////////////////////////
        
        // Handler to detect when the parent form of a given select
        // element has been reset, to find the new selected option
        // of the select and act like it was clicked.
        var _onReset = function(elem) {
            var $select = $(elem);
            var idx = (elem.selectedIndex < 0) ? 0 : elem.selectedIndex;
            $('ul', $select.parent()).each(function() {
                $('a:eq(' + idx + ')', this).click();
            });
        };

        // Closes all open selects.
        var _closeAllSelects = function() {
            $('.ssSelectWrapper.expanded').removeClass('expanded');
            $('.ssSelectWrapper ul:visible').hide();
        };
        
        var _enableSelect = function(elem) {
            var $select  = $(elem);
            var $wrapper = $select.siblings('.ssSelectWrapper');
            elem.disabled = false;
            $wrapper.removeClass('disabled');
        };
        
        var _disableSelect = function(elem) {
            var $select  = $(elem);
            var $wrapper = $select.siblings('.ssSelectWrapper');
            elem.disabled = true;
            $wrapper.addClass('disabled');
        };

        // Clears out all options and repopulates them from the original
        // select.
        var _updateOptions = function(elem) {
            var $select = $(elem);
            var $wrapper = $select.siblings('.ssSelectWrapper');

            // If select is disabled, set the wrapper to disabled.
            if (elem.disabled) {
                $wrapper.addClass('disabled');
            }

            // Clear out options and repopulate with new ones.
            var $ul = $wrapper.find('ul').find('li').remove().end().hide();
            $('option', $select).each(function(i) {
                if (this.disabled) {
                    $ul.append(
                        '<li><span class="disabled" index="' + i + '">' +
                        this.text                                       +
                        '</span></li>'
                    );
                }
                else {
                    $ul.append(
                        '<li><a href="#" index="' + i + '">' +
                        this.text                            +
                        '</a></li>'
                    );
                }
            });

            // Add click handlers for the options.
            $ul.find('a').click(function() {
                var $link = $(this);
                var linkIndex = $link.attr('index');

                // Unselect previous option, select this option, and
                // update the menu's text label.
                $('a.selected', $wrapper).removeClass('selected');
                $link.addClass('selected');
                $('span:eq(0)', $wrapper).html($link.html());

                // Set the newly selected option in the original select
                /// and fire the select's onchange event.
                if ((elem.selectedIndex != linkIndex)) {
                    elem.selectedIndex = linkIndex;
                    $(elem).trigger('change');
                }

                // Hide the drop-down list.
                $wrapper.removeClass('expanded');
                $ul.hide();

                return false;
            });

            // Set the default
            $('a:eq(' + elem.selectedIndex + ')', $ul).click();
        };
 
        // Initialize the given select element with stylishSelect.
        var _initSelect = function(elem) {
            var $select = $(elem);
            var zIndex  = $select.css('zIndex')*1;
            zIndex      = (zIndex) ? zIndex : 0;

            // First, wrap the select.
            $select.wrap(
                $('<div class="stylishSelectWrapper"></div>').css({zIndex:100-zIndex})
            );

            // Have to wait until after wrapping to get the correct width.
            var width = parseInt($select.css('width'));

            // Add a class to hide the select and add our custom HTML after it.
            $select.addClass('ssHidden').after(
                '<div class="ssSelectWrapper">'             +
                '  <div>'                                   +
                '    <span class="ssText"></span>'          +
                '    <span class="ssOpenButton"></span>'    + 
                '  </div>'                                  +
                '  <ul></ul>'                               +
                '</div>'
            );
            
            // Get the wrapper we just added and force it to have the same
            // width as the original select.
            var $wrapper = $select.siblings('.ssSelectWrapper').css({
                width : width + 'px'
            });

            // Set the width of the text area wrapper to be the width of
            // the whole thing minus the width of the open button.
            $('.ssText', $wrapper).width(
                width - parseInt($('.ssOpenButton', $wrapper).css('width'))
            );

            // Add the standard iframe hack for IE6 to hide the select.
            if ($.browser.msie && $.browser.version < 7) {
                $select.after(
                    $(
                        '<iframe src="javascript:\'\';"' +
                        '        marginwidth="0"' +
                        '        marginheight="0"' +
                        '        align="bottom"' +
                        '        scrolling="no"' +
                        '        tabIndex="-1"' +
                        '        frameborder="0"></iframe>'
                    ).css({
                        height : $select.height() + 4 + 'px'
                    })
                );
            }

            // Add the options.
            _updateOptions(elem);
            
            // Add click handler to text/open-button that expands/collapses
            // the drop-down.
            $('div', $wrapper).click(function() {
                if ($wrapper.hasClass('disabled')) {
                    return false;
                }

                var $ul = $(this).siblings('ul');

                if ($ul.css('display') == 'none') {
                    // Drop-down wasn't showing.
                    // Immediately close all others and add the 'expanded'
                    // class to this one.
                    // Toggling to expand is handled below.
                    _closeAllSelects();
                    $wrapper.addClass('expanded');
                }
                else {
                    // Drop-down was already showing.
                    // Remove the 'expanded' class.
                    // Toggling to collapse is handled below.
                    $wrapper.removeClass('expanded');
                }
                
                // Expand/collapse the select that was just clicked.
                $ul.slideToggle('fast');

                return false;
            });

            // Handle the parent form being reset.
            $select.parents('form').bind(
                'reset',
                function() {
                    window.setTimeout(
                        function() {
                            _onReset(elem);
                        },
                        10
                    );
                }
            );
            
            // Hide the original select.
            $('.ssHidden').css({opacity:0});
        };

        // Setup a click handler for clicks *outside* of the select.
        $(document).mousedown(function(event) {
            if ($(event.target).parents('.ssSelectWrapper').length === 0) {
                _closeAllSelects();
            }
        });

        // Extend and initialize each given select element.
        return this.each(function() {
            // Add public methods directly on DOM element.
            this.ssDisable = function() { _disableSelect(this); };
            this.ssEnable  = function() { _enableSelect(this);  };
            this.ssUpdate  = function() { _updateOptions(this); };

            // Initialize with stylishSelect.
            _initSelect(this);
        });

    }; // end plugin

})(jQuery);
