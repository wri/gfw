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
  isUpdating: state.widgetTreeLocated.isUpdating,
  iso: state.root.iso,
  countryRegions: state.root.countryRegions,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  topRegions: state.widgetTreeLocated.topRegions,
  startArray: state.widgetTreeLocated.startArray,
  endArray: state.widgetTreeLocated.endArray,
  dataSource: state.widgetTreeLocated.dataSource,
  units: state.widgetTreeLocated.units,
  canopies: state.widgetTreeLocated.canopies,
  settings: state.widgetTreeLocated.settings
});

const WidgetTreeLocatedContainer = (props) => {
  const moreRegion = () => {
    props.setArrayLocated({
      startArray: props.startArray + 10,
      endArray: props.endArray + 10,
    });
  };

  const lessRegion = () => {
    props.setArrayLocated({
      startArray: props.startArray - 10,
      endArray: props.endArray - 10,
    });
  };

  const updateData = (props) => {
    props.setTreeLocatedIsUpdating(true);
    setWidgetData(props);
  };

  const setInitialData = (props) => {
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

  return createElement(WidgetTreeLocatedComponent, {
    ...props,
    setInitialData,
    moreRegion,
    lessRegion,
    updateData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLocatedContainer);
