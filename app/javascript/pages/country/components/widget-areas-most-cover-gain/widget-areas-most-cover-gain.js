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

const WidgetAreasMostCoverGainContainer = (props) => {
  const setInitialData = (props) => {
    props.setPieCharDataAreas([
      { name: 'Minas Gerais', value: 1200, color: '#110f74' },
      { name: 'Bahia', value: 1100, color: '#2422a2' },
      { name: 'Amazonas', value: 900, color: '#4c49d1' },
      { name: 'Maranhao', value: 550, color: '#6f6de9' },
      { name: 'Distrito Federal', value: 464, color: '#a3a1ff' },
      { name: 'Ceará', value: 460, color: '#cdcdfe' },
      { name: 'Espírito Santo', value: 440, color: '#ddddfc' },
      { name: 'Goiás', value: 420, color: '#e7e5a4' },
      { name: 'Maranhão', value: 300, color: '#dad781' },
      { name: 'Mato Grosso', value: 203, color: '#cecb65' },
      { name: 'Other Districts', value: 3000, color: '#e9e9ea' }
    ]);
  };
  return createElement(WidgetAreasMostCoverGainComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetAreasMostCoverGainContainer);
