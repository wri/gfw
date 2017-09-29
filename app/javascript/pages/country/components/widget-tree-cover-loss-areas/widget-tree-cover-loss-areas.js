import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTreeCoverLossAreasComponent from './widget-tree-cover-loss-areas-component';
import actions from './widget-tree-cover-loss-areas-actions';

export { initialState } from './widget-tree-cover-loss-areas-reducers';
export { default as reducers } from './widget-tree-cover-loss-areas-reducers';
export { default as actions } from './widget-tree-cover-loss-areas-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCoverLossAreas.isLoading,
  iso: state.root.iso,
  countryRegions: state.root.countryRegion,
  countryData: state.root.countryData,
  regionData: state.widgetTreeCoverLossAreas.regionData,
  startYear: 2001,
  endYear: 2015,
  thresh: 30
});

import {
  getTreeLossByRegion
} from '../../../../services/tree-loss';

const regionsForestLoss = [];
const colors = ['#510626', '#730735', '#af0f54', '#f5247e', '#f3599b', '#fb9bc4', '#f1c5d8', '#e9e7a6', '#dad781', '#cecb65'];

const WidgetTreeCoverLossAreasContainer = (props) => {
  const setInitialData = (props) => {
    getTreeLossByRegion(
      props.iso,
      {minYear: props.startYear, maxYear: props.endYear},
      props.thresh
    )
    .then((treeLossByRegion) => {
      treeLossByRegion.data.data.forEach(function(item, index){
        const numberRegion = (_.findIndex(props.countryRegions, function(x) { return x.id === item.adm1; }));
        regionsForestLoss.push({
          name: props.countryRegions[numberRegion].name,
          value: item.value,
          color: colors[index]
        })
      });
        props.setPieCharDataDistricts(regionsForestLoss);
    });
  };
  return createElement(WidgetTreeCoverLossAreasComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverLossAreasContainer);
