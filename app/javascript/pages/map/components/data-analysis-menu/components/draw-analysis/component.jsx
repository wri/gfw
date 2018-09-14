import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';

import Icon from 'components/ui/icon';
import NoContent from 'components/ui/no-content';

import arrowDownIcon from 'assets/icons/arrow-down.svg';
import shareIcon from 'assets/icons/share.svg';
import downloadIcon from 'assets/icons/download.svg';
import './styles.scss';

class DrawAnalysis extends PureComponent {
  renderStatItem = (title, value, className) => (
    <li className={`draw-stat ${className || ''}`}>
      <div className="title">{ReactHtmlParser(title)}</div>
      <div className="value">
        <strong>{formatNumber({ num: value, unit: 'ha' })}</strong>
      </div>
    </li>
  );

  render() {
    const { setShareModal, clearAnalysis, query, data, loading } = this.props;
    const { areaHa, loss, gain, treeExtent, treeExtent2010 } = data;

    return (
      <div className="c-draw-analysis">
        <div className="draw-title">
          <div className="title-nav">
            <button onClick={() => clearAnalysis(query)}>
              <Icon icon={arrowDownIcon} className="icon-arrow" />
            </button>
            <p>CUSTOM AREA ANALYSIS</p>
          </div>
          <div className="title-controls">
            <button
              onClick={() =>
                setShareModal({
                  title: 'Share this view',
                  shareUrl: window.location.href,
                  embedUrl: window.location.href,
                  embedSettings: {
                    width: 670,
                    height: 490
                  }
                })
              }
            >
              <Icon icon={shareIcon} className="icon-share" />
            </button>
            <button>
              <Icon icon={downloadIcon} className="icon-download" />
            </button>
          </div>
        </div>
        <div className="results">
          {!loading && isEmpty(data) ? (
            <NoContent message="No analysis data available" />
          ) : (
            <ul className="draw-stats">
              {areaHa && this.renderStatItem('selected area', areaHa, 'area')}
              {loss &&
                this.renderStatItem(
                  'Loss 2001-2017 <small>with &gt;30% canopy density</small>',
                  loss,
                  'loss'
                )}
              {gain && this.renderStatItem('Gain 2001-2012', gain, 'gain')}
              {treeExtent &&
                this.renderStatItem(
                  'Tree cover (2000) <small>with &gt;30% canopy density</small>',
                  treeExtent,
                  'extent'
                )}
              {treeExtent2010 &&
                this.renderStatItem(
                  'Tree cover (2010) <small>with &gt;30% canopy density</small>',
                  treeExtent2010,
                  'extent'
                )}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

DrawAnalysis.propTypes = {
  data: PropTypes.object,
  setShareModal: PropTypes.func,
  clearAnalysis: PropTypes.func,
  query: PropTypes.object,
  loading: PropTypes.bool
};

export default DrawAnalysis;
