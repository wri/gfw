import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
            CLICK A LAYER ON THE MAP
          </button>
          <button
            onClick={() => {
              setAnalysisData({ option: 'country' });
            }}
          >
            SELECT A COUNTRY OR REGION
          </button>
          <button
            onClick={() => {
              setAnalysisData({ option: 'polygon' });
            }}
          >
            DRAW OR UPLOAD SHAPE
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
