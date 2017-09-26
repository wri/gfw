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
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  regionData: state.widgetTreeCoverLossAreas.regionData,
  startYear: 2011,
  endYear: 2015
});

const WidgetTreeCoverLossAreasContainer = (props) => {
  const setInitialData = (props) => {
    props.setPieCharDataDistricts([
      { name: 'Minas Gerais', value: 1200, color: '#510626' },
      { name: 'Bahia', value: 1100, color: '#730735' },
      { name: 'Amazonas', value: 900, color: '#af0f54' },
      { name: 'Maranhao', value: 550, color: '#f5247e' },
      { name: 'Distrito Federal', value: 464, color: '#f3599b' },
      { name: 'Ceará', value: 460, color: '#fb9bc4' },
      { name: 'Espírito Santo', value: 440, color: '#f1c5d8' },
      { name: 'Goiás', value: 420, color: '#e9e7a6' },
      { name: 'Maranhão', value: 300, color: '#dad781' },
      { name: 'Mato Grosso', value: 203, color: '#cecb65' },
      { name: 'Other Districts', value: 3000, color: '#e9e9ea' }
    ]);
  };
  return createElement(WidgetTreeCoverLossAreasComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverLossAreasContainer);
