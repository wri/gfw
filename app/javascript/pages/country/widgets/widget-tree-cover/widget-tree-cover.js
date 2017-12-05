import { createElement } from 'react';
import { connect } from 'react-redux';

import { getTotalCover, getTotalIntactForest } from 'services/tree-extent';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

const mapStateToProps = state => {
  const { isCountriesLoading, isRegionsLoading } = state.countryData;
  return {
    location: state.location.payload,
    areaHa: state.countryData.geostore.areaHa,
    isLoading: state.widgetTreeCover.isLoading,
    admin1List: state.countryData.regions,
    totalCover: state.widgetTreeCover.totalCover,
    totalIntactForest: state.widgetTreeCover.totalIntactForest,
    totalNonForest: state.widgetTreeCover.totalNonForest,
    title: state.widgetTreeCover.title,
    locations: state.widgetTreeCover.locations,
    units: state.widgetTreeCover.units,
    canopies: state.widgetTreeCover.canopies,
    settings: state.widgetTreeCover.settings,
    isMetaLoading: isCountriesLoading || isRegionsLoading
  };
};

const WidgetTreeCoverContainer = props => {
  const setInitialData = () => {
    setWidgetData(props);
  };

  const updateData = newProps => {
    newProps.setTreeCoverIsLoading(true);
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    const {
      location,
      areaHa,
      settings,
      setTreeCoverValues,
      setTreeCoverIsLoading
    } = newProps;
    getTotalCover(location.country, location.region, settings.canopy).then(
      totalCoverResponse => {
        getTotalIntactForest(location.country, location.region).then(
          totalIntactForestResponse => {
            if (totalIntactForestResponse.data.data.length > 0) {
              const totalCover = Math.round(
                totalCoverResponse.data.data[0].value
              );
              const totalIntactForest = Math.round(
                totalIntactForestResponse.data.data[0].value
              );
              const totalNonForest =
                Math.round(areaHa) - (totalCover + totalIntactForest);
              const values = {
                totalCover,
                totalIntactForest,
                totalNonForest,
                title: getTitle(newProps),
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
              setTreeCoverValues(values);
            }
            setTreeCoverIsLoading(false);
          }
        );
      }
    );
  };

  const getTitle = newProps => {
    const { locationNames, settings } = newProps;

    const region =
      settings.location !== 'all' ? ` and ${settings.locationLabel}` : '';

    return `Forest cover ${region} in ${locationNames.country &&
      locationNames.country.label}`;
  };

  const viewOnMap = () => {
    props.setLayers(['forest2000', 'ifl_2013_deg']);
  };

  return createElement(WidgetTreeCoverComponent, {
    ...props,
    setInitialData,
    updateData,
    viewOnMap
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
