import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Widgets from 'components/widgets';

import Icon from 'components/ui/icon';
import arrowDownIcon from 'assets/icons/arrow-down.svg';
import './location-analysis-styles.scss';

class LocationAnalysis extends PureComponent {
  render() {
    const { widgets, setAnalysisData } = this.props;
    return (
      <div className="c-location-analysis">
        <div
          className="c-location-analysis__title"
          onClick={() => {
            setAnalysisData({
              option: null
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
        <Widgets widgets={widgets} analysis minimalist />
      </div>
    );
  }
}

LocationAnalysis.propTypes = {
  widgets: PropTypes.array,
  setAnalysisData: PropTypes.func
};

export default LocationAnalysis;
