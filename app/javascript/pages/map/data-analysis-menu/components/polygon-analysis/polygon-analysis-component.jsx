import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/icon';

import arrowDownIcon from 'assets/icons/arrow-down.svg';

import './polygon-analysis-styles.scss';

class PolygonAnalysis extends PureComponent {
  render() {
    const { analysis: { data }, setAnalysisData } = this.props;
    return (
      <div className="c-polygon-analysis">
        <div
          className="c-polygon-analysis__title"
          onClick={() => {
            setAnalysisData({
              option: 'polygon',
              polygon: null,
              geostore: null,
              data: null
            });
          }}
          role="button"
          tabIndex={0}
        >
          <Icon icon={arrowDownIcon} className="icon" />
        </div>
        {data.areaHa && <div>areaHa: {data.areaHa}</div>}
        {data.gain && <div>gain: {data.gain}</div>}
        {data.loss && <div>loss: {data.loss}</div>}
        {data.treeExtent && <div>treeExtent: {data.treeExtent}</div>}
        {data.treeExtent2010 && (
          <div>treeExtent2010: {data.treeExtent2010}</div>
        )}
      </div>
    );
  }
}

PolygonAnalysis.propTypes = {
  analysis: PropTypes.object,
  setAnalysisData: PropTypes.func
};

export default PolygonAnalysis;
