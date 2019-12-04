import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { track } from 'app/analytics';

import Button from 'components/ui/button/button-component';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'components/analysis/components/chose-analysis';
import ShowAnalysis from 'components/analysis/components/show-analysis';

import './styles.scss';

class AnalysisComponent extends PureComponent {
  static propTypes = {
    clearAnalysis: PropTypes.func,
    className: PropTypes.string,
    endpoints: PropTypes.array,
    widgetLayers: PropTypes.array,
    loading: PropTypes.bool,
    location: PropTypes.object,
    goToDashboard: PropTypes.func,
    error: PropTypes.string,
    handleCancelAnalysis: PropTypes.func,
    handleFetchAnalysis: PropTypes.func,
    embed: PropTypes.bool,
    setSubscribeSettings: PropTypes.func,
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
      clearAnalysis,
      goToDashboard,
      error,
      handleCancelAnalysis,
      handleFetchAnalysis,
      setSubscribeSettings,
      endpoints,
      widgetLayers,
      embed
    } = this.props;
    const hasLayers = endpoints && !!endpoints.length;
    const hasWidgetLayers = widgetLayers && !!widgetLayers.length;

    const linkProps = {
      link: `/dashboards/${location.type}${
        location.adm0 ? `/${location.adm0}` : ''
      }${location.adm1 ? `/${location.adm1}` : ''}${
        location.adm2 ? `/${location.adm2}` : ''
      }`,
      ...(embed && {
        extLink: window.location.href.replace('embed/map', 'dashboards'),
        target: '_blank'
      })
    };

    return (
      <Fragment>
        <div className={cx('c-analysis', className)}>
          {loading && (
            <Loader className={cx('analysis-loader', { fetching: loading })} />
          )}
          {location.type &&
            location.adm0 &&
            (loading || (!loading && error)) && (
            <div className={cx('cancel-analysis', { fetching: loading })}>
              {!loading &&
                  error && (
                  <Button
                  className="refresh-analysis-btn"
                  onClick={() => handleFetchAnalysis(location, endpoints)}
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
          {location.type && location.adm0 ? (
            <ShowAnalysis
              clearAnalysis={clearAnalysis}
              goToDashboard={goToDashboard}
              hasLayers={hasLayers}
              hasWidgetLayers={hasWidgetLayers}
              analysis
            />
          ) : (
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
          location.adm0 && (
          <div className="analysis-actions">
            {location.type === 'country' && (
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
            <Button
              className="analysis-action-btn subscribe-btn"
              onClick={() => setSubscribeSettings({ open: true })}
            >
                SUBSCRIBE
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default AnalysisComponent;
