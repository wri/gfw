/**
 * The Country Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'd3',
  'mps',
  'countries/views/CountryInfoWindow',
  'countries/views/CountryUmdOptionsView',
  'countries/helpers/CountryHelper',
  'countries/models/CountryShowModel',

], function($, Backbone, _, d3, mps, CountryInfoWindow, CountryUmdOptionsView, CountryHelper, CountryShowModel) {

  'use strict';

  var CountryHeaderStatus = Backbone.Model.extend({});

  var layersOptions = Backbone.Model.extend({

    initialize: function(options) {
      options = options || {};
      this.helper = CountryHelper;
      var threshold = (this.helper.config.canopy_choice) ? this.helper.config.canopy_choice : 30;
      var layers = {
        'forest2000': {
          url: 'http://earthengine.google.org/static/hansen_2014/gfw_loss_tree_year_' + threshold + '_2014/%z/%x/%y.png',
          dataMaxZoom: 12,
          tileSize: [256, 256],
          _filterCanvasImage: function(imageData, w, h) {
            var components = 4; //rgba
            var pixel_pos;

            for(var i=0; i < w; ++i) {
              for(var j=0; j < h; ++j) {
                var pixel_pos = (j*w + i) * components;
                var intensity = imageData[pixel_pos+1];
                imageData[pixel_pos] = 151;
                imageData[pixel_pos + 1] = 189;
                imageData[pixel_pos + 2] = 61;
                imageData[pixel_pos + 3] = intensity*0.8;
              }
            }
          }
        }
      };

      var self = this,
          layer = layers[options.layer];

      if (layer) {
        _.each(layer, function(row, i) {
          self.set(i, row);
        })
      }
    },


  });

  var leafletCanvasLayer = Backbone.View.extend({

    initialize: function(options) {
      var self = this;
      options = options || {layerName: '', mapOptions: {}};

      this.layerOptions = new layersOptions({layer: options.layerName});
      _.extend(this, this.layerOptions.toJSON());

      this.layer = L.tileLayer.canvas(options.mapOptions);

      this.layer.drawTile = function(canvas, tilePoint, zoom) {
        var xhr = new XMLHttpRequest(),
            ctx = canvas.getContext('2d');

        var x = tilePoint.x,
            y = tilePoint.y,
            z = zoom,
            mz = self.dataMaxZoom;

        if (zoom > mz) {
          x = Math.floor(x / (Math.pow(2, zoom - mz)));
          y = Math.floor(y / (Math.pow(2, zoom - mz)));
          z = mz;
        } else {
          y = (y > Math.pow(2, z) ? y % Math.pow(2,z) : y);
          if (x >= Math.pow(2, z)) {
            x = x % Math.pow(2, z);
          } else if (x < 0) {
            x = Math.pow(2,z) - Math.abs(x);
          }
        }

        var url = self.url.replace('%z', z).replace('%x', x).replace('%y', y);

        xhr.onload = function () {
          var url = URL.createObjectURL(this.response),
              image = new Image();

          image.onload = function () {
            image.crossOrigin = '';

            canvas.image = image;
            canvas.coord = {x: tilePoint.x, y: tilePoint.y};
            canvas.coord.z = zoom;

            self._drawImageCanvas(canvas);

            URL.revokeObjectURL(url);
          };

          image.src = url;
        };

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.send();
      }
    },

    _filterCanvasImage: function(imageData, w, h) {
    },

    _drawImageCanvas: function(canvas) {
      var ctx = canvas.getContext('2d'),
          coord = canvas.coord;

      if (canvas.coord) {
        var zsteps = coord.z - this.dataMaxZoom;

        if (zsteps > 0) {
          ctx['imageSmoothingEnabled'] = false;
          ctx['mozImageSmoothingEnabled'] = false;
          ctx['webkitImageSmoothingEnabled'] = false;

          var srcX = 256 / Math.pow(2, zsteps) * (coord.x % Math.pow(2, zsteps)),
              srcY = 256 / Math.pow(2, zsteps) * (coord.y % Math.pow(2, zsteps)),
              srcW = 256 / Math.pow(2, zsteps),
              srcH = 256 / Math.pow(2, zsteps);
          ctx.clearRect(0, 0, 256, 256);
          ctx.drawImage(canvas.image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);

        } else {
          try {
            ctx.drawImage(canvas.image, 0, 0);
          } catch(err) { }
        }

        var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this._filterCanvasImage(I.data, canvas.width, canvas.height);
        ctx.putImageData(I, 0, 0);
      }
    },

    getLayer: function() {
      return this.layer;
    },

    reload: function(){

    }

  });

  var CountryHeader = Backbone.View.extend({

    el: $('.country-header, .country-overview-wrapper-coolio'),

    events: {
      'change #areaSelector': '_onSelectArea',
      'click .selector-remove': '_navigateCountry',
      'click .umd_options_control' : '_onClickUMDOptions',
      'click .item.settings' : '_onClickUMDOptions',
      'click .country-header .umdoptions_dialog #canopy_slider':  '_updateMapThreshold',
      'mouseup .country-header .umdoptions_dialog #canopy_slider':  '_updateMapThreshold',
      'click .country-header .umdoptions_dialog ul li':  '_updateMapThreshold'
    },

    initialize: function(options) {
      _.extend(this, options);
      var self = this;
      self.helper = CountryHelper;


      _.bindAll(this, '_cartodbLayerDone');
      // Cache
      this.$areaSelector = this.$('#areaSelector');
      this.$selectorRemove =  this.$('.selector-remove');
      this.$map = this.$('.map');
      this.UmdOptions;
      this.setListeners();

      var Router = Backbone.Router.extend({
        routes: {
          'country/:id': 'loadCountry',
          'country/:id/': 'loadCountry',
          'country/:id/:areaId': 'loadArea',
          'country/:id/:areaId/': 'loadArea',
          'embed/country/:id': 'loadCountry',
          'embed/country/:id/': 'loadCountry',
          'embed/country/:id/:areaId': 'loadArea',
          'embed/country/:id/:areaId/': 'loadArea',
          'embed/country_info/:id/:box': 'loadBox',
          'embed/country_info/:id/:box/': 'loadBox'
        },

        initialize: function() {
          //self._drawLossAndGain(); //it's called from _updateData
        },

        loadArea: function(countryId, areaId) {
          var area = self.country.get('areas').where({ id_1: Number(areaId) })[0];
          self.area = area;

          if (!self.map) {
            self._setAreaSelector();
            self._initMap(function() {
              self._displayArea(area);
            });
          } else {
            self._displayArea(area);
          }
          if ($('body').hasClass('embed')) {
            setTimeout(function(){ $('.country-title').find('h1').append(': '+self.$areaSelector.val()) },250);
          }
          self._updateData(areaId);
        },

        loadCountry: function(countryId) {
          if (!self.map) {
            self._setAreaSelector();
            self._initMap(function() {
              self._displayCountry();
            });
          } else {
            self._displayCountry();
          }
          self._updateData();
        },

        loadBox: function(countryId, box) {
          var target = $('.country-' + box);

          target.find('.info').remove();
          target.fadeIn()
        }

      });
      if (this.country){
        this.country.fetch({
          success: function() {
            Backbone.history.start({pushState: true});
          }
        });
        self.router = new Router();
        if ($('body').hasClass('embed')) {
          $('.umd_options_control').on('click', function(){
            self._onClickUMDOptions(null, '.country-preview');
          })
        }
      }
    },
    setListeners: function(){
      mps.subscribe('Threshold:change', _.bind(function(threshold){
        this.helper.config.canopy_choice = threshold;
        this._updateMapThreshold();
      }, this ));
    },

    _setAreaSelector: function() {
      var self = this;
      _.each(this.country.get('areas').models, function(area, i) {
        if (self.area == area) {
          self.$areaSelector.append('<option class="dark" value="' + area.get('name_1') + '" selected>' + area.get('name_1') + '</option>')
        } else {
          self.$areaSelector.append('<option class="dark" value="' + area.get('name_1') + '">' + area.get('name_1') + '</option>')
        }
      });

      ga('send', 'event', 'Country show', 'Click', 'Change Area');
    },

    _onClickUMDOptions: function(e,tar_param) {
      e && e.preventDefault();

      if ($(e.currentTarget).data('target')) {
        tar_param = $(e.currentTarget).data('target');
      }
      var $target = $('.umdoptions_dialog'),
          tar_param  = tar_param || '.country-sidenav';
      if ($target.length === 0) this.UmdOptions = new CountryUmdOptionsView({ target: tar_param});
      if ($target.is(':visible') ) {
        this.UmdOptions.hide();
      } else {
        this.UmdOptions._openUMDoptions();
      }
    },

    _updateMapThreshold: function(e) {
      var path = location.pathname.split('/');
      var id = path[path.length -1];
      var self = this;
      if(this.map){
        this.map.remove()
        if (isNaN(id)) {
          this._initMap(function() {
            self._displayCountry();
          });
          id = false;
        } else {
          var area = this.country.get('areas').where({ id_1: Number(id) })[0];
          this._initMap(function() {
            self._displayArea(area);
          });
        }
        this._updateData(id);
      }
    },

    _onSelectArea: function() {
      var self = this,
          areaName = this.$areaSelector.val(),
          area = this.country.get('areas').where({ name_1: areaName })[0];

      if (area) {
        this.router.navigate('country/' + this.country.get('iso') + '/' + String(area.get('id_1')), {trigger: true});
        this.$el.find('#url_analysis').attr('href', '/map/6/'+ area.attributes.bounds._northEast.lat + '/'+ area.attributes.bounds._northEast.lng + '/'+ area.attributes.iso + '-' + String(area.get('id_1')) +'/grayscale/loss,forestgain?begin=2001-01-01&end=2013-12-30&threshold='+(this.helper.config.canopy_choice || 30));
      } else {
        this._navigateCountry();
      }
      this._updateData(  (area) ? area.get('id_1') : null )
    },

    _navigateCountry: function() {
      this.router.navigate('country/' + this.country.get('iso'), {trigger: true});
      this.$el.find('#url_analysis').attr('href', '/map/5/0/0/'+ this.country.get('iso') +'/grayscale/loss,forestgain?begin=2001-01-01&end=2012-12-30&threshold='+(this.helper.config.canopy_choice || 30));
    },

    _initMap: function(callback) {
      var self = this,
          sql = new cartodb.SQL({ user: 'wri-01' });

      sql.execute("SELECT bounds FROM country_mask WHERE code = '" + this.country.get('iso')  + "'")
        .done(function(data) {
          var geojson = L.geoJson(JSON.parse(data.rows[0].bounds)),
              bounds = geojson.getBounds();

          self.country.set('bounds', bounds);
          self._renderMap(callback);
        });
    },

    roundNumbers : function(number){
      var num = parseInt(number.replace(/,/g , ''));
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    },

    _updateData: function(area_id) {
      var url     = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/' + this.country.get('iso'),
          canopy  = this.helper.config.canopy_choice || 30,
          $cnp_op = $('.umd_options_control').find('.sidenav-icon'),
          $target = $('.tree-numbers'),
          that    = this;

      if (area_id) {
        url = url + '/' +area_id + '?thresh=' + canopy;
      } else {
        url = url + '?thresh=' + canopy;
      }

      if (canopy != 30) $cnp_op.addClass('no_def');
      else $cnp_op.removeClass('no_def');

      $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
          var amount = data.years[0].extent;

          if (amount.toString().length >= 7) {
            amount = Math.round((amount /1000)/1000)
            $target.find('.tree-cover .unit').html( 'MHa' );
          } else if (amount.toString().length >= 4) {
            $target.find('.tree-cover .unit').html( 'KHa' );
            amount = Math.round(amount /1000);
          if (amount % 1 != 0) amount = Math.round(amount)
          } else {
            $target.find('.tree-cover .unit').html( 'Ha' );
          }

          $target.find('.tree-cover .amount').html( amount.toLocaleString() );
          $target.find('.total-area .amount').html(Math.round(data.years[0].extent_perc));

          that._drawLossAndGain(data.years);
          var $link_target = [];
              $link_target[0] = $('.analyze_from_country');
              $link_target[1] = $link_target[0] .attr('href');
          if (isNaN($link_target[1].slice(-2))) {
            $link_target[1] = $link_target[1] + canopy;
          } else {
            $link_target[1] = $link_target[1].substring(0, $link_target[1].length - 2) + canopy;
          }
          $link_target[0].attr('href', $link_target[1]);
        },
        error: function(status, error) {
          $target.find('.tree-cover .amount').html( 'N/A' );
          $target.find('.total-area .amount').html( 'N/A' );

          that._drawLossAndGain();
        }
      });
    },

    _renderMap: function(callback) {
      var self = this;

      this.map = new L.Map('countryMap', {
        center: [0, 0],
        zoom: 3,
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        attributionControl: false,
        zoomAnimation: false,
        fadeAnimation: false,
      });

      this.forestLayer = new leafletCanvasLayer({
        layerName: 'forest2000',
        mapOptions: {
          opacity: 0
        }
      }).getLayer().addTo(this.map);

      callback && callback();
    },

    _removeCartodblayer: function() {
      if (this.cartodbLayer) {
        this.cartodbLayer.remove();
      }
    },

    _displayCountry: function() {
      var self = this;

      this.map.fitBounds(this.country.get('bounds'));
      this._removeCartodblayer();

      this.$selectorRemove.hide();
      this.$areaSelector.val('default');

      cartodb.createLayer(this.map, {
        user_name: 'wri-01',
        type: 'cartodb',
        cartodb_logo: false,
        sublayers: [{
          sql: "SELECT * FROM country_mask",
          cartocss: "\
            #country_mask {\
              polygon-fill: #333;\
              polygon-opacity: 1;\
              line-color: #333;\
              line-width: 1;\
              line-opacity: 1;\
            }\
            #country_mask[code='" + this.country.get('iso') + "'] {\
              polygon-opacity: 0;\
              line-color: #73707D;\
              line-width: 1;\
              line-opacity: 1;\
            }"
        }]
      })
      .addTo(this.map)
      .done(this._cartodbLayerDone);
    },

    _displayArea: function(area) {
      var self = this;
      this.$el.find('#url_analysis').attr('href', '/map/6/'+ area.attributes.bounds._northEast.lat + '/'+ area.attributes.bounds._northEast.lng + '/'+ area.attributes.iso + '-' + String(area.get('id_1')) +'/grayscale/loss,forestgain?begin=2001-01-01&end=2013-12-30&threshold='+(this.helper.config.canopy_choice || 30));
      this.map.fitBounds(area.get('bounds'), {reset: true});
      this._removeCartodblayer();

      this.$selectorRemove.show();

      cartodb.createLayer(this.map, {
        user_name: 'wri-01',
        type: 'cartodb',
        cartodb_logo: false,
        sublayers: [{
          sql: "SELECT * FROM country_mask",
          cartocss: "\
            #country_mask {\
              polygon-fill: #333;\
              polygon-opacity: 1;\
              line-color: #333;\
              line-width: 1;\
              line-opacity: 1;\
            }\
            #country_mask[code='" + this.country.get('iso') + "'] {\
              polygon-opacity: 0;\
              line-color: #333;\
              line-width: 1;\
              line-opacity: 1;\
            }"
        }, {
          sql: "SELECT * FROM gadm_1_all",
          cartocss: "\
            #gadm_1_all {\
              polygon-fill: #333;\
              polygon-opacity: 1;\
              line-color: #333;\
              line-width: 1;\
              line-opacity: 1;\
              [cartodb_id=" + area.get('cartodb_id') + "]{\
                polygon-opacity: 0;\
              }\
              ::active[cartodb_id=" + area.get('cartodb_id') + "] {\
                polygon-opacity: 0;\
                line-color: #73707D;\
                line-width: 1;\
                line-opacity: 1;\
              }\
            }"
        }]
      })
      .addTo(this.map)
      .done(this._cartodbLayerDone);
    },

    _cartodbLayerDone: function(layer) {
      var self = this;

      this.cartodbLayer = layer;

      this.cartodbLayer.on('loading' , function() {
        self.$map.removeClass('loaded');
        self.forestLayer.setOpacity(0);
      });

      this.cartodbLayer.on('load' , function() {
        self.$map.addClass('loaded');
        self.forestLayer.setOpacity(1);
      });
    },

    _drawLossAndGain: function(years_data) {
      var sql = "SELECT year, loss_gt_0 loss FROM umd WHERE iso='" + this.country.get('iso') + "' ORDER BY year ASC",
          that = this;

      var $graph = this.$('.loss-gain-graph'),
          $comingSoon = $graph.find('.coming-soon'),
          $amount = $graph.find('.graph-amount'),
          $date = $graph.find('.graph-date');

      var width     = 200,
          height    = 90,
          h         = 90, // maxHeight
          radius    = width / 2;

      d3.select(".loss-gain-graph svg")
            .remove(); //clear the d3 object due to allow reprinting
      var graph = d3.select('.loss-gain-graph .graph')
        .append('svg:svg')
        .attr('width', width)
        .attr('height', height);

      $graph.removeClass('ghost');
      var data = years_data;
      var data_ = [];

      _.each(data, function(val, key) {
        if (val.year >= 2001) {
          data_.push({
            'year': val.year,
            'value': val.loss//eval('val.' + options.dataset)
          });
        }
      });

      $amount.html('<span>' + that.helper.formatNumber(parseInt(data_[data_.length - 1].value, 10)) + '</span>');
      $date.html('Hectares lost in ' + data_[data_.length - 1].year);

      var marginLeft = 5,
          marginTop = 0;

      var y_scale = d3.scale.linear()
        .domain([0, d3.max(data_, function(d) { return parseFloat(d.value); })])
        .range([height, marginTop * 2]);

      var barWidth = 16;

      var bar = graph.selectAll('g')
        .data(data_)
        .enter()
        .append('g')
        .attr('transform', function(d, i) { return 'translate(' + (marginLeft + i * barWidth) + ',' + -marginTop + ')'; });

      bar.append('svg:rect')
        .attr('class', 'bar')
        .attr('y', function(d) { return y_scale(d.value); })
        .attr('height', function(d) { return height - y_scale(d.value); })
        .attr('width', barWidth - 2)
        .style('fill', function(d, i) {
          if (i === 11) {
            return '#9FBA2B';
          } else {
            return '#555';
          }
        })
        .on('mouseover', function(d) {
          d3.selectAll('.bar').style('fill', '#555');
          d3.select(this).style('fill', '#9FBA2B');

          $amount.html('<span>' + that.helper.formatNumber(parseInt(d.value, 10)) + '</span>');
          $date.html('Hectares lost in ' + d.year);
        });

      // Draw gain line
      var gainAverage = years_data[1].gain;

      var tooltip = d3.select('.loss-gain-graph')
        .append('div')
        .attr('class', 'gain-tooltip')
        .style('visibility', 'hidden')
        .text(that.helper.formatNumber(parseInt(gainAverage), 10));

      tooltip
        .append('span')
        .text('Average Ha of gain/year');

      var gainLine = graph.append('svg:rect')
        .attr('class', 'gain-line')
        .attr('x', 0)
        .attr('y', Math.abs(y_scale(gainAverage)))
        .attr('height', 1)
        .attr('width', width)
        .style('stroke', 'transparent')
        .style("stroke-width", "3")
        .style('fill', '#ccc');

      gainLine
        .on('mousemove', function() {
          d3.select('.gain-line')
            .style('height', 2)
            .style('fill', 'white');

          tooltip
            .style('visibility', 'visible')
            .style("top", Math.abs(y_scale(gainAverage)) + "px")
            .style("left", (d3.mouse(this)[0] - 58) + "px");
        })
        .on('mouseout', function() {
          d3.select('.gain-line')
            .style('height', 1)
            .style('fill', '#ccc');

          tooltip.style('visibility', 'hidden');
        })
    }

  });

  return CountryHeader;

});

