import { createElement } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getTotalCover, getTotalCoverRegions } from 'services/tree-cover';

import WidgetTreeLocatedComponent from './widget-tree-located-component';
import actions from './widget-tree-located-actions';

export { initialState } from './widget-tree-located-reducers';
export { default as reducers } from './widget-tree-located-reducers';
export { default as actions } from './widget-tree-located-actions';

const mapStateToProps = state => ({
  isRootLoading: state.root.isLoading,
  location: state.location.payload,
  locationNames: state.root.locationNames,
  admin1List: state.root.admin1List,
  isLoading: state.widgetTreeLocated.isLoading,
  topRegions: state.widgetTreeLocated.topRegions,
  paginate: state.widgetTreeLocated.paginate,
  dataSources: state.widgetTreeLocated.dataSources,
  units: state.widgetTreeLocated.units,
  canopies: state.widgetTreeLocated.canopies,
  settings: state.widgetTreeLocated.settings
});

const WidgetTreeLocatedContainer = props => {
  const setInitialData = newProps => {
    setWidgetData(newProps);
  };

  const updateData = newProps => {
    newProps.setTreeLocatedIsLoading(true);
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    const { location, admin1List, settings, setTreeLocatedValues } = newProps;

    getTotalCover(location.admin0, location.admin1, settings.canopy).then(
      totalCoverResponse => {
        getTotalCoverRegions(location.admin0, settings.canopy).then(
          totalCoverRegions => {
            const regionsForest = [];
            const totalCover = Math.round(
              totalCoverResponse.data.data[0].value
            );
            totalCoverRegions.data.data.forEach((item, index) => {
              const numberRegion = _.findIndex(
                admin1List,
                x => x.id === item.adm1
              );
              regionsForest.push({
                name: admin1List[numberRegion].name,
                value:
                  settings.unit === 'ha'
                    ? item.value
                    : item.value / totalCover * 100,
                position: index + 1
              });
            });
            setTreeLocatedValues(regionsForest);
          }
        );
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
