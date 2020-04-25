import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { logEvent } from 'app/analytics';
import Link from 'next/link';

import Icon from 'components/ui/icon';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import Widgets from 'components/widgets';
import DynamicSentence from 'components/ui/dynamic-sentence';
import DownloadData from 'components/analysis/components/download-data';

import screensImg1x from 'assets/images/aois/email-dashboard.png?webp';
import screensImg2x from 'assets/images/aois/email-dashboard@2x.png?webp';
import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';
import shareIcon from 'assets/icons/share.svg?sprite';
import downloadIcon from 'assets/icons/download.svg?sprite';

import './styles.scss';

class ShowAnalysis extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    setShareModal: PropTypes.func,
    clearAnalysis: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.string,
    analysisTitle: PropTypes.object,
    analysisDescription: PropTypes.object,
    setModalSources: PropTypes.func,
    handleShowDownloads: PropTypes.func,
    setMenuSettings: PropTypes.func,
    showDownloads: PropTypes.bool,
    hasLayers: PropTypes.bool,
    widgetLayers: PropTypes.array,
    downloadUrls: PropTypes.array,
    zoomLevel: PropTypes.number,
    showAnalysisDisclaimer: PropTypes.bool,
    activeArea: PropTypes.object
  };

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
            <strong key={`${v.label}-${v.value}`} style={{ color: v.color }}>
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
      error,
      setModalSources,
      handleShowDownloads,
      showDownloads,
      downloadUrls,
      hasLayers,
      widgetLayers,
      zoomLevel,
      showAnalysisDisclaimer,
      activeArea,
      analysisTitle,
      analysisDescription
    } = this.props;
    const hasWidgets = widgetLayers && !!widgetLayers.length;

    return (
      <div className="c-show-analysis">
        <div className="show-analysis-body">
          {analysisTitle &&
            !loading &&
            !error && (
              <div className="draw-title">
                <Button
                  className="title-btn left"
                  theme="theme-button-clear"
                  onClick={clearAnalysis}
                >
                  <Icon icon={arrowDownIcon} className="icon-arrow" />
                  {analysisTitle && (
                    <DynamicSentence
                      className="analysis-title"
                      sentence={analysisTitle}
                    />
                  )}
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
                          : window.location.href.replace('/map', '/embed/map')
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
                      logEvent('analysisDownload', {
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
            )}
          {analysisDescription &&
            !loading &&
            !error && (
              <DynamicSentence
                className="analysis-desc"
                sentence={analysisDescription}
              />
            )}
          <div className="results">
            {hasLayers &&
              !hasWidgets &&
              !loading &&
              !error &&
              isEmpty(data) && (
                <NoContent message="No analysis data available" />
              )}
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
                  <Widgets simple analysis />
                  <div className="disclaimers">
                    {zoomLevel < 11 && (
                      <p>
                        This algorithm approximates the results by sampling the
                        selected area. Results are more accurate at closer zoom
                        levels.
                      </p>
                    )}
                    {showAnalysisDisclaimer && (
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
        {(hasLayers || hasWidgets) &&
          !loading &&
          !error && (
            <div className="save-aois-disclaimer">
              {activeArea ? (
                <div className="content">
                  <p>
                    To perform an in-depth analysis of this area please visit
                    the{' '}
                    <Link to={`/dashboards/aoi/${activeArea.id}`}>
                      area dashboard
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="content">
                  <h3>Interested in this particular area?</h3>
                  <p>
                    Save this area to create a dashboard with a more in-depth analysis and receive email alerts about forest cover change.
                  </p>
                </div>
              )}
              <img
                src={screensImg1x}
                srcSet={`${screensImg1x} 1x, ${screensImg2x} 2x`}
                alt="aoi screenshots"
              />
            </div>
          )}
      </div>
    );
  }
}

export default ShowAnalysis;
