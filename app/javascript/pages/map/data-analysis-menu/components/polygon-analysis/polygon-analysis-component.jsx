import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './polygon-analysis-styles.scss';

class PolygonAnalysis extends PureComponent {
  render() {
    const { analysis: { data } } = this.props;
    return (
      <div className="c-polygon-analysis">
        {data && data.areaHa && <div>areaHa: {data.areaHa}</div>}
        {data && data.gain && <div>gain: {data.gain}</div>}
        {data && data.loss && <div>loss: {data.loss}</div>}
        {data && data.treeExtent && <div>treeExtent: {data.treeExtent}</div>}
        {data &&
          data.treeExtent2010 && (
            <div>treeExtent2010: {data.treeExtent2010}</div>
          )}
      </div>
    );
  }
}

PolygonAnalysis.propTypes = {
  analysis: PropTypes.object
};

export default PolygonAnalysis;
