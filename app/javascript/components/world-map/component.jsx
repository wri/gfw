import React from 'react';
import PropTypes from 'prop-types';
import {
  ComposableMap,
  Geographies,
  Geography,
  Lines,
  ZoomableGroup,
  Line
} from 'react-simple-maps';
import { Tooltip } from 'react-tippy';

import cx from 'classnames';
import { formatNumber } from 'utils/format';

import WORLD_GEOGRAPHIES from 'data/WORLD.topo.json';
import './style.scss';

class WorldMap extends React.PureComponent {
  static buildCurves(start, end, arc) {
    const x0 = start[0];
    const x1 = end[0];
    const y0 = start[1];
    const y1 = end[1];
    const curve = {
      forceUp: `${x1} ${y0}`,
      forceDown: `${x0} ${y1}`
    }[arc.curveStyle];

    return `M ${start.join(' ')} Q ${curve} ${end.join(' ')}`;
  }

  static isDestinationCountry(iso, countries) {
    return countries.map(f => f.geoId).includes(iso);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.flows.length !== 0 && nextProps.flows !== prevState.flows) {
      // avoids rendering intermediate states
      return {
        flows: nextProps.flows,
        originGeoId: nextProps.originGeoId,
        originCoordinates: nextProps.originCoordinates
      };
    }
    return prevState;
  }

  state = {
    flows: [],
    originGeoId: null,
    tooltipConfig: null,
    originCoordinates: []
  };

  onMouseMove = (geometry, e) => {
    const { flows } = this.state;
    const geoId = geometry.properties
      ? geometry.properties.iso2
      : geometry.geoId;
    if (WorldMap.isDestinationCountry(geoId, flows)) {
      const x = e.clientX + 10;
      const y = e.clientY + window.scrollY + 10;
      const text = geometry.name || geometry.properties.name;
      const title = 'Trade Volume';
      const unit = 't';
      const volume =
        geometry.value ||
        (flows.find(flow => flow.geoId === geoId) || {}).value;
      const height =
        geometry.height ||
        (flows.find(flow => flow.geoId === geoId) || {}).height;
      const value = formatNumber({ num: volume, unit: 't' });
      const percentage = formatNumber({ num: height * 100, unit: '%' });
      const tooltipConfig = {
        x,
        y,
        text,
        items: [{ title, value, unit, percentage }]
      };
      this.setState(() => ({ tooltipConfig }));
    }
  };

  onMouseLeave = () => {
    this.setState(() => ({ tooltipConfig: null }));
  };

  renderGeographies = (geographies, projection) => {
    const { flows, originGeoId } = this.state;
    return geographies.map(
      geography =>
        geography.properties.iso2 !== 'AQ' && (
          <Geography
            key={geography.properties.cartodb_id}
            className={cx(
              'world-map-geography',
              {
                '-dark': WorldMap.isDestinationCountry(
                  geography.properties.iso2,
                  flows
                )
              },
              { '-pink': originGeoId === geography.properties.iso2 }
            )}
            geography={geography}
            projection={projection}
            onMouseMove={this.onMouseMove}
            onMouseLeave={this.onMouseLeave}
          />
        )
    );
  };

  renderLines = () => {
    const { originCoordinates, flows } = this.state;

    return flows.map(flow => (
      <Line
        key={flow.geoId}
        className="world-map-arc"
        line={{
          ...flow,
          coordinates: {
            start: flow.coordinates,
            end: originCoordinates
          }
        }}
        buildPath={WorldMap.buildCurves}
        strokeWidth={flow.strokeWidth}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
      />
    ));
  };

  render() {
    const { tooltipConfig } = this.state;
    const { className } = this.props;
    const { text, items } = tooltipConfig || {};
    return (
      <Tooltip
        className={className}
        theme="tip"
        html={
          <div className="c-world-map-tooltip">
            <p>{text && text.toLowerCase()}</p>
            <p>{items && items[0].value}</p>
            <p>{items && items[0].percentage}</p>
          </div>
        }
        followCursor
        animateFill={false}
        open={!!tooltipConfig}
      >
        <ComposableMap
          className={cx('c-world-map')}
          projection="robinson"
          style={{ width: '100%', height: 'auto' }}
          projectionConfig={{ scale: 145 }}
        >
          <ZoomableGroup disablePanning center={[20, 0]}>
            <Geographies geography={WORLD_GEOGRAPHIES} disableOptimization>
              {this.renderGeographies}
            </Geographies>
            <Lines>{this.renderLines()}</Lines>
          </ZoomableGroup>
        </ComposableMap>
      </Tooltip>
    );
  }
}

WorldMap.propTypes = {
  className: PropTypes.string
};

export default WorldMap;
