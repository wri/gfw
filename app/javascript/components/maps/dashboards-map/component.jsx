import React, { PureComponent } from 'react';

import Map from 'components/maps/map';
import MiniLegend from './components/mini-legend';

import './styles.scss';

class DashboardsMapComponent extends PureComponent {
  render() {
    return (
      <div className="c-dashboards-map">
        <Map className="dashboards-map" />
        <MiniLegend className="dashboards-mini-legend" />
      </div>
    );
  }
}

export default DashboardsMapComponent;
