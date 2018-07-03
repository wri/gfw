import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MapLegend from 'components/map/components/legend';
import SubNavMenu from 'components/subnav-menu';
import Loader from 'components/ui/loader';
import Widgets from 'components/widgets';

import landTreeIcon from 'assets/icons/land-tree.svg';
import truckIcon from 'assets/icons/truck.svg';
import './styles.scss';

class DataAnalysisMenu extends PureComponent {
  render() {
    const {
      className,
      activeTab,
      layerGroups,
      legendLoading,
      widgets
    } = this.props;
    const links = [
      {
        label: 'DATA',
        icon: landTreeIcon,
        path: '/v2/map/data',
        active: activeTab === 'data'
      },
      {
        label: 'ANALYSIS',
        icon: truckIcon,
        path: '/v2/map/analysis',
        active: activeTab === 'analysis'
      }
    ];

    return (
      <div className={`c-data-analysis-menu ${className || ''}`}>
        <SubNavMenu
          className="nav"
          theme="theme-subnav-plain"
          links={links}
          checkActive
        />
        {activeTab === 'data' ? (
          <div className="legend">
            {legendLoading && <Loader className="legend-loader" />}
            <MapLegend
              layerGroups={layerGroups}
              collapsable={false}
              maxHeight={500}
              maxWidth={290}
            />
          </div>
        ) : (
          <div className="analysis">
            <Widgets widgets={widgets} />
          </div>
        )}
      </div>
    );
  }
}

DataAnalysisMenu.propTypes = {
  layerGroups: PropTypes.array,
  activeTab: PropTypes.string,
  className: PropTypes.string,
  legendLoading: PropTypes.bool,
  widgets: PropTypes.array
};

export default DataAnalysisMenu;
