/**
 * The Feed view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'd3',
  'mps',
  'countries/views/CountryInfoWindow',
  'countries/views/CountryHeaderView',
  'countries/views/CountryShareView',
  'countries/helpers/CountryHelper'

], function($, Backbone, _, d3, mps, CountryInfoWindow, CountryHeaderView, CountryShareView, CountryHelper) {

  'use strict';

  var CountryOverviewModel = Backbone.Model.extend({
    defaults: {
      graph: 'total_loss',
      years: true,
      class: null
    }
  });



  var CountryOverviewView = Backbone.View.extend({

    el: '#countryOverviewView',

    events: {
      'click .info' : 'showInfo',
      'click .graph_tab': '_updateGraph',
      'click .show-more-countries': '_drawList',
      'click .country-overview-wrapper-coolio .umdoptions_dialog #canopy_slider':  '_updateGraphOverview',
      'mouseup .country-overview-wrapper-coolio .umdoptions_dialog #canopy_slider':  '_updateGraphOverview',
      'click .country-overview-wrapper-coolio .umdoptions_dialog ul li':  '_updateGraphOverview'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.helper = CountryHelper;
      this.model = new CountryOverviewModel();
      this.headerView = new CountryHeaderView();


      this.$graph = $('.overview_graph__area');
      this.$years = $('.overview_graph__years');
      this.$settings = $('.settings');
      var m = this.m = 40,
          w = this.w = this.$graph.width(),
          h = this.h = this.$graph.height(),
          vertical_m = this.vertical_m = 20;

      this.x_scale = d3.scale.linear()
        .range([m, w-m])
        .domain([2001, 2013]);

      this.grid_scale = d3.scale.linear()
        .range([vertical_m, h-vertical_m])
        .domain([0, 1]);

      this.model.bind('change:graph', this._redrawGraph, this);
      this.model.bind('change:years', this._toggleYears, this);
      this.model.bind('change:class', this._toggleClass, this);

      this._initViews();
    },

    _initViews: function() {
      this.sourceWindow = new CountryInfoWindow();
      this.$el.append(this.sourceWindow.render());

      this.tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip2');

      this._drawYears();
      this._drawGraph();
      this._drawList();

      var Share = new CountryShareView({ template: 'templateShare' });
      this.$el.find('.overview_button_group .share').append(Share.render());
    },

    showInfo: function(e){
      var source = $(e.currentTarget).attr('data-source');
      this.sourceWindow.show(source);
    },

    _toggleYears: function() {
      var that = this;

      if (this.model.get('years') === false) {
        this.$years.slideUp(250, function() {
          $('.overview_graph__axis').slideDown();
        });
      } else {
        $('.overview_graph__axis').slideUp(250, function() {
          that.$years.slideDown();
        });
      }
    },

    _showYears: function() {
      if (!this.model.get('years')) {
        this.model.set('years', true);
      }
    },

    _hideYears: function() {
      if (this.model.get('years')) {
        this.model.set('years', false);
      }
    },

    _updateGraph: function(e) {
      e.preventDefault();

      var $target = $(e.target).closest('.graph_tab'),
          graph = $target.attr('data-slug');

      if (graph === this.model.get('graph')) {
        return;
      } else {
        $('.graph_tab').removeClass('selected');
        $target.addClass('selected');

        this.model.set('graph', graph);
      }
      ga('send', 'event', 'Country overview', 'Click', 'Overview graph: ' + graph);
    },

    _redrawGraph: function() {
      var graph = this.model.get('graph');
      var $legend = $('.overview_graph__legend');
      $('.overview_graph__title').html(this.helper.config.GRAPHS[graph].title);
      $legend.find('p').html(this.helper.config.GRAPHS[graph].subtitle);
      $legend.find('.info').attr('data-source', graph);

      this.$graph.removeClass('is-hidden');
      this.$years.removeClass('is-hidden');
      $legend.removeClass('is-hidden');

      this.$graph.find('.'+graph);

      this.$graph.find('.chart').hide();
      this.$graph.find('.'+graph).fadeIn();

      this._drawGraph();
      this._drawList();

      if (graph === 'total_extent') {
        this.$graph.addClass('is-hidden');
        this.$years.addClass('is-hidden');
        //$legend.addClass('is-hidden');
      }
    },
    _updateGraphOverview: function(e) {
      if (typeof ga !== "undefined") ga('send', 'event', 'Country Overview', 'Change', 'Threshold');
      var $cnp_op = this.$el.find('.overview_button_group .settings')
      if (this.helper.config.canopy_choice != 30) $cnp_op.addClass('no_def');
      else $cnp_op.removeClass('no_def');

      this._drawYears();
      this._drawGraph();
      this._drawList();
    },

    _reorderRanking: function(e) {
      var $ul = $('.countries_list ul'),
      $ul_li = $ul.children('li');

      $ul_li.sort(function(a,b){
        var an = parseFloat($(a).find('.loss').data('orig')),
            bn = parseFloat($(b).find('.loss').data('orig'));
        if(an > bn) {
          return -1;
        }
        if(an < bn) {
          return 1;
        }
        return 0;
      });

      $ul_li.detach().appendTo($ul);
      $ul_li.find('.countries_list__num').each(function(i, ele){ $(ele).empty().text(i+1) })
    },

    _drawList: function(e) {
      var that = this;

      e && e.preventDefault();

      if (this.model.get('graph') === 'total_loss') {
        this.$settings.removeClass('disable');
        var sql = 'SELECT umd.iso, c.name, c.enabled, Sum(umd.loss) loss FROM umd_nat_final umd, gfw2_countries c WHERE thresh = '+ (this.helper.config.canopy_choice || 30) +' AND umd.iso = c.iso AND NOT loss = 0 AND umd.year > 2000 GROUP BY umd.iso, c.name, c.enabled ORDER BY loss DESC ';

        if (e) {
          sql += 'OFFSET 10';
          $('.show-more-countries').fadeOut();
        } else {
          sql += 'LIMIT 10';
          $('.countries_list ul').html('');
          $('.show-more-countries').show();
        }
        d3.json('http://wri-01.cartodb.com/api/v2/sql/?q='+encodeURIComponent(sql), _.bind(function(json) {
          var self = that,
              markup_list = '';

          var data = json.rows;

          _.each(data, _.bind(function(val, key) {
            var ord = e ? (key+11) : (key+1),
                enabled = val.enabled ? '<a href="/country/'+val.iso+'">'+val.name+'</a>' : val.name,
                umd = {
                  loss : 34,
                  gain : 43
                }
            var max_trigger = data.length -1;
            $.ajax({
              url: 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/' + val.iso+'?thresh=' + (this.helper.config.canopy_choice || 30),
              dataType: 'json',
              success: _.bind(function(data) {
                var loss = (this.helper.config.canopy_choice == false || this.helper.config.canopy_choice == 30) ? Math.round(val.loss) : 0;
                var gain = 0;
                var g_mha, l_mha;
                g_mha = l_mha = 'Mha';

                for (var i = 0; i<data.years.length; i ++) {
                  if (this.helper.config.canopy_choice != false && this.helper.config.canopy_choice != 30){
                    loss += data.years[i].loss
                  }
                  gain += data.years[i].gain
                }
                var orig = loss;

                if (loss.toString().length >= 7) {
                  loss = ((loss /1000)/1000).toFixed(2)
                } else if (loss.toString().length >= 4) {
                  l_mha = 'KHa';
                  loss = (loss /1000);
                if (loss % 1 != 0) loss = loss.toFixed(2)
                } else {
                  l_mha = 'Ha';
                }

                if (gain.toString().length >= 7) {
                  gain = ((gain /1000)/1000).toFixed(2)
                } else if (gain.toString().length >= 4) {
                  g_mha = 'KHa';
                  gain = (gain /1000);
                if (gain % 1 != 0) gain = gain.toFixed(2)
                } else {
                  g_mha = 'Ha';
                }
                $('#umd_'+val.iso+'').empty().append('<span class="loss line" data-orig="' + orig + '"><span>'+ loss +' </span>'+ l_mha +' of loss</span>');

                if (key == max_trigger){
                  that._reorderRanking();
                }
              }, this),
            });
            markup_list += '<li>\
                              <div class="countries_list__minioverview countries_list__minioverview_'+val.iso+'"></div>\
                              <div class="countries_list__num">'+ord+'</div>\
                              <div class="countries_list__title">'+enabled+'</div>\
                              <div class="countries_list__data">\
                                <div id="umd_'+val.iso+'"></div>\
                              </div>\
                            </li>';
          }, this ));

          if (e) {
            $('.show-more-countries').fadeOut();
          } else {
            $('.countries_list ul').html('');
            $('.show-more-countries').show();

            $('.countries_list__header__minioverview').removeClass('loss-vs-gain per-loss total-loss cover-extent ratio-loss-gain').addClass('loss-vs-gain').html('Loss <span>vs</span> Gain');
          }

          $('.countries_list ul').append(markup_list);

          that.model.set('class', null);

          _.each(data, function(val, key) {
            self._drawMiniOverview(val.iso);
          });
        }, this ));
      } else if (this.model.get('graph') === 'percent_loss') {

        this.$settings.removeClass('disable');
        var sql = 'WITH e AS (SELECT iso, extent FROM umd_nat WHERE year = 2000 AND thresh = '+(this.helper.config.canopy_choice || 30)+') SELECT c.iso, c.name, c.enabled, p.perc ratio_loss FROM (SELECT umd.iso, sum(umd.loss) / avg(e.extent) perc FROM umd_nat umd, e WHERE umd.thresh = '+(this.helper.config.canopy_choice || 30)+' AND umd.iso = e.iso AND e.extent != 0 GROUP BY umd.iso, e.iso ORDER BY perc DESC) p, gfw2_countries c WHERE p.iso = c.iso AND c.enabled IS true AND not perc = 0 ORDER BY p.perc DESC ';

        if (e) {
          sql += 'OFFSET 10';
        } else {
          sql += 'LIMIT 10';
        }

        d3.json('http://wri-01.cartodb.com/api/v2/sql/?q='+encodeURIComponent(sql), function(json) {
          var self = that,
              markup_list = '';

          var data = json.rows;
          var max_trigger = data.length -1;
          _.each(data, function(val, key) {
            var ord = e ? (key+11) : (key+1),
                enabled = val.enabled ? '<a href="/country/'+val.iso+'">'+val.name+'</a>' : val.name;

            markup_list += '<li>\
                              <div class="countries_list__num">'+ord+'</div>\
                              <div class="countries_list__title">'+enabled+'</div>\
                              <div class="countries_list__data">\
                                <div id="perc_'+val.iso+'" class="perct"><span class="line percent loss" data-orig="' + val.ratio_loss + '">'+ (val.ratio_loss*100).toFixed(2) +'%</span></div>\
                              </div>\
                            </li>';
            if (key == max_trigger){
              that._reorderRanking();
            }
          });

          if (e) {
            $('.show-more-countries').fadeOut();
          } else {
            $('.countries_list ul').html('');
            $('.show-more-countries').show();

            $('.countries_list__header__minioverview').removeClass('loss-vs-gain per-loss total-loss cover-extent ratio-loss-gain').addClass('per-loss').html('% Loss');
          }

          $('.countries_list ul').append(markup_list);

          that.model.set('class', null);

        });
      } else if (this.model.get('graph') === 'total_extent') {
        this.$settings.removeClass('disable');
        var sql = 'WITH e AS \
                  ( \
                         SELECT iso, \
                                extent \
                         FROM   umd_nat \
                         WHERE  thresh = ' + (this.helper.config.canopy_choice || 30) +' \
                         AND    year = 2000), u AS \
                  ( \
                           SELECT   iso, \
                                    Sum(loss) sum_loss, \
                                    Sum(gain) sum_gain \
                           FROM     umd_nat \
                           WHERE    thresh = ' + (this.helper.config.canopy_choice || 30) +' \
                           GROUP BY iso) \
                  SELECT   c.iso, \
                           c.NAME, \
                           c.enabled, \
                           u.sum_loss, \
                           u.sum_gain, \
                           u.sum_loss / u.sum_gain ratio, \
                           e.extent \
                  FROM     gfw2_countries c, \
                           u, \
                           e \
                  WHERE    u.sum_gain IS NOT NULL \
                  AND      NOT u.sum_gain = 0 \
                  AND      c.iso = u.iso \
                  AND      e.iso = u.iso \
                  ORDER BY u.sum_loss DESC ';
        if (e) {
          sql += 'OFFSET 10';
        } else {
          sql += 'LIMIT 10';
        }

        d3.json('http://wri-01.cartodb.com/api/v2/sql/?q='+encodeURIComponent(sql), function(json) {
          var self = that,
              markup_list = '';

          var data = _.sortBy(json.rows, function(item){ return -item.sum_loss });
          var max_trigger = data.length -1;
          _.each(data, function(val, key) {
            var ord = e ? (key+11) : (key+1),
                enabled = val.enabled ? '<a href="/country/'+val.iso+'">'+val.name+'</a>' : val.name;
                var e_mha, l_mha,
                    ex = val.extent,
                    lo = val.sum_loss;
                    e_mha = l_mha = 'Mha';

                if (ex.toString().length >= 7) {
                  ex = ((ex /1000)/1000).toFixed(2)
                } else if (ex.toString().length >= 4) {
                  e_mha = 'KHa';
                  ex = (ex /1000);
                if (ex % 1 != 0) ex = ex.toFixed(2)
                } else {
                  e_mha = 'Ha';
                }

                if (lo.toString().length >= 7) {
                  lo = ((lo /1000)/1000).toFixed(2)
                } else if (lo.toString().length >= 4) {
                  l_mha = 'KHa';
                  lo = (lo /1000);
                if (lo % 1 != 0) lo = lo.toFixed(2)
                } else {
                  l_mha = 'Ha';
                }
                // if (key == max_trigger){
                //   that._reorderRanking();
                // }
                markup_list += '<li>\
                                <div class="countries_list__num">'+ord+'</div>\
                                <div class="countries_list__title">'+enabled+'</div>\
                                <div class="countries_list__data">\
                                  <div id="ext_'+val.iso+'"><span class="line"><span data-orig="' + val.extent + '" class="loss">'+ ex.toLocaleString() +' </span>'+ e_mha +' of extent (2000)</span><span class="loss line"><span>'+ lo.toLocaleString() +' </span>'+ l_mha +'  of loss (2001-2012)</span></div>\
                                </div>\
                              </li>';
          });

          if (e) {
            $('.show-more-countries').fadeOut();
          } else {
            $('.countries_list ul').html('');
            $('.show-more-countries').show();

            $('.countries_list__header__minioverview').removeClass('loss-vs-gain per-loss total-loss cover-extent ratio-loss-gain').addClass('cover-extent').html('Cover extent <span>vs</span> Cover loss');
          }

          $('.countries_list ul').append(markup_list);

          that.model.set('class', 'expanded');
        });
      } else if (this.model.get('graph') === 'ratio') {
        this.$settings.removeClass('disable');
        var sql = 'WITH loss as (SELECT iso, sum(loss) sum_loss FROM umd_nat WHERE thresh = ' + (this.helper.config.canopy_choice || 30) + ' GROUP BY iso),gain as (SELECT iso, sum(gain) sum_gain FROM umd_nat WHERE thresh = ' + (this.helper.config.canopy_choice || 30) + ' GROUP BY iso), ratio as (SELECT c.iso, c.name, c.enabled, loss.sum_loss/gain.sum_gain as ratio FROM loss, gain, gfw2_countries c WHERE sum_gain IS NOT null AND NOT sum_gain = 0 AND c.iso = gain.iso  AND c.iso = loss.iso ORDER BY loss.sum_loss DESC LIMIT 50) SELECT * FROM ratio WHERE ratio IS NOT null ORDER BY ratio DESC ';

        if (e) {
          sql += ['OFFSET 10',
                  'LIMIT 40'].join('\n');
        } else {
          sql += 'LIMIT 10';
        }

        d3.json('http://wri-01.cartodb.com/api/v2/sql/?q='+encodeURIComponent(sql), _.bind(function(json) {
          var self = that,
              markup_list = '';

          var data = json.rows;
          var max_trigger = data.length -1;
          _.each(data, _.bind(function(val, key) {
            var ord = e ? (key+11) : (key+1),
                enabled = val.enabled ? '<a href="/country/'+val.iso+'">'+val.name+'</a>' : val.name;

            markup_list += '<li>\
                              <div class="countries_list__minioverview_number countries_list__minioverview medium countries_list__minioverview_'+val.iso+'" class="loss">'+this.helper.formatNumber(parseFloat(val.ratio).toFixed(2))+'</div>\
                              <div class="countries_list__num">'+ord+'</div>\
                              <div class="countries_list__title">'+enabled+'</div>\
                            </li>';
            if (key == max_trigger){
              that._reorderRanking();
            }
          }, this ));

          if (e) {
            $('.show-more-countries').fadeOut();
          } else {
            $('.countries_list ul').html('');
            $('.show-more-countries').show();

            $('.countries_list__header__minioverview').removeClass('loss-vs-gain per-loss total-loss cover-extent ratio-loss-gain').addClass('ratio-loss-gain').html('Ratio of Loss to Gain');
          }

          $('.countries_list ul').append(markup_list);

          that.model.set('class', 'medium');

          _.each(data, function(val, key) {
            self._drawMiniOverview(val.iso);
          });
        }, this ));
      } else if (this.model.get('graph') === 'domains') {
        $('.settings').addClass('disable');
        var sql = 'SELECT name, total_loss, total_gain, GREATEST('

        for(var y = 2001; y < 2012; y++) {
          sql += 'y'+y+', '
        }

        sql += 'y2012) as max\
                FROM countries_domains\
                ORDER BY total_loss DESC ';

        d3.json('http://wri-01.cartodb.com/api/v2/sql/?q='+encodeURIComponent(sql), _.bind(function(json) {
          var self = that,
              markup_list = '';

          var data = json.rows;

          _.each(data, _.bind(function(val, key) {
            markup_list += ['<li>',
                              '<div class="countries_list__minioverview_number countries_list__minioverview huge">',
                                '<div class="gain half">'+this.helper.formatNumber(parseFloat(val.total_loss/1000000).toFixed(1))+' Mha</div>',
                                '<div class="loss half last">'+this.helper.formatNumber(parseFloat(val.total_gain/1000000).toFixed(1))+' Mha</div>',
                              '</div>',
                              '<div class="countries_list__num">'+(key+1)+'</div>',
                              '<div class="countries_list__title">'+val.name+'</div>',
                            '</li>'].join('');
          }, this ));

          $('.show-more-countries').hide();
          $('.countries_list__header__minioverview').removeClass('loss-vs-gain per-loss total-loss cover-extent ratio-loss-gain').addClass('total-loss').html('Total loss <span>vs</span> Total gain');
          $('.countries_list ul').html(markup_list);

          that.model.set('class', 'huge');

          _.each(data, function(val, key) {
            self._drawMiniOverview(val.iso);
          });
        }, this ));
      }
    },

    _toggleClass: function() {
      if (this.model.get('class') === 'expanded') {
        $('.countries_list__minioverview').addClass('expanded');
        $('.countries_list__minioverview').removeClass('medium huge');
      } else if (this.model.get('class') === 'medium') {
        $('.countries_list__minioverview').addClass('medium');
        $('.countries_list__minioverview').removeClass('expanded huge');
      } else if (this.model.get('class') === 'huge') {
        $('.countries_list__minioverview').addClass('huge');
        $('.countries_list__minioverview').removeClass('expanded medium');
      } else {
        $('.countries_list__minioverview').removeClass('expanded medium huge');
      }
    },

    _drawMiniOverview: function(iso) {
      var width   = 90,
          height  = 30;

      var graph = d3.select('.countries_list__minioverview_'+iso)
        .append('svg:svg')
        .attr('width', width)
        .attr('height', height);

      if (this.model.get('graph') === ('total_loss')) {
        var sql = 'SELECT iso, year, Sum(loss) loss, Sum(gain) gain FROM umd_nat_final WHERE iso = \''+ iso +'\' AND thresh = '+ (this.helper.config.canopy_choice || 30) +' AND year > 2000 GROUP BY iso, year ORDER BY year';

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(json) {
          var data = json.rows;

          var data_ = data,
              gain = data[0].gain;

          var y_scale = d3.scale.linear()
            .domain([0, d3.max(data_, function(d) { return d.loss; })])
            .range([height, 0]);

          var barWidth = width / data_.length;
          var bar = graph.selectAll('g')
            .data(data_)
            .enter().append('g')
            .attr('transform', function(d, i) { return 'translate(' + (i * barWidth) + ', 0)'; });

          bar.append('svg:rect')
            .attr('class', 'bar')
            .attr('y', function(d) { return y_scale(d.loss); })
            .attr('height', function(d) { return height - y_scale(d.loss); })
            .attr('width', barWidth - 1);

          // var data_gain_ = [
          //   {
          //     year: 2001,
          //     value: gain
          //   },
          //   {
          //     year: 2012,
          //     value: gain
          //   }
          // ];

          // graph.selectAll('line.minioverview_line')
          //   .data(data_gain_)
          //   .enter()
          //   .append('line')
          //   .attr({
          //     'class': 'minioverview_line',
          //     'x1': 0,
          //     'x2': width,
          //     'y1': function(d) { return y_scale(gain); },
          //     'y2': function(d) { return y_scale(gain); }
          //   });
        });
      } else if (this.model.get('graph') === ('percent_loss')) {
        var sql = 'SELECT year, \
                         loss_perc \
                  FROM   umd_nat \
                  WHERE  thresh = '+ (this.helper.config.canopy_choice || 30) +' \
                         AND iso = \''+ iso +'\'';

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
          var data = json.rows;

          var data_ = data;

          var y_scale = d3.scale.linear()
            .domain([0, d3.max(data_, function(d) { return d.loss_perc; })])
            .range([height, 0]);

          var barWidth = width / data_.length;

          var bar = graph.selectAll('g')
            .data(data_)
            .enter().append('g')
            .attr('transform', function(d, i) { return 'translate(' + (i * barWidth) + ', 0)'; });

          bar.append('svg:rect')
            .attr('class', 'bar')
            .attr('y', function(d) { return y_scale(d.loss_perc); })
            .attr('height', function(d) { return height - y_scale(d.loss_perc); })
            .attr('width', barWidth - 1);

        });
      } else if (this.model.get('graph') === ('total_extent')) {
        var sql = 'SELECT year, \
                   loss,  \
                   extent_offset extent  \
                  FROM   umd_nat  \
                  WHERE  thresh = '+ (this.helper.config.canopy_choice || 30) +'  \
                         AND iso = \''+ iso +'\' \
                         AND year > 2000 ';

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(json) {

          var graph2 = d3.select('.countries_list__minioverview_'+iso)
            .append('div')
            .attr('class', 'sibling')
            .append('svg:svg')
            .attr('width', width)
            .attr('height', height);
          var data = json.rows;

          var data_loss_ = data,
              data_extent_ = [];

          // _.each(data, function(val, key) {
          //   if (key.indexOf('loss_y') != -1) {
          //     data_loss_.push({
          //       'year': key.split('_y')[1],
          //       'value': val
          //     });
          //   }

          //   if (key.indexOf('extent_y') != -1) {
          //     data_extent_.push({
          //       'year': key.split('extent_y')[1],
          //       'value': val
          //     });
          //   }
          // });

          var y_scale_loss = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.loss; })])
            .range([height, 0]);

          var y_scale_extent = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.extent; })])
            .range([height, 0]);

          var barWidth_loss = width / data_loss_.length;

          var bar = graph.selectAll('g')
            .data(data_loss_)
            .enter()
            .append('g')
            .attr('transform', function(d, i) { return 'translate(' + (i * barWidth_loss) + ', 0)'; });

          bar.append('svg:rect')
            .attr('class', 'bar')
            .attr('y', function(d) { return y_scale_loss(d.loss); })
            .attr('height', function(d) { return height - y_scale_loss(d.loss); })
            .attr('width', barWidth_loss - 1);

          var barWidth_extent = width / data.length;

          var bar2 = graph2.selectAll('g')
            .data(data_extent_)
            .enter()
            .append('g')
            .attr('transform', function(d, i) { return 'translate(' + (i * barWidth_extent) + ', 0)'; });

          bar2.append('svg:rect')
            .attr('class', 'bar extent')
            .attr('y', function(d) { return y_scale_extent(d.value); })
            .attr('height', function(d) { return height - y_scale_extent(d.extent); })
            .attr('width', barWidth_extent - 1);
        });
      }
    },

    _drawYears: function() {
      var markup_years = '';

      for (var y = 2001; y<=2013; y += 1) {
        var y_ = this.x_scale(y);

        if (y === 2001 || y === 2013) {
          y_ -= 5;
        } else {
          y_ -= 0;
        }

        markup_years += '<span class="year" style="left:'+y_+'px">'+y+'</span>';
      }

      this.$years.html(markup_years);
    },

    _drawGraph: function() {
      var that = this;

      var w = this.w,
          h = this.h,
          vertical_m = this.vertical_m,
          m = this.m,
          x_scale = this.x_scale,
          thresh = this.helper.config.canopy_choice || 30;

      var grid_scale = d3.scale.linear()
        .range([vertical_m, h-vertical_m])
        .domain([1, 0]);

      d3.select('#chart').remove();

      var svg = d3.select('.overview_graph__area')
        .append('svg:svg')
        .attr('id', 'chart')
        .attr('width', w)
        .attr('height', h);

      // grid
      svg.selectAll('line.grid_h')
        .data(grid_scale.ticks(4))
        .enter()
        .append('line')
        .attr({
          'class': 'grid grid_h',
          'x1': 0,
          'x2': w,
          'y1': function(d, i) { return grid_scale(d); },
          'y2': function(d, i) { return grid_scale(d); }
        });

      svg.selectAll('line.grid_v')
        .data(x_scale.ticks(12))
        .enter()
        .append('line')
        .attr({
          'class': 'grid grid_v',
          'y1': h,
          'y2': 0,
          'x1': function(d) { return x_scale(d); },
          'x2': function(d) { return x_scale(d); }
        });

      var gradient = svg.append('svg:defs')
        .append('svg:linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');

      gradient.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#CA46FF')
        .attr('stop-opacity', .5);

      gradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#D24DFF')
        .attr('stop-opacity', 1);

      if (this.model.get('graph') === 'total_loss') {
        this._showYears();

        svg.append('text')
          .attr('class', 'axis notranslate')
          .attr('id', 'axis_y')
          .text('Tree cover loss (Mha)')
          .attr('x', -h/2)
          .attr('y', 30)
          .attr('transform', 'rotate(-90)');

        var sql = 'SELECT year, \
             Sum(loss) loss, \
             Sum(gain) gain \
              FROM   umd_nat_final  \
              WHERE  thresh = '+ (this.helper.config.canopy_choice || 30) +'  \
                      AND year > 2000 \
              GROUP  BY year  \
              ORDER  BY year ';
        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, _.bind(function(error, json) {
          var data = json.rows;

          var data_ = data,
              gain = data[0].gain;

          var y_scale = d3.scale.linear()
            .range([vertical_m, h-vertical_m])
            .domain([d3.max(data_, function(d) { return d.loss; }), 0]);

          // area
          var area = d3.svg.area()
            .x(function(d) { return x_scale(d.year); })
            .y0(h)
            .y1(function(d) { return y_scale(d.loss); });

          svg.append('path')
            .datum(data_)
            .attr('class', 'area')
            .attr('d', area)
            .style('fill', 'rgba(239,66,147,0.5)');

          // circles
          svg.selectAll('circle')
            .data(data_)
            .enter()
            .append('svg:circle')
            .attr('class', 'linedot')
            .attr('cx', function(d) {
              return x_scale(d.year);
            })
            .attr('cy', function(d){
              return y_scale(d.loss);
            })
            .attr('r', 6)
            .attr('name', _.bind(function(d) {
              return '<span>'+d.year+'</span>'+this.helper.formatNumber(parseFloat(d.loss/1000000).toFixed(1))+' Mha';
            }, this ))
            .on('mouseover', function(d) {
              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', $(this).offset().top-100+'px')
                .style('left', $(this).offset().left-$('.tooltip2').width()/2-4+'px')
                .attr('class', 'tooltip2');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 7);

              // TODO: highlighting the legend
            })
            .on('mouseout', function(d) {
              that.tooltip.style('visibility', 'hidden');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 6);

              // TODO: highlighting the legend
            });

          var data_gain_ = [
            {
              year: 2001,
              value: gain
            },
            {
              year: 2013,
              value: gain
            }
          ];
        }, this ));
      } else if (this.model.get('graph') === 'percent_loss') {
        this._showYears();

        svg.append('text')
          .attr('class', 'axis')
          .attr('id', 'axis_y')
          .text('%')
          .attr('x', -h/2)
          .attr('y', 30)
          .attr('transform', 'rotate(-90)');

        var sql = 'SELECT year, \
                    Sum(gain) / Sum(extent_offset) ratio_gain,  \
                    Sum(loss) / Sum(extent_offset)  ratio_loss  \
                  FROM   umd_nat  \
                  WHERE  thresh = '+ (this.helper.config.canopy_choice || 30) +' \
                         AND year > 2000  \
                  GROUP  BY year ORDER BY year ';

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
          var data = json.rows;
          var data_ = data,
              gain = data[0].ratio_gain;

          var y_scale = grid_scale;

          // area
          var area = d3.svg.area()
            .x(function(d) { return x_scale(d.year); })
            .y0(h)
            .y1(function(d) { return y_scale(d.ratio_loss*100); });

          svg.append('path')
            .datum(data_)
            .attr('class', 'area')
            .attr('d', area)
            .style('fill', 'rgba(239,66,147,0.5)');

          // circles
          svg.selectAll('circle')
            .data(data_)
            .enter()
            .append('svg:circle')
            .attr('class', 'linedot')
            .attr('cx', function(d) {
              return x_scale(d.year);
            })
            .attr('cy', function(d){
              return y_scale(d.ratio_loss*100);
            })
            .attr('r', 6)
            .attr('name', function(d) {
              return '<span>'+d.year+'</span>'+parseFloat(d.ratio_loss*100).toFixed(2)+' %';
            })
            .on('mouseover', function(d) {
              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', $(this).offset().top-100+'px')
                .style('left', $(this).offset().left-$('.tooltip2').width()/2-4+'px')
                .attr('class', 'tooltip2');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 7);

              // TODO: highlighting the legend
            })
            .on('mouseout', function(d) {
              that.tooltip.style('visibility', 'hidden');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 6);

              // TODO: highlighting the legend
            });

          var data_gain_ = [
            {
              year: 2001,
              value: gain
            },
            {
              year: 2012,
              value: gain
            }
          ];

          // line
          svg.selectAll('line.overview_line')
            .data([data_gain_[0]])
            .enter()
            .append('line')
            .attr({
              'class': 'overview_line',
              'x1': m,
              'x2': w-m,
              'y1': function(d) { return y_scale(gain*100); },
              'y2': function(d) { return y_scale(gain*100); }
            })
            .attr('cx', function(d) {
              return x_scale(d.year);
            })
            .attr('cy', function(d){
              return y_scale(gain*100);
            })
            .attr('r', 6)
            .attr('name', function(d) {
              return '<span>2001-2012</span>'+parseFloat(gain*100).toFixed(2)+' %';
            })
            .on('mouseover', function(d) {
              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', $(this).offset().top-100+'px')
                .style('left', ($(this).offset().left + 436) +'px')
                .attr('class', 'tooltip2 gain_tooltip');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 7);

              // TODO: highlighting the legend
            })
            .on('mouseout', function(d) {
              that.tooltip.style('visibility', 'hidden');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 6);

              // TODO: highlighting the legend
            });
        });
      } else if (this.model.get('graph') === 'total_extent') {
        this._showYears();

        svg.append('text')
          .attr('class', 'axis')
          .attr('id', 'axis_y')
          .text('Mha')
          .attr('x', -h/2)
          .attr('y', 30)
          .attr('transform', 'rotate(-90)');

        var gradient_extent = svg.append('svg:defs')
          .append('svg:linearGradient')
          .attr('id', 'gradient_extent')
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '0%')
          .attr('y2', '100%')
          .attr('spreadMethod', 'pad');

        gradient_extent.append('svg:stop')
          .attr('offset', '0%')
          .attr('stop-color', '#98BD17')
          .attr('stop-opacity', .5);

        gradient_extent.append('svg:stop')
          .attr('offset', '100%')
          .attr('stop-color', '#98BD17')
          .attr('stop-opacity', 1);

        var sql = 'SELECT year, \
                    Sum(loss)   loss,  \
                    Sum(extent_offset) extent  \
                    FROM   umd_nat  \
                    WHERE  thresh = '+ (this.helper.config.canopy_choice || 30) +'  \
                           AND year > 2000  \
                    GROUP  BY year  \
                    ORDER BY year';

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), _.bind(function(json) {
          var data = json.rows;

          var data_ = data,
              data_loss_ = [],
              data_extent_ = [];

          var domain = [d3.max(data_, function(d) { return d.extent; }), 0];

          var y_scale = d3.scale.linear()
            .range([vertical_m, h-vertical_m])
            .domain(domain);

          // area
          var area_loss = d3.svg.area()
            .x(function(d) { return x_scale(d.year); })
            .y0(h)
            .y1(function(d) { return y_scale(d.loss); });

          var area_extent = d3.svg.area()
            .x(function(d) { return x_scale(d.year); })
            .y0(function(d) { return y_scale(d.extent); })
            .y1(function(d) { return y_scale(d.loss); });

          svg.append('path')
            .datum(data_)
            .attr('class', 'area')
            .attr('d', area_loss)
            .style('fill', 'rgba(239,66,147,0.5)');

          svg.append('path')
            .datum(data_)
            .attr('class', 'area')
            .attr('d', area_extent)
            .style('fill', 'url(#gradient_extent)')
            .style('opacity', '0.35');

          // circles
          svg.selectAll('circle')
            .data(data_)
            .enter()
            .append('svg:circle')
            .attr('class', 'linedot')
            .attr('cx', function(d) {
              return x_scale(d.year);
            })
            .attr('cy', function(d){
              return y_scale(d.loss);
            })
            .attr('r', 6)
            .attr('name', _.bind(function(d) {
              return '<span>'+d.year+'</span>'+this.helper.formatNumber(parseFloat(d.loss/1000000).toFixed(1))+' Mha';
            }, this ))
            .on('mouseover', function(d) {
              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', $(this).offset().top-100+'px')
                .style('left', $(this).offset().left-$('.tooltip2').width()/2-4+'px')
                .attr('class', 'tooltip2');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 7);

              // TODO: highlighting the legend
            })
            .on('mouseout', function(d) {
              that.tooltip.style('visibility', 'hidden');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 6);

              // TODO: highlighting the legend
            });

          svg.selectAll('circle.gain')
            .data(data_)
            .enter()
            .append('svg:circle')
            .attr('class', 'linedot gain')
            if ( $('.graph_tab.selected').data('slug') === 'total_extent' ) {
              svg.selectAll('circle.gain').attr('class', 'linedot gain extent')
            }
            svg.selectAll('circle.gain').attr('cx', function(d) {
              return x_scale(d.year);
            })
            .attr('cy', function(d){
              return y_scale(d.extent);
            })
            .attr('r', 6)
            .attr('name', _.bind(function(d) {
              return '<span>'+d.year+'</span>'+this.helper.formatNumber(parseFloat(d.extent/1000000).toFixed(1))+' Mha';
            }, this))
            .on('mouseover', function(d) {
              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', $(this).offset().top-100+'px')
                .style('left', $(this).offset().left-$('.tooltip2').width()/2-4+'px')
                if ( $('.graph_tab.selected').data('slug') === 'total_extent' ) {
                  that.tooltip.html($(this).attr('name')).attr('class', 'tooltip2 gain_extent_tooltip');
                } else {
                  $('.linedot.gain').removeClass('extent');
                  that.tooltip.html($(this).attr('name')).attr('class', 'tooltip2 gain_tooltip');
                }

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 7);

              // TODO: highlighting the legend
            })
            .on('mouseout', function(d) {
              that.tooltip.style('visibility', 'hidden');

              d3.select(this)
                .transition()
                .duration(100)
                .attr('r', 6);

              // TODO: highlighting the legend
            });
        }, this ));
      } else if (this.model.get('graph') === 'ratio') {
        this._hideYears();

        svg.append('text')
          .attr('class', 'axis light')
          .attr('id', 'axis_y')
          .text('Ratio of tree cover loss to gain 2001-2012')
          .attr('x', -(h/2)-60)
          .attr('y', 30)
          .attr('transform', 'rotate(-90)');

        svg.append('text')
          .attr('class', 'axis light')
          .attr('id', 'axis_ratio')
          .text('1')
          .attr('x', 25)
          .attr('y', h-60);

        var shadow = svg.append('svg:defs')
          .append('svg:filter')
          .attr('id', 'shadow')
          .attr('x', '0%')
          .attr('y', '0%')
          .attr('width', '200%')
          .attr('height', '200%');

        shadow.append('svg:feOffset')
          .attr('result', 'offOut')
          .attr('in', 'SourceAlpha')
          .attr('dx', 0)
          .attr('dy', 0);

        shadow.append('svg:feGaussianBlur')
          .attr('result', 'blurOut')
          .attr('in', 'offOut')
          .attr('stdDeviation', 1);

        shadow.append('svg:feBlend')
          .attr('in', 'SourceGraphic')
          .attr('in2', 'blurOut')
          .attr('mode', 'normal');

        var sql = 'WITH e AS \
                    (  \
                           SELECT iso,  \
                                  extent  \
                           FROM   umd_nat  \
                           WHERE  thresh = '+ (this.helper.config.canopy_choice || 30) +'  \
                           AND    year = 2012), u AS  \
                    (  \
                             SELECT   iso,  \
                                      Sum(loss) sum_loss,  \
                                      Sum(gain) sum_gain  \
                             FROM     umd_nat  \
                             WHERE    thresh = '+ (this.helper.config.canopy_choice || 30) +'  \
                             GROUP BY iso)  \
                    SELECT   c.iso,  \
                             c.NAME,  \
                             c.enabled, \
                             u.sum_loss,  \
                             u.sum_gain,  \
                             u.sum_loss / u.sum_gain ratio,  \
                             e.extent  \
                    FROM     gfw2_countries c,  \
                             u,  \
                             e  \
                    WHERE    u.sum_gain IS NOT NULL  \
                    AND      NOT u.sum_gain = 0  \
                    AND      c.iso = u.iso  \
                    AND      e.iso = u.iso  \
                    ORDER BY u.sum_loss DESC limit 50';

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+encodeURIComponent(sql), function(json) {
          var data = json.rows;

          var log_m = 50;

          var x_log_scale = d3.scale.log()
            .range([m, w-m])
            .domain([d3.min(data, function(d) { return d.extent; }), d3.max(data, function(d) { return d.extent; })]);

          var y_log_scale = d3.scale.log()
            .range([h-log_m, m])
            .domain([d3.min(data, function(d) { return d.ratio; }), d3.max(data, function(d) { return d.ratio; })]);

          var color_scale = d3.scale.linear()
            .domain([d3.min(data, function(d) { return d.ratio; }), 1, 10, d3.max(data, function(d) { return d.ratio; })])
            //.range(["#9ABF00", "#9ABF00", "#CA46FF", "#CA46FF"]);
            .range(["#6D6DE5", "#6D6DE5", "#FF6699", "#FF6699"]);

          // line
          svg.selectAll('line.linear_regression')
            .data([1])
            .enter()
            .append('line')
            .attr({
              'class': 'linear_regression',
              'x1': m,
              'x2': w-m,
              'y1': function(d) { return y_log_scale(d); },
              'y2': function(d) { return y_log_scale(d); },
              "stroke-width": 1.3,
              "stroke": "white",
              "stroke-dasharray": "7,5"
            });

          // circles w/ magic numbers :(
          var circle_attr = {
            'cx': function(d) { return x_log_scale(d.extent) },
            'cy': function(d) { return y_log_scale(d.ratio) },
            'r': 5,
            'name': function(d) { return d.name; },
            'class': function(d) { return d.enabled ? 'ball ball_link' : 'ball ball_nolink'; }
          };

          var data_ = [],
              data_link_ = [],
              exclude = [];

          _.each(data, function(row) {
            if (!_.contains(exclude, row.name)) {
              if (row.enabled === true) {
                data_link_.push(row);
              } else {
                data_.push(row);
              }
            }
          });

          var circles_link = svg.selectAll('circle.ball_link')
            .data(data_link_)
            .enter()
            .append('a')
            .attr('xlink:href', function(d) { return '/country/' + d.iso})
            .append('svg:circle')
            .attr(circle_attr)
            .style('fill', function(d) {
              return color_scale(d.ratio);
            })
            .style('filter', 'url(#shadow)')
            .on('mouseover', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', 7)
                .style('opacity', 1);

              var t = $(this).offset().top - 80,
                  l = $(this).offset().left,
                  r = $(this).attr('r'),
                  tip = $('.tooltip2').width()/2;

              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', parseInt(t, 10)+'px')
                .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
                .attr('class', 'tooltip2 gain_tooltip');
            })
            .on('mouseenter', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', 7)
                .style('opacity', 1);

              var t = $(this).offset().top - 80,
                  l = $(this).offset().left,
                  r = $(this).attr('r'),
                  tip = $('.tooltip2').width()/2;

              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', parseInt(t, 10)+'px')
                .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)+'px')
                .attr('class', 'tooltip2 gain_tooltip');
            })
            .on('mouseout', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', 5)
                .style('opacity', .8);

              that.tooltip.style('visibility', 'hidden');
            });

          var circles = svg.selectAll('circle.ball_nolink')
            .data(data_)
            .enter()
            .append('svg:circle')
            .attr(circle_attr)
            .style('fill', function(d) {
              return color_scale(d.ratio);
            })
            .style('filter', 'url(#shadow)')
            .on('mouseover', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', 7)
                .style('opacity', 1);

              var t = $(this).offset().top - 80,
                  l = $(this).offset().left,
                  r = $(this).attr('r'),
                  tip = $('.tooltip2').width()/2;

              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', parseInt(t, 10)+'px')
                .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
                .attr('class', 'tooltip2 gain_tooltip');
            })
            .on('mouseenter', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', 7)
                .style('opacity', 1);

              var t = $(this).offset().top - 80,
                  l = $(this).offset().left,
                  r = $(this).attr('r'),
                  tip = $('.tooltip2').width()/2;

              that.tooltip.html($(this).attr('name'))
                .style('visibility', 'visible')
                .style('top', parseInt(t, 10)+'px')
                .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)+'px')
                .attr('class', 'tooltip2 gain_tooltip');
            })
            .on('mouseout', function() {
              d3.select(d3.event.target)
                .transition()
                .attr('r', 5)
                .style('opacity', .8);

              that.tooltip.style('visibility', 'hidden');
            });
        });
      } else if (this.model.get('graph') === 'domains') {
        this._showYears();

        var sql = 'SELECT name, ';

        for(var y = 2001; y < 2012; y++) {
          sql += 'y'+y+', '
        }

        sql += 'y2012, GREATEST('

        for(var y = 2001; y < 2012; y++) {
          sql += 'y'+y+', '
        }

        sql += 'y2012) as max\
                FROM countries_domains';

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, _.bind(function(error, json) {
          var data = json.rows;

          var r_scale = d3.scale.linear()
            .range([5, 30]) // max ball radius
            .domain([0, d3.max(data, function(d) { return d.max; })])

          for(var j = 0; j < data.length; j++) {
            var data_ = [],
                domain = '';

            _.each(data[j], function(val, key) {
              if (key !== 'max') {
                if (key === 'name') {
                  domain = val.toLowerCase();
                } else {
                  data_.push({
                    'year': key.replace('y',''),
                    'value': val
                  });
                }
              }
            });

            svg.append('text')
              .attr('class', 'label')
              .attr('id', 'label_'+domain)
              .text(domain)
              .attr('x', function() {
                var l = x_scale(2002) - $(this).width()/2;

                return l;
              })
              .attr('y', (h/5)*(j+.6));

            var circle_attr = {
              'cx': function(d, i) { return x_scale(2001 + i); },
              'cy': function(d) { return (h/5)*(j+1); },
              'r': function(d) { return r_scale(d.value); },
              'class': function(d) { return 'ball'; }
            };

            svg.selectAll('circle.domain_'+domain)
              .data(data_)
              .enter()
              .append('svg:circle')
              .attr(circle_attr)
              .attr('data-slug', domain)
              .attr('name', _.bind(function(d) {
                return '<span>'+d.year+'</span>'+this.helper.formatNumber(parseFloat(d.value/1000000).toFixed(1))+' Mha';
              }, this ))
              .style('fill', _.bind(function(d) { return this.helper.config.GRAPHCOLORS[domain]; }, this ))
              .on('mouseover', _.bind(function() {
                d3.select(d3.event.target)
                  .transition()
                  .attr('r', function(d) { return circle_attr.r(d) + 2; })
                  .style('opacity', 1);

                var t = $(this).offset().top - 100,
                    l = $(this).offset().left,
                    r = $(this).attr('r'),
                    tip = $('.tooltip2').width()/2,
                    slug = $(this).attr('data-slug');

                that.tooltip.html($(this).attr('name'))
                  .style('visibility', 'visible')
                  .style('top', parseInt(t, 10)+'px')
                  .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
                  .attr('class', 'tooltip2')
                  .attr('data-slug', 'tooltip2')
                  .style('color', _.bind(function() {
                    if (slug === 'subtropical') {
                      return '#FFC926'
                    } else {
                      return this.helper.config.GRAPHCOLORS[slug];
                    }
                  }, this ));
              }, this ))
              .on('mouseenter', _.bind(function() {
                d3.select(d3.event.target)
                  .transition()
                  .attr('r', function(d) { return circle_attr.r(d) + 2; })
                  .style('opacity', 1);

                var t = $(this).offset().top - 80,
                    l = $(this).offset().left,
                    r = $(this).attr('r'),
                    tip = $('.tooltip2').width()/2,
                    slug = $(this).attr('data-slug');

                that.tooltip.html($(this).attr('name'))
                  .style('visibility', 'visible')
                  .style('top', parseInt(t, 10)+'px')
                  .style('left', parseInt(l, 10)+parseInt(r, 10)-parseInt(tip, 10)-10+'px')
                  .attr('class', 'tooltip2')
                  .attr('data-slug', 'tooltip2')
                  .style('color', _.bind(function() {
                    if (domain === 'subtropical') { return this.helper.config.GRAPHCOLORS[domain]; }
                  }, this ));
              }, this ))
              .on('mouseout', function() {
                d3.select(d3.event.target)
                  .transition()
                  .attr('r', function(d) { return circle_attr.r(d); })
                  .style('opacity', .8);

                that.tooltip
                  .style('color', '')
                  .style('visibility', 'hidden');
              });
          }
        }, this ));
      }
    }



  });
  return CountryOverviewView;

});
