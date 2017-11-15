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
  countryRegions: state.root.countryRegions,
  countryData: state.root.countryData,
  totalCover: state.widgetTreeCover.totalCover,
  totalIntactForest: state.widgetTreeCover.totalIntactForest,
  totalNonForest: state.widgetTreeCover.totalNonForest,
  title: state.widgetTreeCover.title,
  locations: state.widgetTreeCover.locations,
  units: state.widgetTreeCover.units,
  canopies: state.widgetTreeCover.canopies,
  settings: state.widgetTreeCover.settings
});

const WidgetTreeCoverContainer = (props) => {
  const setInitialData = (props) => {
    setWidgetData(props);
  };

  const updateData = (props) => {
    props.setTreeCoverIsLoading(true);
    setWidgetData(props);
  };

  const setWidgetData = (props) => {
    getTotalCover(props.iso, props.countryRegion, props.settings.canopy)
      .then((totalCoverResponse) => {
        getTotalIntactForest(props.iso, props.countryRegion)
          .then((totalIntactForestResponse) => {
            if (totalIntactForestResponse.data.data.length > 0) {
              const totalCover = Math.round(totalCoverResponse.data.data[0].value),
                totalIntactForest = Math.round(totalIntactForestResponse.data.data[0].value),
                totalNonForest = Math.round(props.countryData.area_ha) - (totalCover + totalIntactForest),
                values = {
                  totalCover: totalCover,
                  totalIntactForest:  totalIntactForest,
                  totalNonForest: totalNonForest,
                  title: props.getTitle(props),
                  locations: [
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
            }
          });
      });
  };

  const getTitle = (props) => {
    const location = props.settings.location !== 'all' ? ` and ${props.settings.locationLabel}` : '';
    const country = props.countryRegion === 0 ? props.countryData.name : props.countryRegions[props.countryRegion - 1].name;
    return `Forest cover ${location} in ${country}`;
  };

  const viewOnMap = () => {
    props.setLayers(['forest2000', 'ifl_2013_deg']);
  };

  return createElement(WidgetTreeCoverComponent, {
    ...props,
    setInitialData,
    updateData,
    getTitle,
    viewOnMap
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
