import { createElement } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import WidgetTreeLocatedComponent from './widget-tree-located-component';
import actions from './widget-tree-located-actions';

export { initialState } from './widget-tree-located-reducers';
export { default as reducers } from './widget-tree-located-reducers';
export { default as actions } from './widget-tree-located-actions';

import {
  getTotalCover,
  getTotalCoverRegions
} from '../../../../services/tree-cover';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeLocated.isLoading,
  iso: state.root.iso,
  countryRegions: state.root.countryRegions,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  topRegions: state.widgetTreeLocated.topRegions,
  paginate: state.widgetTreeLocated.paginate,
  dataSources: state.widgetTreeLocated.dataSources,
  units: state.widgetTreeLocated.units,
  canopies: state.widgetTreeLocated.canopies,
  settings: state.widgetTreeLocated.settings
});

const WidgetTreeLocatedContainer = (props) => {

  const setInitialData = (props) => {
    setWidgetData(props);
  };

  const updateData = (props) => {
    props.setTreeLocatedIsLoading(true);
    setWidgetData(props);
  };

  const setWidgetData = (props) => {
    getTotalCover(props.iso, props.countryRegion, props.settings.canopy)
      .then((totalCoverResponse) => {
        getTotalCoverRegions(props.iso, props.settings.canopy)
          .then((totalCoverRegions) => {
            let regionsForest = [];
            const totalCover = Math.round(totalCoverResponse.data.data[0].value);
            totalCoverRegions.data.data.forEach(function(item, index){
              const numberRegion = (_.findIndex(props.countryRegions, function(x) { return x.id === item.adm1; }));
              regionsForest.push({
                name: props.countryRegions[numberRegion].name,
                value: props.settings.unit === 'Ha' ? item.value : (item.value / totalCover) * 100,
                position: index + 1
              });
            });
            props.setTreeLocatedValues(regionsForest);
          });
      });
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
