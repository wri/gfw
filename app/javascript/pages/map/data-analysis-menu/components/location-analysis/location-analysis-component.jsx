import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Widgets from 'components/widgets';

import Icon from 'components/ui/icon';
import arrowDownIcon from 'assets/icons/arrow-down.svg';
import './location-analysis-styles.scss';

class LocationAnalysis extends PureComponent {
  render() {
    const { location, widgets, setAnalysisData } = this.props;
    return (
      <div className="c-location-analysis">
        <div
          className="c-location-analysis__title"
          onClick={() => {
            setAnalysisData({
              option: 'location',
              showResults: false
            });
          }}
          role="button"
          tabIndex={0}
        >
          <Icon icon={arrowDownIcon} className="icon" />
          FOREST CHANGE ANALYSIS
        </div>
        <div className="c-location-analysis__area">
          <div className="c-location-analysis__area-title">SELECTED AREA</div>
          <div className="c-location-analysis__area-value">41.2Mha</div>
        </div>
        <Widgets widgets={widgets} location={location} analysis minimalist />
      </div>
    );
  }
}

LocationAnalysis.propTypes = {
  location: PropTypes.object,
  widgets: PropTypes.array,
  setAnalysisData: PropTypes.func
};

export default LocationAnalysis;
