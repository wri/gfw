/**
 * The Sentinel layer module for use on canvas.
 *
 * @return SentinelLayer class (extends CartoDBLayerClass)
 */
define(
  [
    'abstract/layer/ImageLayerClass',
    'uri',
    'moment',
    'map/views/layers/CustomInfowindow'
  ],
  (ImageLayerClass, UriTemplate, moment, CustomInfowindow) => {
    const SENTINEL_URL =
      'https://services.sentinel-hub.com/v1/{provider}/9f85dfae-bf90-4638-81d3-dc9925dd5b26/';
    const LANDSAT_URL =
      'https://services-uswest2.sentinel-hub.com/v1/{provider}/0e8c6cde-ff77-4e38-aba8-33b171896972/';
    const TILE_SIZE = 256;
    const MAX_ZOOM = 9;

    const TILES_PARAMS =
      '?SERVICE=WMS&REQUEST=GetMap&LAYERS=TRUE_COLOR&BBOX={bbox}&MAXCC={cloud}&CLOUDCORRECTION=none&WIDTH=512&HEIGHT=512&FORMAT=image/png&TIME={mindate}/{maxdate}&CRS=CRS:84&TRANSPARENT=TRUE&PRIORITY=mostRecent';

    const METADATA_PARAMS =
      '?service=WFS&version=2.0.0&request=GetFeature&time={mindate}/{maxdate}&typenames=TILE&maxfeatures=1&srsname=CRS:84&LAYERS=TRUE_COLOR&MAXCC={cloud}&CLOUDCORRECTION=none&&bbox={bbox}&PRIORITY=mostRecent&outputformat=application/json';

    const SentinelLayer = ImageLayerClass.extend({
      options: {
        dataMaxZoom: {
          rgb: 14,
          ndvi: 13,
          evi: 13,
          ndwi: 13,
          'false-color-nir': 13
        },
        infowindowImagelayer: true
      },

      init(layer, options, map) {
        this._super(layer, options, map);
        this.addEvents();
      },

      _getParams() {
        let params = {};
        if (
          window.location.search.contains('hresolution=') &&
          window.location.search.indexOf(
            '=',
            window.location.search.indexOf('hresolution=') + 11
          ) !== -1
        ) {
          const params_new_url = {};
          const parts = location.search.substring(1).split('&');
          for (let i = 0; i < parts.length; i++) {
            const nv = parts[i].split('=');
            if (!nv[0]) continue;
            params_new_url[nv[0]] = nv[1] || true;
          }
          params = JSON.parse(atob(params_new_url.hresolution));
        } else if (sessionStorage.getItem('high-resolution')) {
          params = JSON.parse(atob(sessionStorage.getItem('high-resolution')));
        }

        return {
          color_filter: params.color_filter || 'rgb',
          cloud: params.cloud || '100',
          mindate: params.mindate || '2000-09-01',
          maxdate: params.maxdate || '2015-09-01',
          sensor_platform: params.sensor_platform || 'landsat-8'
        };
      },

      calcBboxFromXY(x, y, z) {
        const proj = this.map.getProjection();
        const tileSize = TILE_SIZE / Math.pow(2, z);
        const tileBounds = new google.maps.LatLngBounds(
          proj.fromPointToLatLng(
            new google.maps.Point(x * tileSize, (y + 1) * tileSize)
          ),
          proj.fromPointToLatLng(
            new google.maps.Point((x + 1) * tileSize, y * tileSize)
          )
        );
        const parsedB = tileBounds.toJSON();
        return [parsedB.west, parsedB.north, parsedB.east, parsedB.south].join(
          ','
        );
      },

      _getUrlTemplateBySensor(sensor) {
        this.sensor = sensor;
        return sensor === 'sentinel-2' ? SENTINEL_URL : LANDSAT_URL;
      },

      _getUrl(x, y, z, params) {
        const urlTemplate =
          this._getUrlTemplateBySensor(params.sensor_platform) + TILES_PARAMS;
        const urlParams = {
          sat: params.color_filter,
          cloud: params.cloud,
          mindate: params.mindate,
          maxdate: params.maxdate,
          bbox: this.calcBboxFromXY(x, y, z),
          provider: 'wms'
        };

        return new UriTemplate(urlTemplate).fillFromObject(urlParams);
      },

      _getInfoWindowUrl(params) {
        const urlTemplate =
          this._getUrlTemplateBySensor(params.sensor_platform) +
          METADATA_PARAMS;
        return new UriTemplate(urlTemplate).fillFromObject({
          mindate: params.mindate,
          maxdate: params.maxdate,
          bbox: params.bbox,
          cloud: params.cloud,
          provider: 'wfs'
        });
      },

      _getBoundsUrl(params) {
        this.clear();

        const urlTemplate = this._getUrlTemplateBySensor(params.sensor_platform);
        return new UriTemplate(this.options[urlTemplate]).fillFromObject({
          geo: params.geo,
          cloud: params.cloud,
          mindate: moment(params.mindate).format('YYYY-MM-DD'),
          maxdate: moment(params.maxdate).format('YYYY-MM-DD'),
          tileddate: params.tileddate,
          sensor_platform: params.sensor_platform,
          provider: 'wms'
        });
      },

      // TILES
      getTile(coord, zoom, ownerDocument) {
        if (zoom < MAX_ZOOM) {
          return ownerDocument.createElement('div');
        }

        const zsteps = this._getZoomSteps(zoom);
        const srcX = TILE_SIZE * (coord.x % Math.pow(2, zsteps));
        const srcY = TILE_SIZE * (coord.y % Math.pow(2, zsteps));
        const widthandheight =
          zsteps > 0
            ? `${TILE_SIZE * Math.pow(2, zsteps)}px`
            : `${this.tileSize.width}px`;

        const url = this._getUrl.apply(
          this,
          this._getTileCoords(coord.x, coord.y, zoom, this._getParams())
        );

        // Image to render
        const image = new Image();
        image.src = url;
        image.className += this.name;
        image.style.position = 'absolute';
        image.style.top = `${-srcY}px`;
        image.style.left = `${-srcX}px`;
        image.style.width = '100%';
        image.style.height = '100%';

        // Loader
        const loader = ownerDocument.createElement('div');
        loader.className += 'loader spinner start';
        loader.style.position = 'absolute';
        loader.style.top = '50%';
        loader.style.left = '50%';
        loader.style.border = '4px solid #FFF';
        loader.style.borderRadius = '50%';
        loader.style.borderTopColor = '#555';

        // Wwrap the loader and the image
        const div = ownerDocument.createElement('div');
        div.appendChild(image);
        div.appendChild(loader);
        div.style.width = widthandheight;
        div.style.height = widthandheight;
        div.style.position = 'relative';
        div.style.overflow = 'hidden';
        div.className += this.name;

        image.onload = function () {
          div.removeChild(loader);
        };

        image.onerror = function () {
          div.removeChild(loader);
          this.style.display = 'none';
        };

        return div;
      },

      _getTileCoords(x, y, z, params) {
        const maxZoom = this.options.dataMaxZoom[params.color_filter];
        if (z > maxZoom) {
          x = Math.floor(x / Math.pow(2, z - maxZoom));
          y = Math.floor(y / Math.pow(2, z - maxZoom));
          z = maxZoom;
        } else {
          y = y > Math.pow(2, z) ? y % Math.pow(2, z) : y;
          if (x >= Math.pow(2, z)) {
            x %= Math.pow(2, z);
          } else if (x < 0) {
            x = Math.pow(2, z) - Math.abs(x);
          }
        }

        return [x, y, z, params];
      },

      // INFOWINDOW
      setInfoWindow(_data, event) {
        const data = _data;
        if (data) {
          const infoWindowOptions = {
            offset: [0, 100],
            infowindowData: {
              acquired: moment
                .utc(data.date, 'YYYY-MM-DD')
                .format('MMMM Do, YYYY'),
              sensor_platform: this.sensor,
              cloud_coverage: data.cloudCoverPercentage
                ? Math.ceil(data.cloudCoverPercentage * 10) / 10
                : '0'
            }
          };
          this.infowindow = new CustomInfowindow(
            event.latLng,
            this.map,
            infoWindowOptions
          );
        }
      },

      removeInfoWindow() {
        if (this.infowindow) {
          this.infowindow.remove();
        }
      },

      // MAP EVENTS
      addEvents() {
        this.clickevent = google.maps.event.addListener(
          this.map,
          'click',
          this.onClickEvent.bind(this)
        );
      },

      clearEvents() {
        google.maps.event.removeListener(this.clickevent);
      },

      onClickEvent(event) {
        if (this.map.getZoom() >= MAX_ZOOM) {
          // Set options to get the url of the api
          const bounds = this.getBoundsFromLatLng(event.latLng);
          const options = _.extend({}, this._getParams(), {
            lng: event.latLng.lng(),
            lat: event.latLng.lat(),
            bbox: bounds
          });
          const url = this._getInfoWindowUrl(options);

          $.get(url).done(
            (data) => {
              this.clear();

              const feature = data.features[0];

              if (feature) {
                this.drawMultipolygon(feature.geometry);
                this.setInfoWindow(feature.properties, event);
              }
            }
          );
        }
      },

      getBoundsFromLatLng(latLng) {
        const offsetX = TILE_SIZE;
        const offsetY = TILE_SIZE;

        const tileSize = TILE_SIZE / Math.pow(2, this.map.getZoom());

        const point1 = this.map.getProjection().fromLatLngToPoint(latLng);
        const point2 = new google.maps.Point(
          offsetX / Math.pow(2, this.map.getZoom()),
          offsetY / Math.pow(2, this.map.getZoom())
        );
        const newLat = this.map
          .getProjection()
          .fromPointToLatLng(
            new google.maps.Point(
              point1.x + tileSize / 2,
              point1.y + tileSize / 2
            )
          );

        return (
          `${latLng.lng()
          },${
            latLng.lat()
          },${
            newLat.lng()
          },${
            newLat.lat()}`
        );
      },

      // HELPERS
      setStyle() {
        this.map.data.setStyle((feature) => ({
          editable: false,
          strokeWeight: 2,
          fillOpacity: 0,
          fillColor: '#FFF',
          strokeColor: '#FF6633'
        }));
      },

      drawMultipolygon(geom) {
        const multipolygon_todraw = {
          type: 'Feature',
          geometry: geom
        };

        this.multipolygon = this.map.data.addGeoJson(multipolygon_todraw)[0];
        if (this.listener) {
          google.maps.event.removeListener(this.listener, 'click');
        }
        this.listener = this.map.data.addListener(
          'click',
          (e) => {
            google.maps.event.trigger(this.map, 'click', e);
          }
        );
        this.setStyle();
      },

      getBoundsPolygon() {
        const bounds = this.map.getBounds();
        if (bounds) {
          let nlat = bounds.getNorthEast().lat(),
            nlng = bounds.getNorthEast().lng(),
            slat = bounds.getSouthWest().lat(),
            slng = bounds.getSouthWest().lng();

          // Define the LngLat coordinates for the polygon.
          const boundsJson = {
            type: 'Polygon',
            coordinates: [
              [
                [slng, nlat],
                [nlng, nlat],
                [nlng, slat],
                [slng, slat],
                [slng, nlat]
              ]
            ]
          };
          return JSON.stringify(boundsJson);
        }
        return null;
      },

      _getZoomSteps(z) {
        const params = this._getParams();
        return z - this.options.dataMaxZoom[params.color_filter];
      },

      clear() {
        this.removeMultipolygon();
        this.removeInfoWindow();
      },

      removeLayer() {
        this.clear();
        this.clearEvents();
      }
    });

    return SentinelLayer;
  }
);
