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
  startArray: state.widgetTreeLocated.startArray,
  endArray: state.widgetTreeLocated.endArray
});

const regionsForest = [];
const colors = ['#113002', '#266307', '#2d8700', '#40ac0a', '#55ce19', '#73e23c', '#a5ed81', '#cfcb65', '#dad781', '#cecb65', '#929292'];
let indexColors = 0;

const WidgetTreeLocatedContainer = (props) => {

  const moreRegion = () => {
    const value = {
      startArray: props.startArray + 10,
      endArray: props.endArray + 10,
    }
    props.setArrayLocated(value);
  };

  const lessRegion = () => {
    const value = {
      startArray: props.startArray - 10,
      endArray: props.endArray - 10,
    }
    props.setArrayLocated(value);
  };

  const setInitialData = (props) => {
    getTotalCover(props.iso, props.countryRegion, 30)
      .then((totalCoverResponse) => {
        getTotalCoverRegions(props.iso, 30)
          .then((totalCoverRegions) => {
            const totalCover = Math.round(totalCoverResponse.data.data[0].value);
            totalCoverRegions.data.data.forEach(function(item, index){
              const numberRegion = (_.findIndex(props.countryRegions, function(x) { return x.id === item.adm1; }));
              regionsForest.push({
                name: props.countryRegions[numberRegion].name,
                value: item.value,
                percent: (item.value / totalCover) * 100,
                position: index + 1,
                color: colors[indexColors]
              })
              if (indexColors < 10) {
                indexColors += 1;
              }
            });
            props.setTreeLocatedValues(regionsForest);
          });
      });
  };
  return createElement(WidgetTreeLocatedComponent, {
    ...props,
    setInitialData,
    moreRegion,
    lessRegion
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLocatedContainer);
