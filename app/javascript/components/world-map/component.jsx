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
// import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import cx from 'classnames';
import { formatNumber } from 'utils/format';
import xor from 'lodash/xor';
export const getTopNodesKey = (ctx, col, start, end) => (ctx && col && start && end ? `CTX${ctx}_COL${col}_START${start}_END${end}` : null);

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

  // componentDidMount() {
  //   if (this.props.flows.length === 0 && this.props.selectedContext && this.props.selectedYears) {
  //     this.props.getTopNodes();
  //   }
  // }

  componentDidUpdate(prevProps) {
    // if (!this.props.selectedContext) {
    //   return;
    // }

    // if (
    //   !prevProps.selectedContext ||
    //   this.props.selectedContext.id !== prevProps.selectedContext.id ||
    //   xor(this.props.selectedYears, prevProps.selectedYears).length !== 0
    // ) {
    //   this.props.getTopNodes();
    // }
  }

  onMouseMove = (geometry, e) => {
    const { flows } = this.state;
    const geoId = geometry.properties ? geometry.properties.iso2 : geometry.geoId;
    if (WorldMap.isDestinationCountry(geoId, flows)) {
      const x = e.clientX + 10;
      const y = e.clientY + window.scrollY + 10;
      const text = geometry.name || geometry.properties.name;
      const title = 'Trade Volume';
      const unit = 't';
      const volume = geometry.value || (flows.find(flow => flow.geoId === geoId) || {}).value;
      const value = formatNumber({ num: volume, unit: 'tons' });
      const tooltipConfig = { x, y, text, items: [{ title, value, unit }] };
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
              { '-dark': WorldMap.isDestinationCountry(geography.properties.iso2, flows) },
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
    // const { tooltipConfig } = this.state;
    console.log('component data', this.props);
    const { className } = this.props;
    return (
      <React.Fragment>
        {/* <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} /> */}
        <ComposableMap
          className={cx('c-world-map', className)}
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
      </React.Fragment>
    );
  }
}

WorldMap.propTypes = {
  className: PropTypes.string,
  flows: PropTypes.array.isRequired,
  originCoordinates: PropTypes.array,
  originGeoId: PropTypes.string,
  selectedContext: PropTypes.object,
  selectedYears: PropTypes.array,
  getTopNodes: PropTypes.func.isRequired
};

export default WorldMap;
