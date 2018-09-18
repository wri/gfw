import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button/button-component';
import MapLegend from 'components/map-v2/components/legend';
import SubNavMenu from 'components/subnav-menu';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'pages/map/components/data-analysis-menu/components/chose-analysis';
import PolygonAnalysis from 'pages/map/components/data-analysis-menu/components/draw-analysis';

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
      fetchingAnalysis,
      clearAnalysis,
      analysisFetch,
      goToDashboard,
      setAnalysisLoading
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
              setAnalysisSettings({ showAnalysis: l.showAnalysis });
              clearAnalysisError();
            }
          }))}
          checkActive
        />
        {!showAnalysis ? (
          <div className="legend">
            <MapLegend />
          </div>
        ) : (
          <div className="analysis">
            {loading && <Loader />}
            {(fetchingAnalysis ||
              (loading && location.type && location.country)) && (
                <div className="cancel-analysis">
                  <Button
                    className="cancel-analysis-btn"
                    onClick={() => {
                      clearAnalysis();
                      if (analysisFetch) {
                        analysisFetch.cancel();
                      }
                      setAnalysisLoading({ loading: false });
                    }}
                  >
                  CANCEL ANALYSIS
                  </Button>
                </div>
              )}
            {location.type && location.country ? (
              <PolygonAnalysis
                clearAnalysis={clearAnalysis}
                goToDashboard={goToDashboard}
              />
            ) : (
              <ChoseAnalysis />
            )}
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
  clearAnalysis: PropTypes.func,
  className: PropTypes.string,
  menuSection: PropTypes.object,
  links: PropTypes.array,
  loading: PropTypes.bool,
  fetchingAnalysis: PropTypes.bool,
  location: PropTypes.object,
  setAnalysisSettings: PropTypes.func,
  clearAnalysisError: PropTypes.func,
  setAnalysisLoading: PropTypes.func,
  analysisFetch: PropTypes.object,
  goToDashboard: PropTypes.func
};

export default DataAnalysisMenu;
