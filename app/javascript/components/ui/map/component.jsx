import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import ReactMapGL, { FlyToInterpolator } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0
};

class Map extends Component {
  events = {};

  static propTypes = {
    /** A function that returns the map instance */
    children: PropTypes.func,

    /** Custom css class for styling */
    customClass: PropTypes.string,

    /** An object that defines the viewport
     * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
     */
    viewport: PropTypes.shape({}),

    /** An object that defines the bounds */
    bounds: PropTypes.shape({
      bbox: PropTypes.array,
      options: PropTypes.shape({})
    }),

    /** A boolean that allows panning */
    dragPan: PropTypes.bool,

    /** A boolean that allows rotating */
    dragRotate: PropTypes.bool,

    /** A boolean that allows rotating */
    touchRotate: PropTypes.bool,

    /** A function that exposes when the map is loaded. It returns and object with the `this.map` and `this.mapContainer` reference. */
    onLoad: PropTypes.func,

    /** A function that exposes the viewport */
    onViewportChange: PropTypes.func,

    /** A function that exposes the viewport */
    getCursor: PropTypes.func
  };

  static defaultProps = {
    children: null,
    customClass: null,
    viewport: DEFAULT_VIEWPORT,
    bounds: {},
    dragPan: true,
    dragRotate: true,
    touchRotate: true,

    onViewportChange: () => {},
    onLoad: () => {},
    getCursor: ({ isHovering, isDragging }) => {
      if (isHovering) return 'pointer';
      if (isDragging) return 'grabbing';
      return 'grab';
    }
  };

  state = {
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...this.props.viewport // eslint-disable-line
    },
    flying: false,
    loaded: false
  };

  componentDidMount() {
    const { bounds } = this.props;

    if (!isEmpty(bounds) && !!bounds.bbox) {
      this.fitBounds();
    }
  }

  componentDidUpdate(prevProps) {
    const { viewport: prevVieport, bounds: prevBounds } = prevProps;
    const { viewport, bounds } = this.props;
    const { viewport: stateViewport } = this.state;

    if (!isEqual(viewport, prevVieport)) {
      // eslint-disable-next-line
      this.setState({
        viewport: {
          ...stateViewport,
          ...viewport
        }
      });
    }

    if (!isEqual(bounds, prevBounds)) {
      this.fitBounds();
    }
  }

  onLoad = () => {
    const { onLoad } = this.props;
    this.setState({ loaded: true });

    onLoad({
      map: this.map,
      mapContainer: this.mapContainer
    });
  };

  onViewportChange = v => {
    const { onViewportChange } = this.props;

    this.setState({ viewport: v });
    onViewportChange(v);
  };

  onResize = v => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const newViewport = {
      ...viewport,
      ...v
    };

    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  };

  onMoveEnd = () => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;

    if (this.map) {
      const bearing = this.map.getBearing();
      const pitch = this.map.getPitch();
      const zoom = this.map.getZoom();
      const { lng, lat } = this.map.getCenter();

      const newViewport = {
        ...viewport,
        bearing,
        pitch,
        zoom,
        latitude: lat,
        longitude: lng
      };

      // Publish new viewport and save it into the state
      this.setState({
        viewport: newViewport,
        flying: false
      });
      onViewportChange(newViewport);
    }
  };

  fitBounds = () => {
    const { flying } = this.state;
    const { bounds } = this.props;
    const { bbox, options } = bounds;

    if (flying) {
      this.map.off('moveend', this.onMoveEnd);
    }

    this.setState({ flying: true });

    requestAnimationFrame(() => {
      this.map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
        ...options,
        linear: true
      });

      this.map.once('moveend', this.onMoveEnd);
    });
  };

  render() {
    const {
      customClass,
      children,
      getCursor,
      dragPan,
      dragRotate,
      touchRotate,
      ...mapboxProps
    } = this.props;
    const { viewport, flying, loaded } = this.state;

    return (
      <div
        ref={r => {
          this.mapContainer = r;
        }}
        className={classnames({
          'c-mapbox-map': true,
          [customClass]: !!customClass
        })}
      >
        <ReactMapGL
          ref={map => {
            this.map = map && map.getMap();
          }}
          // CUSTOM PROPS FROM REACT MAPBOX API
          {...mapboxProps}
          // VIEWPORT
          {...viewport}
          width="100%"
          height="100%"
          // INTERACTIVE
          dragPan={dragPan && !flying}
          dragRotate={dragRotate && !flying}
          touchRotate={touchRotate}
          // DEFAULT FUC IMPLEMENTATIONS
          onViewportChange={!flying ? this.onViewportChange : null}
          onResize={this.onResize}
          onLoad={this.onLoad}
          getCursor={getCursor}
          transitionInterpolator={new FlyToInterpolator()}
        >
          {loaded &&
            !!this.map &&
            typeof children === 'function' &&
            children(this.map)}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
