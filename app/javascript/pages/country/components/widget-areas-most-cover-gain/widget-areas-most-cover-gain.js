import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetAreasMostCoverGainComponent from './widget-areas-most-cover-gain-component';
import actions from './widget-areas-most-cover-gain-actions';

export { initialState } from './widget-areas-most-cover-gain-reducers';
export { default as reducers } from './widget-areas-most-cover-gain-reducers';
export { default as actions } from './widget-areas-most-cover-gain-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetAreasMostCoverGain.isLoading,
  iso: state.root.iso,
  countryRegions: state.root.countryRegions,
  countryData: state.root.countryData,
  areaData: state.widgetAreasMostCoverGain.areaData,
  areaChartData: state.widgetAreasMostCoverGain.areaChartData,
  startYear: 2011,
  endYear: 2015,
  thresh: 30,
  startArray: state.widgetAreasMostCoverGain.startArray,
  endArray: state.widgetAreasMostCoverGain.endArray,
  regions: state.widgetAreasMostCoverGain.regions,
  units: state.widgetAreasMostCoverGain.units,
  settings: state.widgetAreasMostCoverGain.settings,
});

import {
  getTreeCoverGainRegion
} from '../../../../services/tree-gain';

const colors = ['#110f74', '#2422a2', '#4c49d1', '#6f6de9', '#a3a1ff', '#cdcdfe', '#ddddfc', '#e7e5a4', '#dad781', '#cecb65', '#d1d1d1'];
let indexColors = 0;
let othersValue = 0;

const WidgetAreasMostCoverGainContainer = (props) => {

  const moreRegion = () => {
    const value = {
      startArray: props.startArray + 10,
      endArray: props.endArray + 10,
    }
    props.setArrayCoverAreasGain(value);
  };

  const lessRegion = () => {
    const value = {
      startArray: props.startArray - 10,
      endArray: props.endArray - 10,
    }
    props.setArrayCoverAreasGain(value);
  };

  const setInitialData = (props) => {
    let nameChart = '';
    let valueChart = 0;
    getTreeCoverGainRegion(
      props.iso,
      {minYear: props.startYear, maxYear: props.endYear},
      props.thresh
    )
    .then((treeCoverGainByRegion) => {
      const regionsCoverGain = [];
      const regionCoverGainChart = [];
      treeCoverGainByRegion.data.data.forEach(function(item, index){
        const numberRegion = (_.findIndex(props.countryRegions, function(x) { return x.id === item.adm1; }));
        regionsCoverGain.push({
          name: props.countryRegions[numberRegion].name,
          value: item.value,
          color: colors[indexColors],
          position: index + 1,
        })
        if(indexColors < 10 || index === treeCoverGainByRegion.data.data.length - 1) {
          if(indexColors < 10) { nameChart = props.countryRegions[numberRegion].name; valueChart = item.value;}
          if(index === treeCoverGainByRegion.data.data.length - 1) { nameChart = 'others'; valueChart = othersValue;}
          regionCoverGainChart .push({
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
        if (index === treeCoverGainByRegion.data.data.length - 1) {
          indexColors = 0;
          othersValue = 0;
        }
      });
      props.setPieCharDataAreas(regionsCoverGain);
      props.setPieCharDataAreasTotal(regionCoverGainChart);
    });
  };
  return createElement(WidgetAreasMostCoverGainComponent, {
    ...props,
    setInitialData,
    moreRegion,
    lessRegion
  });
};

export default connect(mapStateToProps, actions)(WidgetAreasMostCoverGainContainer);
