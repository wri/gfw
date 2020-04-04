import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Map from 'components/map';
import MiniLegend from '../mini-legend';

import './styles.scss';

class MainMapComponent extends PureComponent {
  renderInfoTooltip = string => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    const { handleLocationChange } = this.props;

    return (
      <div className="c-dashboard-map">
        <Map
          className="dashboard-map"
          onSelectBoundary={handleLocationChange}
          popupActions={[
            {
              label: 'View dashboard',
              action: handleLocationChange
            }
          ]}
        />
        <MiniLegend className="mini-legend" />
      </div>
    );
  }
}

MainMapComponent.propTypes = {
  handleLocationChange: PropTypes.func
};

export default MainMapComponent;
