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
  countryRegions: state.root.countryRegions,
  countryData: state.root.countryData,
  regionData: state.widgetTreeCoverLossAreas.regionData,
  regionChartData: state.widgetTreeCoverLossAreas.regionChartData,
  startYear: 2001,
  endYear: 2015,
  thresh: 30,
  startArray: state.widgetTreeCoverLossAreas.startArray,
  endArray: state.widgetTreeCoverLossAreas.endArray
});

import {
  getTreeLossByRegion
} from '../../../../services/tree-loss';

const regionsForestLoss = [];
const regionForestLossChart = [];
const colors = ['#510626', '#730735', '#af0f54', '#f5247e', '#f3599b', '#fb9bc4', '#f1c5d8', '#e9e7a6', '#dad781', '#cecb65', '#929292'];
let indexColors = 0;
let othersValue = 0;

const WidgetTreeCoverLossAreasContainer = (props) => {

  const moreRegion = () => {
    const value = {
      startArray: props.startArray + 10,
      endArray: props.endArray + 10,
    }
    props.setArrayCoverAreasLoss(value);
  };

  const lessRegion = () => {
    const value = {
      startArray: props.startArray - 10,
      endArray: props.endArray - 10,
    }
    props.setArrayCoverAreasLoss(value);
  };

  const setInitialData = (props) => {
    let nameChart = '';
    let valueChart = 0;
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
          color: colors[indexColors],
          position: index + 1
        })
        if(indexColors < 10 || index === treeLossByRegion.data.data.length - 1) {
          if(indexColors < 10) { nameChart = props.countryRegions[numberRegion].name; valueChart = item.value;}
          if(index === treeLossByRegion.data.data.length - 1) { nameChart = 'others'; valueChart = othersValue;}
          regionForestLossChart.push({
            name: nameChart,
            color: colors[indexColors],
            value: valueChart,
          })
        } else {
          othersValue += item.value;
        }
        if (indexColors < 10) {
          indexColors += 1;
        }
      });
        props.setPieChartDataTotal(regionForestLossChart);
        props.setPieCharDataDistricts(regionsForestLoss);
    });
  };
  return createElement(WidgetTreeCoverLossAreasComponent, {
    ...props,
    setInitialData,
    moreRegion,
    lessRegion
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverLossAreasContainer);
