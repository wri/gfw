import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { trackEvent } from 'utils/analytics';
import Link from 'next/link';

import Modal from 'components/modal';
import Icon from 'components/ui/icon';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import Widgets from 'components/widgets';
import DynamicSentence from 'components/ui/dynamic-sentence';
import DownloadData from 'components/analysis/components/download-data';

import screensImg1x from 'assets/images/aois/email-dashboard.png';
import screensImg2x from 'assets/images/aois/email-dashboard@2x.png';
import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';
import shareIcon from 'assets/icons/share.svg?sprite';
import downloadIcon from 'assets/icons/download.svg?sprite';

const isServer = typeof window === 'undefined';

class ShowAnalysis extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    setShareModal: PropTypes.func,
    clearAnalysis: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.string,
    analysisTitle: PropTypes.object,
    analysisDescription: PropTypes.object,
    handleShowDownloads: PropTypes.func,
    setMenuSettings: PropTypes.func,
    showDownloads: PropTypes.bool,
    hasLayers: PropTypes.bool,
    widgetLayers: PropTypes.array,
    downloadUrls: PropTypes.array,
    zoomLevel: PropTypes.number,
    showAnalysisDisclaimer: PropTypes.bool,
    activeArea: PropTypes.object,
  };

  state = {
    disclaimerModalOpen: false,
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
          {threshold && ` with >${threshold}% canopy density`}
        </span>
      </div>
      <div className="value" style={{ color }}>
        {Array.isArray(value) && value.length ? (
          value.map((v) => (
            <strong key={`${v.label}-${v.value}`} style={{ color: v.color }}>
              {formatNumber({
                num: v.value,
                unit: v.unit || unit,
              })}
              <span>{v.label}</span>
            </strong>
          ))
        ) : (
          <strong>
            {formatNumber({
              num: Array.isArray(value) ? 0 : value,
              unit: unit || 'ha',
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
      handleShowDownloads,
      showDownloads,
      downloadUrls,
      hasLayers,
      widgetLayers,
      zoomLevel,
      showAnalysisDisclaimer,
      activeArea,
      analysisTitle,
      analysisDescription,
    } = this.props;
    const hasWidgets = widgetLayers && !!widgetLayers.length;

    // NOTE: this is a horrible code smell but it was the only workaround
    // I was able to find to avoid showing the Natural Forest data without widget in the map.
    const filteredData = data?.filter((d) => d.label !== 'Natural forests');

    return (
      <div className="c-show-analysis">
        <div className="show-analysis-body">
          {analysisTitle && !loading && !error && (
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
                      shareUrl:
                        !isServer &&
                        (window.location.href.includes('embed')
                          ? window.location.href.replace('/embed', '')
                          : window.location.href),
                      embedUrl:
                        !isServer &&
                        (window.location.href.includes('embed')
                          ? window.location.href
                          : window.location.href.replace('/map', '/embed/map')),
                      areaId: activeArea?.id,
                    })}
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
                    trackEvent({
                      category: 'Map analysis',
                      action: 'Download',
                      label:
                        downloadUrls &&
                        downloadUrls.length &&
                        downloadUrls.map((d) => d?.label).join(', '),
                    });
                  }}
                  tooltip={{ text: 'Download data' }}
                >
                  <Icon icon={downloadIcon} className="icon-download" />
                </Button>
              </div>
            </div>
          )}
          {analysisDescription && !loading && !error && (
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
            {!hasLayers && !hasWidgets && !loading && (
              <NoContent>
                Select a{' '}
                <button
                  className="notranslate"
                  onClick={() =>
                    setMenuSettings({
                      menuSection: 'datasets',
                      datasetCategory: 'forestChange',
                    })}
                >
                  forest change
                </button>{' '}
                data layer to analyze.
              </NoContent>
            )}
            {(hasLayers || hasWidgets) && !loading && !error && (
              <Fragment>
                <ul className="draw-stats">
                  {filteredData &&
                    filteredData.map((d) => this.renderStatItem(d))}
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
                    <>
                      <p>
                        <b>NOTE:</b> tree cover loss and gain statistics cannot
                        be compared against each other.{' '}
                        <button
                          onClick={() =>
                            this.setState({ disclaimerModalOpen: true })}
                        >
                          Learn more.
                        </button>
                      </p>
                      <Modal
                        open={this.state.disclaimerModalOpen}
                        title="Comparing Loss and Gain"
                        onRequestClose={() =>
                          this.setState({ disclaimerModalOpen: false })}
                        className="c-loss-disclaimer-modal"
                      >
                        <p>
                          Due to variation in research methodology and/or date
                          of content, tree cover and tree cover loss and gain
                          statistics cannot be compared against each other.
                          Accordingly, “net” loss cannot be calculated by
                          subtracting tree cover gain from tree cover loss, and
                          current (or post-2000) tree cover cannot be determined
                          by subtracting annual tree cover loss from year 2000
                          tree cover.
                        </p>
                        <p>
                          Please also be aware that “tree cover” does not equate
                          to “forest cover.” “Tree cover” refers to the
                          biophysical presence of trees, which may be a part of
                          natural forests or tree plantations. Thus, loss of
                          tree cover may occur for many reasons, including
                          deforestation, fire, and logging within the course of
                          sustainable forestry operations. Similarly, tree cover
                          gain may indicate the growth of tree canopy within
                          natural or managed forests.
                        </p>
                        <p className="credits">
                          <strong>Citation:</strong> Hansen, M. C., P. V.
                          Potapov, R. Moore, M. Hancher, S. A. Turubanova, A.
                          Tyukavina, D. Thau, S. V. Stehman, S. J. Goetz, T. R.
                          Loveland, A. Kommareddy, A. Egorov, L. Chini, C. O.
                          Justice, and J. R. G. Townshend. 2013.
                          “High-Resolution Global Maps of 21st-Century Forest
                          Cover Change.” Science 342 (15 November): 850–53. Data
                          available on-line from:{' '}
                          <a
                            href="http://earthenginepartners.appspot.com/science-2013-global-forest"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            http://earthenginepartners.appspot.com/science-2013-global-forest
                          </a>
                          .
                        </p>
                        <p className="credits">
                          <strong>
                            Suggested citations for data as displayed on GFW:
                          </strong>{' '}
                          Hansen, M. C., P. V. Potapov, R. Moore, M. Hancher, S.
                          A. Turubanova, A. Tyukavina, D. Thau, S. V. Stehman,
                          S. J. Goetz, T. R. Loveland, A. Kommareddy, A. Egorov,
                          L. Chini, C. O. Justice, and J. R. G. Townshend. 2013.
                          “Hansen/UMD/Google/USGS/NASA Tree Cover Loss and Gain
                          Area.” University of Maryland, Google, USGS, and NASA.
                          Accessed through Global Forest Watch on [date].{' '}
                          <a
                            href="https://www.globalforestwatch.org"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            www.globalforestwatch.org
                          </a>
                          .
                        </p>
                      </Modal>
                    </>
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
        {(hasLayers || hasWidgets) && !loading && !error && (
          <div className="save-aois-disclaimer">
            {activeArea ? (
              <div className="content">
                <p>
                  To perform an in-depth analysis of this area please visit the{' '}
                  <Link
                    href="/dashboards/[[...location]]"
                    as={`/dashboards/aoi/${activeArea.id}`}
                  >
                    <a>area dashboard</a>
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="content">
                <h3>Interested in this particular area?</h3>
                <p>
                  Save this area to create a dashboard with a more in-depth
                  analysis and receive email alerts about forest cover change.
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
