import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import cx from 'classnames';
import { track } from 'utils/analytics';

import Icon from 'components/ui/icon';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import Widgets from 'components/widgets';
import DownloadData from 'components/map-v2/components/analysis/components/download-data';

import arrowDownIcon from 'assets/icons/arrow-down.svg';
import shareIcon from 'assets/icons/share.svg';
import downloadIcon from 'assets/icons/download.svg';
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
        {Array.isArray(value) && value.length ? (
          value.map(v => (
            <strong key={v.label}>
              {formatNumber({
                num: v.value,
                unit: v.unit || unit
              })}
              <span>{v.label}</span>
            </strong>
          ))
        ) : (
          <strong>
            {formatNumber({
              num: Array.isArray(value) ? 0 : value,
              unit: unit || 'ha'
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
      error,
      showWidgets,
      setModalSources,
      handleShowDownloads,
      showDownloads,
      downloadUrls
    } = this.props;

    return (
      <div className={cx('c-draw-analysis')}>
        <div className="draw-title">
          <Button
            className="title-btn left"
            theme="theme-button-clear"
            onClick={clearAnalysis}
          >
            <Icon icon={arrowDownIcon} className="icon-arrow" />
            <span>{fullLocationName}</span>
          </Button>
          <div className="title-controls">
            <Button
              className="title-btn title-action"
              theme="theme-button-clear"
              onClick={() =>
                setShareModal({
                  title: 'Share this view',
                  shareUrl: window.location.href.includes('embed')
                    ? window.location.href.replace('/embed', '')
                    : window.location.href,
                  embedUrl: window.location.href.includes('embed')
                    ? window.location.href
                    : window.location.href.replace('/map', '/embed/map'),
                  embedSettings: {
                    width: 670,
                    height: 490
                  }
                })
              }
              tooltip={{ text: 'Share analysis' }}
            >
              <Icon icon={shareIcon} className="icon-share" />
            </Button>
            <Button
              className="title-btn title-action"
              theme="theme-button-clear"
              disabled={!downloadUrls || !downloadUrls.length}
              onClick={() => {
                handleShowDownloads(true);
                track('analysisDownload', {
                  label:
                    downloadUrls &&
                    downloadUrls.length &&
                    downloadUrls.map(d => d.label).join(', ')
                });
              }}
              tooltip={{ text: 'Download data' }}
            >
              <Icon icon={downloadIcon} className="icon-download" />
            </Button>
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
                {showWidgets && <Widgets simple analysis />}
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
              </Fragment>
            )}
        </div>
        {showDownloads && (
          <DownloadData
            downloadUrls={downloadUrls}
            onClose={() => handleShowDownloads(false)}
          />
        )}
      </div>
    );
  }
}

DrawAnalysis.propTypes = {
  showWidgets: PropTypes.bool,
  data: PropTypes.array,
  setShareModal: PropTypes.func,
  clearAnalysis: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  fullLocationName: PropTypes.string,
  setModalSources: PropTypes.func,
  handleShowDownloads: PropTypes.func,
  showDownloads: PropTypes.bool,
  downloadUrls: PropTypes.array
};

export default DrawAnalysis;
