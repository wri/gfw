import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import Button from 'components/ui/button/button-component';
import Icon from 'components/ui/icon';
import NoContent from 'components/ui/no-content';

import arrowDownIcon from 'assets/icons/arrow-down.svg';
import shareIcon from 'assets/icons/share.svg';
import './styles.scss';

class DrawAnalysis extends PureComponent {
  renderStatItem = ({
    color,
    value,
    label,
    startDate,
    endDate,
    dateFormat,
    threshold,
    thresh
  }) => (
    <li className="draw-stat" key={label}>
      <div className="title">
        {label}
        <span>
          {startDate &&
            endDate &&
            ` (${moment(startDate).format(dateFormat)} to ${moment(
              endDate
            ).format(dateFormat)})`}
          {(thresh || threshold) &&
            ` with >${threshold || thresh}% canopy density`}
        </span>
      </div>
      <div className="value" style={{ color }}>
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
      fullLocationName,
      goToDashboard,
      location
    } = this.props;

    return (
      <div className="c-draw-analysis">
        <div className="draw-title">
          <div className="title-nav">
            <button onClick={() => clearAnalysis(query)}>
              <Icon icon={arrowDownIcon} className="icon-arrow" />
            </button>
            <p>{fullLocationName}</p>
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
                  {data.map(d => this.renderStatItem(d))}
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
  data: PropTypes.array,
  setShareModal: PropTypes.func,
  clearAnalysis: PropTypes.func,
  query: PropTypes.object,
  loading: PropTypes.bool,
  location: PropTypes.object,
  fullLocationName: PropTypes.string,
  goToDashboard: PropTypes.func
};

export default DrawAnalysis;
