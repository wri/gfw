import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SCREEN_M } from 'utils/constants';
import MediaQuery from 'react-responsive';

import Map from 'components/map';
import MapControls from '../map-controls';
import MiniLegend from '../mini-legend';

import './styles.scss';

class MainMapComponent extends PureComponent {
  renderInfoTooltip = string => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    // const { setMainMapAnalysisView } = this.props;

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className="c-dashboard-map">
            <Map
              className="main-map"
              // onSelectBoundary={setMainMapAnalysisView}
              // popupActions={[
              //   {
              //     label: 'Analyze',
              //     action: setMainMapAnalysisView
              //   }
              // ]}
            />
            <MapControls className="map-controls" />
            <MiniLegend className="dashboards-mini-legend" />
          </div>
        )}
      </MediaQuery>
    );
  }
}

MainMapComponent.propTypes = {
  setMainMapAnalysisView: PropTypes.func
};

export default MainMapComponent;
