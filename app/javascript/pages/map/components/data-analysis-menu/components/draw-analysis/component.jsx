import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';

import Button from 'components/ui/button/button-component';
import Icon from 'components/ui/icon';
import NoContent from 'components/ui/no-content';

import arrowDownIcon from 'assets/icons/arrow-down.svg';
import shareIcon from 'assets/icons/share.svg';
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
    const {
      setShareModal,
      clearAnalysis,
      query,
      data,
      loading,
      locationName,
      goToDashboard,
      location
    } = this.props;
    const { areaHa, loss, gain, treeExtent, treeExtent2010 } = data;

    return (
      <div className="c-draw-analysis">
        <div className="draw-title">
          <div className="title-nav">
            <button onClick={() => clearAnalysis(query)}>
              <Icon icon={arrowDownIcon} className="icon-arrow" />
            </button>
            <p>{locationName}</p>
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
          </div>
        </div>
        <div className="results">
          {!loading &&
            isEmpty(data) && <NoContent message="No analysis data available" />}
          {!loading &&
            !isEmpty(data) && (
              <Fragment>
                <ul className="draw-stats">
                  {areaHa &&
                    this.renderStatItem('selected area', areaHa, 'area')}
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
                {location.type === 'country' && (
                  <div className="analysis-actions">
                    <Button onClick={() => goToDashboard(location, query)}>
                      OPEN DASHBOARD
                    </Button>
                  </div>
                )}
              </Fragment>
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
  loading: PropTypes.bool,
  location: PropTypes.object,
  locationName: PropTypes.string,
  goToDashboard: PropTypes.func
};

export default DrawAnalysis;
