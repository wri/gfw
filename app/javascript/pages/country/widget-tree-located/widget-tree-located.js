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
  isLoading: state.widgetTreeLocated.isLoading,
  iso: state.root.iso,
  admin1: state.root.admin1,
  countryData: state.root.countryData,
  admin1List: state.root.admin1List,
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
    getTotalCover(newProps.iso, newProps.admin1, newProps.settings.canopy).then(
      totalCoverResponse => {
        getTotalCoverRegions(newProps.iso, newProps.settings.canopy).then(
          totalCoverRegions => {
            const regionsForest = [];
            const totalCover = Math.round(
              totalCoverResponse.data.data[0].value
            );
            totalCoverRegions.data.data.forEach((item, index) => {
              const numberRegion = _.findIndex(
                newProps.admin1List,
                x => x.id === item.adm1
              );
              regionsForest.push({
                name: newProps.admin1List[numberRegion].name,
                value:
                  newProps.settings.unit === 'ha'
                    ? item.value
                    : item.value / totalCover * 100,
                position: index + 1
              });
            });
            newProps.setTreeLocatedValues(regionsForest);
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
