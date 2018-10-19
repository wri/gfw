import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button/button-component';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'components/map-v2/components/analysis/components/chose-analysis';
import PolygonAnalysis from 'components/map-v2/components/analysis/components/draw-analysis';

import './styles.scss';

class AnalysisComponent extends PureComponent {
  render() {
    const {
      className,
      loading,
      location,
      clearAnalysis,
      goToDashboard,
      error,
      handleCancelAnalysis,
      handleFetchAnalysis,
      endpoints
    } = this.props;

    return (
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
          <PolygonAnalysis
            clearAnalysis={clearAnalysis}
            goToDashboard={goToDashboard}
          />
        ) : (
          <ChoseAnalysis />
        )}
        {!loading &&
          !error &&
          location.type === 'country' &&
          location.adm0 && (
            <div className="analysis-actions">
              <Button
                extLink={window.location.href.replace('v2/map', 'dashboards')}
                target="_blank"
              >
                OPEN DASHBOARD
              </Button>
            </div>
          )}
      </div>
    );
  }
}

AnalysisComponent.propTypes = {
  clearAnalysis: PropTypes.func,
  className: PropTypes.string,
  endpoints: PropTypes.array,
  loading: PropTypes.bool,
  location: PropTypes.object,
  goToDashboard: PropTypes.func,
  error: PropTypes.string,
  handleCancelAnalysis: PropTypes.func,
  handleFetchAnalysis: PropTypes.func
};

export default AnalysisComponent;
