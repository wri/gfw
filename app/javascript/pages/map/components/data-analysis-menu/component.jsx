import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button/button-component';
import MapLegend from 'components/map-v2/components/legend';
import SubNavMenu from 'components/subnav-menu';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'pages/map/components/data-analysis-menu/components/chose-analysis';
import PolygonAnalysis from 'pages/map/components/data-analysis-menu/components/draw-analysis';
// import LocationAnalysis from 'pages/map/components/data-analysis-menu/components/location-analysis';

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
      query,
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
            {fetchingAnalysis && (
              <div className="cancel-analysis">
                <Button
                  className="cancel-analysis-btn"
                  onClick={() => {
                    clearAnalysis(query);
                    analysisFetch.cancel();
                    setAnalysisLoading({ loading: false });
                  }}
                >
                  CANCEL ANALYSIS
                </Button>
              </div>
            )}
            {location.type && location.country ? (
              <PolygonAnalysis />
            ) : (
              <ChoseAnalysis />
            )}
            {/* {option === 'location' &&
              showResults && <LocationAnalysis />}
            {option === 'polygon' &&
              showResults && <PolygonAnalysis />} */}
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
  query: PropTypes.object
};

export default DataAnalysisMenu;
