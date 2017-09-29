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
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  areaData: state.widgetAreasMostCoverGain.areaData,
  startYear: 2011,
  endYear: 2015
});

import {
  getTreeCoverGainRegion
} from '../../../../services/tree-gain';

import {
  getCountryRegions
} from '../../../../services/country';

const regionsCoverGain = [];
const colors = ['#110f74', '#2422a2', '#4c49d1', '#6f6de9', '#a3a1ff', '#cdcdfe', '#ddddfc', '#e7e5a4', '#dad781', '#cecb65'];

const WidgetAreasMostCoverGainContainer = (props) => {
  const setInitialData = (props) => {
    getTreeCoverGainRegion(
      props.iso,
      {minYear: props.startYear, maxYear: props.endYear},
      props.thresh
    )
    .then((treeCoverGainByRegion) => {
      getCountryRegions(props.iso)
      .then((countryRegions) => {
        treeCoverGainByRegion.data.data.forEach(function(item, index){
          const numberRegion = (_.findIndex(countryRegions.data.data, function(x) { return x.id === item.adm1; }));
          regionsCoverGain.push({
            name: countryRegions.data.data[numberRegion].name,
            value: item.value,
            color: colors[index]
          })
        });
          props.setPieCharDataAreas(regionsCoverGain);
      });
    });
  };
  return createElement(WidgetAreasMostCoverGainComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetAreasMostCoverGainContainer);
