import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import cx from 'classnames';
import { track } from 'app/analytics';

import Icon from 'components/ui/icon';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import Widgets from 'components/widgets';
import DownloadData from 'components/maps/components/analysis/components/download-data';

import arrowDownIcon from 'assets/icons/arrow-down.svg';
import shareIcon from 'assets/icons/share.svg';
import downloadIcon from 'assets/icons/download.svg';
import './styles.scss';

class ShowAnalysis extends PureComponent {
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
            <strong key={`${v.label}-${v.value}`}>
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
      setMenuSettings,
      clearAnalysis,
      data,
      loading,
      fullLocationName,
      error,
      setModalSources,
      handleShowDownloads,
      showDownloads,
      downloadUrls,
      hasLayers,
      hasWidgets,
      zoomLevel,
      widgets
    } = this.props;

    const treeCoverGain =
      data && data.find(d => d.label.includes('Tree cover gain'));
    const treeCoverLoss = widgets && widgets.find(w => w.widget === 'treeLoss');

    return (
      <div className={cx('c-show-analysis')}>
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
          {hasLayers &&
            !hasWidgets &&
            !loading &&
            !error &&
            isEmpty(data) && <NoContent message="No analysis data available" />}
          {!hasLayers &&
            !hasWidgets &&
            !loading && (
              <NoContent>
                Select a{' '}
                <button
                  onClick={() =>
                    setMenuSettings({
                      menuSection: 'datasets',
                      datasetCategory: 'forestChange'
                    })
                  }
                >
                  forest change
                </button>{' '}
                data layer to analyze.
              </NoContent>
            )}
          {(hasLayers || hasWidgets) &&
            !loading &&
            !error && (
              <Fragment>
                <ul className="draw-stats">
                  {data && data.map(d => this.renderStatItem(d))}
                </ul>
                <Widgets simple analysis widgets={widgets} />
                <div className="disclaimers">
                  {zoomLevel < 11 && (
                    <p>
                      This algorithm approximates the results by sampling the
                      selected area. Results are more accurate at closer zoom
                      levels.
                    </p>
                  )}
                  {!!treeCoverGain &&
                    !!treeCoverLoss && (
                      <p>
                        <b>NOTE:</b> tree cover loss and gain statistics cannot
                        be compared against each other.{' '}
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
                    )}
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

ShowAnalysis.propTypes = {
  data: PropTypes.array,
  setShareModal: PropTypes.func,
  clearAnalysis: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  fullLocationName: PropTypes.string,
  setModalSources: PropTypes.func,
  handleShowDownloads: PropTypes.func,
  setMenuSettings: PropTypes.func,
  showDownloads: PropTypes.bool,
  hasLayers: PropTypes.bool,
  hasWidgets: PropTypes.bool,
  downloadUrls: PropTypes.array,
  widgets: PropTypes.array,
  zoomLevel: PropTypes.number
};

export default ShowAnalysis;
