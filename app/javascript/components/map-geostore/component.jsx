import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import ContentLoader from 'react-content-loader';
import simplify from '@turf/simplify';

import { getGeostoreProvider } from 'services/geostore';
import { buildGeostore } from 'utils/geoms';

import './styles.scss';

class MapGeostore extends Component {
  static propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    small: PropTypes.bool,
    location: PropTypes.object
  };

  static defaultProps = {
    height: 140,
    width: 140
  };

  state = {
    loading: true,
    error: false,
    geostore: null,
    imgSrc: null
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    const { location } = this.props;
    if (location && location.adm0) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;

    if (location && !isEqual(location, prevLocation)) {
      this.handleGetGeostore();
    }

    const { geostore } = this.state;
    const { geostore: prevGeostore } = prevState;

    if (!isEmpty(geostore) && !isEqual(geostore, prevGeostore)) {
      this.showMapImage();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleGetGeostore = () => {
    if (this.mounted) {
      this.setState({ error: false });
      getGeostoreProvider(this.props.location)
        .then(response => {
          if (this.mounted) {
            const { data } = response.data || {};
            const geostore = buildGeostore(
              { id: data.id, ...data.attributes },
              this.props
            );
            this.setState({ geostore });
          }
        })
        .catch(err => {
          console.error(err);
          if (this.mounted) {
            this.setState({ error: true });
          }
        });
    }
  };

  showMapImage = () => {
    const { width, height } = this.props;
    const geostore = this.state.geostore && this.state.geostore.geojson.features[0];
    if (geostore) {
      const simpleGeostore = simplify(this.state.geostore.geojson, { tolerance: 0.05 });
      const simpGeostore = simpleGeostore.features[0];
      const geojson = {
        ...simpGeostore,
        properties: {
          fill: 'transparent',
          stroke: '%23C0FF24',
          'stroke-width': 2
        }
      };
      const geojsonOutline = {
        ...simpGeostore,
        properties: {
          fill: 'transparent',
          stroke: '%23000',
          'stroke-width': 5
        }
      };

      this.setState({ loading: false, imgSrc: `https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/static/geojson(${JSON.stringify(geojsonOutline)}),geojson(${JSON.stringify(geojson)})/auto/${width}x${height}@2x?access_token=${process.env.MapboxAccessToken}&attribution=false&logo=false` });
    }
  }

  render() {
    const { className, width, height, small } = this.props;
    const { loading, error, imgSrc } = this.state;

    return (
      <div
        id="recent-image-map"
        className={cx('c-recent-image-map', className, { small })}
        ref={r => {
          this.mapContainer = r;
        }}
      >
        {loading && (
          <ContentLoader
            width={width}
            height={height}
            style={{ width: '100%' }}
          >
            <rect x="0" y="0" width={width} height="100%" />
          </ContentLoader>
        )}
        {error &&
          !loading && (
          <p className="error-msg">we had trouble finding a recent image</p>
        )}
        {imgSrc &&
          <div className="map-image" style={{ backgroundImage: `url('${imgSrc}')` }} />
        }
      </div>
    );
  }
}

export default MapGeostore;
