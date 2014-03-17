var Filter = (function() {

  var pids,
      filters = [],
      lastClass  =  null,
      categories = [],
      $filters = $('.filters'),
      $layer = $('#layer');

  function _updateHash() {
    var zoom = map.getZoom(),
        lat = map.getCenter().lat().toFixed(2),
        lng = map.getCenter().lng().toFixed(2),
        baselayer = config.BASELAYER == null ? 'none' : config.BASELAYER;

    var hash = 'map/'+zoom+'/'+lat+'/'+lng+'/'+config.ISO+'/'+config.BASEMAP+'/'+baselayer+'/'+filters.join(',');

    window.router.navigate(hash, { replace: true, trigger: true });
  }

  function _remove(id) {
    if (_.include(filters, id)) {
      filters = _.without(filters, id);
    }

    config.MAPOPTIONS.layers = filters;

    _updateHash();
  }

  function _toggle(id) {
    if (_.include(filters, id)) {
      filters = _.without(filters, id);
    } else {
      filters.push(id);
    }

    config.MAPOPTIONS.layers = filters;

    _updateHash();
  }

  function _show(callback) {
    if (!$filters.hasClass('hide')) return;

    var count = categories.length;

    $filters.fadeIn(150, function() {
      $filters.find('li').each(function(i, el) {
        $(el).delay(i * 50).animate({ opacity: 1 }, 150, 'easeInExpo', function() {
          $(this).find('a').animate({ top: '-15px'}, 150);
          count--;

          if (count <= 0) {
            $filters.removeClass('hide');

            if (callback) callback();
            _calcFiltersPosition();
          }
        });
      });
    });
  }

  function _hide(callback) {
    _hideLayer();

    if ($filters.hasClass('hide')) {
      callback && callback();

      return;
    }

    var count = categories.length;

    $($filters.find('li a').get().reverse()).each(function(i, el) {
      $(el).delay(i * 50).animate({ top: '15px' }, 150, function() {
        $(this).parent().animate({ opacity: '0'}, 150, function() {
          --count;

          if (count <= 0) {
            $filters.fadeOut(150, function() {
              $filters.addClass('hide');

              if (callback) callback();
            });
          }
        });
      });
    });
  }

  function _calcFiltersPosition() {
    $filters.find('li').each(function(i, el) {
      $(el).data('left-pos', $(el).position().left+1);
    });
  }

  function _hideLayer() {
    $layer.animate({ opacity: 0 }, 70, function() {
      $layer.css('left', -10000);
    });
  }

  function _closeOpenFilter() {
    var c = $layer.attr('class');

    if (c === undefined) return;

    clearTimeout(pids);

    pids = setTimeout(function() {
      _close(c);
    }, 100);
  }

  function _close(c) {
    $layer.animate({ opacity: 0 }, 70, function() {
      $layer.css('left', -10000);
      $layer.removeClass(c);
    });

    $layer.css('left', '-10000px');
  }

  function _open() {
    var $li = $(this),
        lw = $layer.width(),
        liClass = $li.attr('data-id'),
        l = $li.data('left-pos'),
        $line = $li.find('.filter-line'),
        lineWidth = $line.width();

    cancelClose();

    $layer.removeClass(lastClass);

    var name = $li.find('a').text();
    $layer.find('.filter-title').text(name);

    var color = $li.find('a').css('color');
    $layer.find('.filter-title').css({ color: color });
    $layer.find('.filter-line').css({ backgroundColor: color });

    $layer.find('.last').removeClass('last');
    $layer.find('.filter-links li').hide();
    $layer.find('.filter-links .'+liClass).show();
    $layer.find('.filter-links .'+liClass).last().addClass('last');

    $('.filter-links .last').closest('li').css({ 'border-bottom': 0 });

    $layer.addClass(liClass);
    lastClass = liClass;

    var left = (l+$li.width() / 2) - (170 / 2),
        height = $layer.find('.filter-links').height();

    $layer.css({ left: left });

    $layer.animate({ opacity: 1 }, 250);
    $('.filter-scroll').css({ height: height });
  }

  function cancelClose() {
    clearTimeout(pids);
  }

  function _onMouseEnter() {
    $layer.animate({ opacity: 1 }, 150);
  }

  function _init() {
    $(document).on('mouseenter', '.filters li', _open);
    $layer.on('mouseleave', _closeOpenFilter);

    $(document).on('click', '.radio', function(e) {
      e.preventDefault();

      $('.radio[data-name="'+$(this).attr('data-name')+'"]').removeClass('checked');
      $(this).addClass('checked');
    });

    $(document).on('click', '.checkbox', function(e) {
      e.preventDefault();

      $(this).toggleClass('checked');

      if ($(this).hasClass('checked')) {
        var color = $(this).attr('data-color');
        $(this).css('color', color);
        $(this).find('i').css('background-color', color);
      } else {
        $(this).css('color', '#ccc');
        $(this).find('i').css('background-color', '#ccc');
      }
    });
  }

  function _check(id) {
    $('#layer a[data-id='+id +']').addClass('checked');

    var color = $('#layer a[data-id='+id +']').attr('data-color');
    $('#layer a[data-id='+id +']').css('color', color );
    $('#layer a[data-id='+id +']').find('i').css('background-color', color );

    filters.push(id);
  }

  function _resize() {
    var height = $('.filter-links').height();

    $('.filter-scroll').animate({ height: height }, 150);
  }

  function _addForestLossFilter(id, slug, category, name, options) {
    var clickEvent     = options.clickEvent     || null,
        disabled       = options.disabled       || false,
        source         = options.source         || null,
        category_color = options.category_color || '#ccc',
        color          = options.color          || '#ccc',
        subtitle       = options.subtitle       || '';

    var cat  = category.replace(/ /g, '_').toLowerCase();

    if (!_.include(categories, cat)) {
      var template = _.template($('#filter-template').html()),
          $filter  = $(template({ name: category, category: cat, data: cat, category_color: category_color }));

      $filters.find('filter-list').append($filter);
      categories.push(cat);
    }

    var layerItemTemplate = null,
        $layerItem        = null;

    if (cat === 'forest_change') {
      layerItemTemplate = _.template($('#layer-item-checkbox-loss-template').html());

      $layerItem = $(layerItemTemplate({ name: name, id: id, slug:slug, category: cat, disabled: disabled, source: source, color: color, subtitle: subtitle }));

      if (config.BASELAYER === 'loss') {
        $layerItem.find('.checkbox').addClass('checked');

        var color = $layerItem.find('.checkbox').attr('data-color');
        $layerItem.find('.checkbox').css('color', color );
        $layerItem.find('.checkbox').find('i').css('background-color', color );
      }

      $layerItem.find('.checkbox').on('click', function() {
        $layerItem.parent().find('.extra').slideUp();
        setTimeout(function() { _resize(); }, 300);

        clickEvent && clickEvent();
      });
    }

    $layer.find('.filter-links .extra').append($layerItem);
    $layerItem.find('.checkbox').addClass(cat);
  }

  function _addForestLossFilters(id, slug, category, name, options) {
    var clickEvent     = options.clickEvent     || null,
        disabled       = options.disabled       || false,
        source         = options.source         || null,
        category_color = options.category_color || '#ccc',
        color          = options.color          || '#ccc',
        subtitle       = options.subtitle       || '';

    var cat  = category.replace(/ /g, '_').toLowerCase();

    if (!_.include(categories, cat)) {
      var template = _.template($('#filter-template').html()),
          $filter  = $(template({ name: category, category: cat, data: cat, category_color: category_color }));

      $filters.find('ul').append($filter);
      categories.push(cat);
    }

    var layerItemTemplate = null,
        $layerItem        = null;

    layerItemTemplate = _.template($('#layer-item-radio-loss-template').html());

    $layerItem = $(layerItemTemplate({ name: name, id: id, slug:slug, category: cat, disabled: disabled, source: source, subtitle: subtitle }));

    if (config.BASELAYER === 'loss') {
      $layerItem.find('.radio').addClass('checked');
    } else {
      $layerItem.find('.extra').hide();
    }

    $layerItem.find('.radio').on('click', function(e) {
      e.preventDefault();

      if (!$(this).hasClass('checked')) {
        $layerItem.parent().find('.extra').slideUp();
        $layerItem.find('.extra').slideDown(150);

        setTimeout(function() {
          _resize();
        }, 300);

        clickEvent && clickEvent();

        $(this).parent().find('.checkbox').each(function(i, c) {
          var $c = $(c);
          $c.addClass('checked');
          var color = $c.attr('data-color');
          $c.css('color', color );
          $c.find('i').css('background-color', color );
        });
      }
    });

    $layer.find('.filter-links').append($layerItem);
    $layerItem.find('.checkbox').addClass(cat);
  }

  function _addFilter(id, slug, category, name, options) {
    var clickEvent     = options.clickEvent     || null,
        disabled       = options.disabled       || false;
        source         = options.source         || null;
        category_color = options.category_color || '#ccc';
        color          = options.color          || '#ccc';
        subtitle       = options.subtitle       || '';

    var cat  = category.replace(/ /g, '_').toLowerCase();

    if (!_.include(categories, cat)) {
      var template = _.template($('#filter-template').html()),
          $filter  = $(template({ name: category, category: cat, data: cat, category_color: category_color }));

      $filters.find('ul').append($filter);
      categories.push(cat);
    }

    var layerItemTemplate = null,
        $layerItem        = null;

    if (!disabled) {
      // Select the kind of input (radio or checkbox) depending on the category
      if (cat === 'forest_change') {
        layerItemTemplate = _.template($('#layer-item-radio-template').html());

        $layerItem = $(layerItemTemplate({ name: name, id: id, slug:slug, category: cat, disabled: disabled, source: source, subtitle: subtitle }));

        $layerItem.find('.radio').on('click', function() {

          $layerItem.parent().find('.extra').slideUp();
          setTimeout(function() { _resize(); }, 300);

          if (!$(this).find('.radio').hasClass('checked')) {
            clickEvent && clickEvent();
          }

        });
      } else {
        layerItemTemplate = _.template($('#layer-item-checkbox-template').html());
        $layerItem = $(layerItemTemplate({ name: name, id: id, color: color, slug:slug, category: cat, disabled: disabled, source: source }));

        $layerItem.find('a:not(.source)').on('click', function() {
          clickEvent();
        });
      }
    } else {
      layerItemTemplate = _.template($('#layer-item-disabled-template').html());
      $layerItem = $(layerItemTemplate({ name: name, id: id, color: color, slug:slug, category: cat, disabled: disabled, source: source }));
    }

    if ((slug === 'nothing' && config.BASELAYER === null) || (slug === config.BASELAYER)) {
      $layerItem.find('.radio').addClass('checked');
    }

    $layer.find('.filter-links').append($layerItem);
    $layerItem.find('.checkbox').addClass(cat);
  }

  return {
    init: _init,
    show: _show,
    hide: _hide,
    addFilter: _addFilter,
    addForestLossFilters: _addForestLossFilters,
    addForestLossFilter: _addForestLossFilter,
    toggle: _toggle,
    remove: _remove,
    closeOpenFilter:_closeOpenFilter,
    calcFiltersPosition: _calcFiltersPosition,
    check: _check
  };

}());
