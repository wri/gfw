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
    unit,
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
            ` (${moment(startDate).format(
              dateFormat || 'YYYY-MM-DD'
            )} to ${moment(endDate).format(dateFormat || 'YYYY-MM-DD')})`}
          {(thresh || threshold) &&
            ` with >${threshold || thresh}% canopy density`}
        </span>
      </div>
      <div className="value" style={{ color }}>
        {Array.isArray(value) ? (
          value.map(v => (
            <strong key={v.label}>
              {formatNumber({
                num: v.value,
                unit
              })}
              <span>{v.label}</span>
            </strong>
          ))
        ) : (
          <strong>
            {formatNumber({
              num: value,
              unit
            })}
          </strong>
        )}
      </div>
    </li>
  );

  render() {
    const {
      setShareModal,
      clearAnalysis,
      data,
      loading,
      fullLocationName,
      goToDashboard,
      location,
      error,
      setModalSources
    } = this.props;

    return (
      <div className="c-draw-analysis">
        <div className="draw-title">
          <div className="title-nav">
            <button onClick={clearAnalysis}>
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
            !error &&
            isEmpty(data) && <NoContent message="No analysis data available" />}
          {!loading &&
            !isEmpty(data) && (
              <Fragment>
                <ul className="draw-stats">
                  {data.map(d => this.renderStatItem(d))}
                  {data.length === 1 && (
                    <li className="no-layers">
                      <NoContent message="No data layers activated. Please select one from the menu." />
                    </li>
                  )}
                </ul>
                <div className="disclaimers">
                  <p>
                    This algorithm approximates the results by sampling the
                    selected area. Results are more accurate at closer zoom
                    levels.
                  </p>
                  <p>
                    <b>NOTE:</b> tree cover loss and gain statistics cannot be
                    compared against each other.{' '}
                    <button
                      onClick={() =>
                        setModalSources({
                          open: true,
                          source: 'lossDisclaimer'
                        })
                      }
                    >
                      Learn more.
                    </button>
                  </p>
                </div>
                {location.type === 'country' && (
                  <div className="analysis-actions">
                    <Button onClick={goToDashboard}>OPEN DASHBOARD</Button>
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
  loading: PropTypes.bool,
  error: PropTypes.string,
  location: PropTypes.object,
  fullLocationName: PropTypes.string,
  goToDashboard: PropTypes.func,
  setModalSources: PropTypes.func
};

export default DrawAnalysis;
