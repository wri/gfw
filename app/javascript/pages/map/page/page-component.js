import React, { PureComponent } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import DatasetsProvider from 'providers/datasets-provider';
import LayerSpecProvider from 'providers/layerspec-provider';

import Map from 'components/map';
import MapMenu from 'pages/map/menu';
import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import MapControls from 'components/map/components/map-controls';
import RecentImagery from 'pages/map/recent-imagery';
import DataAnalysisMenu from 'pages/map/data-analysis-menu';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    return (
      <div className="l-map">
        <Map />
        <MapMenu />
        <div className="map-actions">
          <MapControls className="map-controls" share />
          <DragDropContextProvider backend={HTML5Backend}>
            <RecentImagery />
          </DragDropContextProvider>
        </div>
        <DataAnalysisMenu className="data-analysis-menu" />
        <Share />
        <ModalMeta />
        <DatasetsProvider />
        <LayerSpecProvider />
      </div>
    );
  }
}

export default Page;
