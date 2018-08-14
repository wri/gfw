import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MapLegend from 'components/map/components/legend';
import SubNavMenu from 'components/subnav-menu';
import Loader from 'components/ui/loader';
import ChoseAnalysis from 'pages/map/data-analysis-menu/components/chose-analysis';
import PolygonAnalysis from 'pages/map/data-analysis-menu/components/polygon-analysis';
import LocationAnalysis from 'pages/map/data-analysis-menu/components/location-analysis';

import landTreeIcon from 'assets/icons/land-tree.svg';
import truckIcon from 'assets/icons/truck.svg';
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
        icon: landTreeIcon,
        path: `/v2/map/data${search ? `?${search}` : ''}`,
        active: activeTab === 'data'
      },
      {
        label: 'ANALYSIS',
        icon: truckIcon,
        path: `/v2/map/analysis${search ? `?${search}` : ''}`,
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
