import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import Icon from 'components/ui/icon';

import arrowDownIcon from 'assets/icons/arrow-down.svg';
import './polygon-analysis-styles.scss';

class PolygonAnalysis extends PureComponent {
  renderStatItem = (title, value, className) => (
    <li className={`c-polygon-analysis__stat ${className || ''}`}>
      <div
        className="c-polygon-analysis__stat__title"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="c-polygon-analysis__stat__value">
        <strong>{format(',')(value)}</strong>ha
      </div>
    </li>
  );

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
          FOREST CHANGE ANALYSIS
        </div>
        <ul className="c-polygon-analysis__stats">
          {data.areaHa &&
            this.renderStatItem('Total selected area', data.areaHa)}
          {data.loss &&
            this.renderStatItem(
              'Loss 2001-2017 <small>with &gt;30% canopy density</small>',
              data.loss,
              'c-polygon-analysis__stat--loss'
            )}
          {data.gain &&
            this.renderStatItem(
              'Gain 2001-2012',
              data.gain,
              'c-polygon-analysis__stat--gain'
            )}
          {data.treeExtent &&
            this.renderStatItem(
              'Tree cover (2000) <small>with &gt;30% canopy density</small>',
              data.treeExtent,
              'c-polygon-analysis__stat--extent'
            )}
          {data.treeExtent2010 &&
            this.renderStatItem(
              'Tree cover (2010) <small>with &gt;30% canopy density</small>',
              data.treeExtent2010,
              'c-polygon-analysis__stat--extent'
            )}
        </ul>
      </div>
    );
  }
}

PolygonAnalysis.propTypes = {
  analysis: PropTypes.object,
  setAnalysisData: PropTypes.func
};

export default PolygonAnalysis;
