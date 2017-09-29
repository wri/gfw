import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

import {
  getTotalCover,
  getTotalIntactForest
} from '../../../../services/tree-cover';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCover.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  totalCover: state.widgetTreeCover.totalCover,
  totalIntactForest: state.widgetTreeCover.totalIntactForest,
  totalNonForest: state.widgetTreeCover.totalNonForest,
  regions: state.widgetTreeCover.regions,
  units: state.widgetTreeCover.units,
  settings: state.widgetTreeCover.settings
});

const WidgetTreeCoverContainer = (props) => {
  const setInitialData = (props) => {
    getTotalCover(props.iso, props.countryRegion, props.settings.canopy)
      .then((totalCoverResponse) => {
        getTotalIntactForest(props.iso, props.countryRegion)
          .then((totalIntactForestResponse) => {
            const totalCover = Math.round(totalCoverResponse.data.data[0].value),
              totalIntactForest = Math.round(totalIntactForestResponse.data.data[0].value),
              values = {
                totalCover: totalCover,
                totalIntactForest: totalIntactForest,
                totalNonForest: Math.round(props.countryData.area_ha) - (totalCover + totalIntactForest),
                regions: [
                  {
                    value: 'all',
                    label: 'All Region'
                  },
                  {
                    value: 'managed',
                    label: 'Managed'
                  },
                  {
                    value: 'protected_areas',
                    label: 'Protected Areas'
                  },
                  {
                    value: 'ifls',
                    label: 'IFLs'
                  }
                ]
              };
              props.setTreeCoverValues(values);
          });
      });
  };

  const viewOnMap = () => {
    props.setLayer('forest2000');
  };

  return createElement(WidgetTreeCoverComponent, {
    ...props,
    setInitialData,
    viewOnMap
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
