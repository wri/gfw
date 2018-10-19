import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button/button-component';
import MapLegend from 'components/map-v2/components/legend';
import SubNavMenu from 'components/subnav-menu';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'components/map-v2/components/data-analysis-menu/components/chose-analysis';
import PolygonAnalysis from 'components/map-v2/components/data-analysis-menu/components/draw-analysis';

import './styles.scss';

class DataAnalysisMenu extends PureComponent {
  render() {
    const {
      className,
      showAnalysis,
      menuSection,
      links,
      setAnalysisSettings,
      clearAnalysisError,
      loading,
      location,
      clearAnalysis,
      goToDashboard,
      error,
      handleCancelAnalysis,
      handleFetchAnalysis,
      endpoints,
      hidden
    } = this.props;

    return (
      <div
        className={cx(
          'c-data-analysis-menu',
          className,
          { '-relocate': !!menuSection },
          { '-big': menuSection && menuSection.large }
        )}
      >
        <SubNavMenu
          className="nav"
          theme="theme-subnav-plain"
          links={links.map(l => ({
            ...l,
            onClick: () => {
              setAnalysisSettings({
                showAnalysis: l.showAnalysis,
                hidden:
                  (showAnalysis && l.active && !hidden) ||
                  (!showAnalysis && l.active && !hidden)
              });
              clearAnalysisError();
            }
          }))}
          checkActive
        />
        {!hidden &&
          !showAnalysis && (
            <div className="legend">
              <MapLegend />
            </div>
          )}
        {!hidden &&
          showAnalysis && (
            <div className="analysis">
              {loading && (
                <Loader
                  className={cx('analysis-loader', { fetching: loading })}
                />
              )}
              {location.type &&
                location.adm0 &&
                (loading || (!loading && error)) && (
                  <div className={cx('cancel-analysis', { fetching: loading })}>
                    {!loading &&
                      error && (
                        <Button
                          className="refresh-analysis-btn"
                          onClick={() =>
                            handleFetchAnalysis(location, endpoints)
                          }
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
                    {!loading &&
                      error && <p className="error-message">{error}</p>}
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
            </div>
          )}
        {!hidden &&
          !loading &&
          showAnalysis &&
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

DataAnalysisMenu.defaultProps = {
  tab: 'data'
};

DataAnalysisMenu.propTypes = {
  showAnalysis: PropTypes.bool,
  hidden: PropTypes.bool,
  clearAnalysis: PropTypes.func,
  className: PropTypes.string,
  menuSection: PropTypes.object,
  endpoints: PropTypes.array,
  links: PropTypes.array,
  loading: PropTypes.bool,
  location: PropTypes.object,
  setAnalysisSettings: PropTypes.func,
  clearAnalysisError: PropTypes.func,
  goToDashboard: PropTypes.func,
  error: PropTypes.string,
  handleCancelAnalysis: PropTypes.func,
  handleFetchAnalysis: PropTypes.func
};

export default DataAnalysisMenu;
