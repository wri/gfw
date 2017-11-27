import { createElement } from 'react';
import { connect } from 'react-redux';

import { getTotalCover, getTotalIntactForest } from 'services/tree-cover';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCover.isLoading,
  iso: state.root.iso,
  admin1: state.root.admin1,
  countryData: state.root.countryData,
  admin1List: state.root.admin1List,
  totalCover: state.widgetTreeCover.totalCover,
  totalIntactForest: state.widgetTreeCover.totalIntactForest,
  totalNonForest: state.widgetTreeCover.totalNonForest,
  title: state.widgetTreeCover.title,
  locations: state.widgetTreeCover.locations,
  units: state.widgetTreeCover.units,
  canopies: state.widgetTreeCover.canopies,
  settings: state.widgetTreeCover.settings
});

const WidgetTreeCoverContainer = props => {
  const setInitialData = newProps => {
    setWidgetData(newProps);
  };

  const updateData = newProps => {
    newProps.setTreeCoverIsLoading(true);
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    getTotalCover(newProps.iso, newProps.admin1, newProps.settings.canopy).then(
      totalCoverResponse => {
        getTotalIntactForest(newProps.iso, newProps.admin1).then(
          totalIntactForestResponse => {
            if (totalIntactForestResponse.data.data.length > 0) {
              const totalCover = Math.round(
                totalCoverResponse.data.data[0].value
              );
              const totalIntactForest = Math.round(
                totalIntactForestResponse.data.data[0].value
              );
              const totalNonForest =
                Math.round(newProps.countryData.area_ha) -
                (totalCover + totalIntactForest);
              const values = {
                totalCover,
                totalIntactForest,
                totalNonForest,
                title: newProps.getTitle(newProps),
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
              newProps.setTreeCoverValues(values);
            }
          }
        );
      }
    );
  };

  const getTitle = newProps => {
    const location =
      newProps.settings.location !== 'all'
        ? ` and ${newProps.settings.locationLabel}`
        : '';
    const country =
      newProps.admin1 === 0
        ? newProps.countryData.name
        : newProps.admin1List[newProps.admin1 - 1].name;
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
