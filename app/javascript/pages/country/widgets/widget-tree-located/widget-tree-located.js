import { createElement } from 'react';
import { connect } from 'react-redux';

import { getExtent } from 'services/forest-data';
import { getCanopies } from 'pages/country/utils/filters';

import WidgetTreeLocatedComponent from './widget-tree-located-component';
import actions from './widget-tree-located-actions';

export { initialState } from './widget-tree-located-reducers';
export { default as reducers } from './widget-tree-located-reducers';
export { default as actions } from './widget-tree-located-actions';

const mapStateToProps = state => {
  const { isCountriesLoading, isRegionsLoading } = state.countryData;
  return {
    location: state.location.payload,
    regions: state.countryData.regions,
    isLoading: state.widgetTreeLocated.isLoading,
    topRegions: state.widgetTreeLocated.topRegions,
    paginate: state.widgetTreeLocated.paginate,
    dataSources: state.widgetTreeLocated.dataSources,
    units: state.widgetTreeLocated.units,
    canopies: getCanopies(),
    settings: state.widgetTreeLocated.settings,
    isMetaLoading: isCountriesLoading || isRegionsLoading
  };
};

const WidgetTreeLocatedContainer = props => {
  const setInitialData = newProps => {
    setWidgetData(newProps);
  };

  const updateData = newProps => {
    newProps.setTreeLocatedIsLoading(true);
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    const {
      location,
      regions,
      settings,
      setTreeLocatedValues,
      setTreeLocatedIsLoading
    } = newProps;
    setTreeLocatedIsLoading(true);
    getExtent(location.country, location.region, settings.canopy).then(
      totalCoverResponse => {
        getExtent(location.country, settings.canopy).then(totalCoverRegions => {
          const regionsForest = [];
          const totalCover = Math.round(totalCoverResponse.data.data[0].value);
          totalCoverRegions.data.data.forEach((item, index) => {
            const region = regions.find(r => item.adm1 === r.value) || null;
            if (region) {
              regionsForest.push({
                name: region.label,
                value:
                  settings.unit === 'ha'
                    ? item.value
                    : item.value / totalCover * 100,
                position: index + 1
              });
            }
          });
          setTreeLocatedValues(regionsForest);
          setTreeLocatedIsLoading(false);
        });
      }
    );
  };

  const nextPage = () => {
    props.setTreeLocatedPage(props.paginate.page + 1);
  };

  const previousPage = () => {
    props.setTreeLocatedPage(props.paginate.page - 1);
  };

  return createElement(WidgetTreeLocatedComponent, {
    ...props,
    setInitialData,
    nextPage,
    previousPage,
    updateData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLocatedContainer);
