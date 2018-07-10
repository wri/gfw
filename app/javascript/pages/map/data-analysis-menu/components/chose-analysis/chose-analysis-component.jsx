import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import squarePointIcon from 'assets/icons/square-point.svg';
import flagIcon from 'assets/icons/flag.svg';
import polygonIcon from 'assets/icons/polygon.svg';
import './chose-analysis-styles.scss';

class ChoseAnalysis extends PureComponent {
  render() {
    const { setAnalysisData } = this.props;
    return (
      <div className="c-chose-analysis">
        <div className="c-chose-analysis__title">
          ANALYZE AND TRACK FOREST CHANGE
        </div>
        <div className="c-chose-analysis__options">
          <button
            onClick={() => {
              setAnalysisData({ option: null });
            }}
          >
            <Icon icon={squarePointIcon} className="icon square-point" />
            <div className="label">CLICK A LAYER ON THE MAP</div>
          </button>
          <button
            onClick={() => {
              setAnalysisData({ option: 'location' });
            }}
          >
            <Icon icon={flagIcon} className="icon flag" />
            <div className="label">SELECT A COUNTRY OR REGION</div>
          </button>
          <button
            onClick={() => {
              setAnalysisData({ option: 'polygon' });
            }}
          >
            <Icon icon={polygonIcon} className="icon polygon" />
            <div className="label">DRAW OR UPLOAD SHAPE</div>
          </button>
        </div>
      </div>
    );
  }
}

ChoseAnalysis.propTypes = {
  setAnalysisData: PropTypes.func
};

export default ChoseAnalysis;
