import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MapLegend from 'components/map-v2/components/legend';
import SubNavMenu from 'components/subnav-menu';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'pages/map-v2/data-analysis-menu/components/chose-analysis';
import PolygonAnalysis from 'pages/map-v2/data-analysis-menu/components/polygon-analysis';
import LocationAnalysis from 'pages/map-v2/data-analysis-menu/components/location-analysis';

import layersIcon from 'assets/icons/layers.svg';
import analysisIcon from 'assets/icons/analysis.svg';
import './styles.scss';

class DataAnalysisMenu extends PureComponent {
  render() {
    const {
      className,
      activeTab = 'data',
      analysis,
      menuSectionData,
      search
    } = this.props;
    const links = [
      {
        label: 'DATA',
        icon: layersIcon,
        path: `/v2/map/data${search ? `?${search}` : ''}`,
        active: activeTab === 'data'
      },
      {
        label: 'ANALYSIS',
        icon: analysisIcon,
        path: `/v2/map/data${search ? `?${search}` : ''}`,
        active: activeTab === 'analysis'
      }
    ];
    const relocateClass = menuSectionData
      ? `-relocate${menuSectionData.large ? '-big' : ''}`
      : '';

    return (
      <div
        className={`c-data-analysis-menu ${className || ''} ${relocateClass}`}
      >
        <SubNavMenu
          className="nav"
          theme="theme-subnav-plain"
          links={links}
          checkActive
        />
        {activeTab === 'data' ? (
          <div className="legend">
            <MapLegend collapsable={false} maxHeight={500} maxWidth={290} />
          </div>
        ) : (
          <div className="analysis">
            {analysis.loading && <Loader />}
            {!analysis.loading &&
              !analysis.showResults && (
                <ChoseAnalysis selected={analysis.option} />
              )}
            {analysis.option === 'location' &&
              analysis.showResults && <LocationAnalysis />}
            {analysis.option === 'polygon' &&
              analysis.showResults && <PolygonAnalysis />}
          </div>
        )}
      </div>
    );
  }
}

DataAnalysisMenu.propTypes = {
  activeTab: PropTypes.string,
  className: PropTypes.string,
  analysis: PropTypes.object,
  menuSectionData: PropTypes.object,
  search: PropTypes.string
};

export default DataAnalysisMenu;
