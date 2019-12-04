import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { track } from 'app/analytics';

import Button from 'components/ui/button/button-component';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'components/analysis/components/chose-analysis';
import ShowAnalysis from 'components/analysis/components/show-analysis';
import NoContent from 'components/ui/no-content';

import './styles.scss';

class AnalysisComponent extends PureComponent {
  static propTypes = {
    clearAnalysis: PropTypes.func,
    className: PropTypes.string,
    endpoints: PropTypes.array,
    widgetLayers: PropTypes.array,
    loading: PropTypes.bool,
    location: PropTypes.object,
    activeArea: PropTypes.object,
    goToDashboard: PropTypes.func,
    error: PropTypes.string,
    handleCancelAnalysis: PropTypes.func,
    handleFetchAnalysis: PropTypes.func,
    embed: PropTypes.bool,
    search: PropTypes.string,
    setSubscribeSettings: PropTypes.func,
    setSaveAOISettings: PropTypes.func,
    setShareModal: PropTypes.func,
    checkingShape: PropTypes.bool,
    uploadingShape: PropTypes.bool
  };

  render() {
    const {
      className,
      loading,
      checkingShape,
      uploadingShape,
      location,
      search,
      activeArea,
      clearAnalysis,
      goToDashboard,
      error,
      handleCancelAnalysis,
      handleFetchAnalysis,
      setSaveAOISettings,
      endpoints,
      widgetLayers,
      embed,
      setShareModal
    } = this.props;
    const hasLayers = endpoints && !!endpoints.length;
    const hasWidgetLayers = widgetLayers && !!widgetLayers.length;

    const linkProps = {
      link: `/dashboards/${location.type}${
        location.adm0 ? `/${location.adm0}` : ''
      }${location.adm1 ? `/${location.adm1}` : ''}${
        location.adm2 ? `/${location.adm2}` : ''
      }${search ? `?${search}` : ''}`,
      ...(embed && {
        extLink: window.location.href.replace('embed/map', 'dashboards'),
        target: '_blank'
      })
    };
    const isDeletedAoI = location.areaId && !activeArea;

    return (
      <Fragment>
        <div className={cx('c-analysis', className)}>
          {loading && (
            <Loader className={cx('analysis-loader', { fetching: loading })} />
          )}
          {!loading &&
            isDeletedAoI && (
            <NoContent
              className="deleted-area-message"
              message="This area has been deleted."
            />
          )}
          {location.type &&
            location.adm0 &&
            !isDeletedAoI &&
            (loading || (!loading && error)) && (
            <div className={cx('cancel-analysis', { fetching: loading })}>
              {!loading &&
                  error && (
                <Button
                  className="refresh-analysis-btn"
                  onClick={() => handleFetchAnalysis(endpoints)}
                >
                      REFRESH ANALYSIS
                </Button>
              )}
              <Button
                className="cancel-analysis-btn"
                onClick={handleCancelAnalysis}
              >
                  CANCEL ANALYSIS
              </Button>
              {!loading && error && <p className="error-message">{error}</p>}
            </div>
          )}
          {location.type &&
            location.adm0 &&
            !isDeletedAoI && (
            <ShowAnalysis
              clearAnalysis={clearAnalysis}
              goToDashboard={goToDashboard}
              hasLayers={hasLayers}
              activeArea={activeArea}
              hasWidgetLayers={hasWidgetLayers}
              analysis
            />
          )}
          {!location.type &&
            !location.adm0 &&
            !isDeletedAoI && (
            <ChoseAnalysis
              checkingShape={checkingShape}
              uploadingShape={uploadingShape}
              handleCancelAnalysis={handleCancelAnalysis}
            />
          )}
        </div>
        {!loading &&
          !error &&
          location.type &&
          !isDeletedAoI &&
          location.adm0 && (
          <div className="analysis-actions">
            {location.type === 'country' &&
                !location.areaId && (
              <Button
                className="analysis-action-btn"
                theme="theme-button-light"
                {...linkProps}
                onClick={() =>
                  track('analysisViewDashboards', {
                    label: location.adm0
                  })
                }
              >
                    DASHBOARD
              </Button>
            )}
            {activeArea && (
              <Button
                className="analysis-action-btn"
                theme="theme-button-light"
                link={activeArea && `/dashboards/aoi/${activeArea.id}`}
                tooltip={{ text: 'Go to Areas of Interest dashboard' }}
              >
                  DASHBOARD
              </Button>
            )}
            {(!activeArea || (activeArea && !activeArea.userArea)) && (
              <Button
                className="analysis-action-btn save-to-mygfw-btn"
                onClick={() => {
                  setSaveAOISettings({ open: true });
                }}
              >
                  SAVE IN MY GFW
              </Button>
            )}
            {activeArea &&
                activeArea.userArea && (
              <Button
                className="analysis-action-btn"
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
                tooltip={{ text: 'Share or embed this area' }}
              >
                    Share area
              </Button>
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

export default AnalysisComponent;
