import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetPlantationAreaComponent from './widget-plantation-area-component';
import actions from './widget-plantation-area-actions';

export { initialState } from './widget-plantation-area-reducers';
export { default as reducers } from './widget-plantation-area-reducers';
export { default as actions } from './widget-plantation-area-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetPlantationArea.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  plantationAreaData: state.widgetPlantationArea.plantationAreaData,
  startYear: 2011,
  endYear: 2015,
  units: state.widgetPlantationArea.units,
  settings: state.widgetPlantationArea.settings,
});

const WidgetPlantationAreaContainer = (props) => {
  const setInitialData = (props) => {
    props.setPlantationAreaData([
      {name: 'Minas Gerais', one_0: 230, two_0: 335, three_0: 453},
      {name: 'Bahia', one_1: 300, two_1: 135, three_1: 953},
      {name: 'Amazonas', one_2: 20, two_2: 535, three_2: 253},
      {name: 'Maranhao', one_3: 189, two_3: 635, three_3: 153},
      {name: 'Distrito Federal', one_4: 234, two_4: 335, three_4: 453},
    ]);
  };
  return createElement(WidgetPlantationAreaComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetPlantationAreaContainer);
