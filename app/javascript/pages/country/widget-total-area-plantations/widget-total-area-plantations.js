import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTotalAreaPlantationsComponent from './widget-total-area-plantations-component';
import actions from './widget-total-area-plantations-actions';

export { initialState } from './widget-total-area-plantations-reducers';
export { default as reducers } from './widget-total-area-plantations-reducers';
export { default as actions } from './widget-total-area-plantations-actions';

const mapStateToProps = state => ({
  locationNames: state.root.locationNames,
  isLoading: state.widgetTotalAreaPlantations.isLoading,
  plantationData: state.widgetTotalAreaPlantations.plantationData,
  units: state.widgetTotalAreaPlantations.units,
  settings: state.widgetTotalAreaPlantations.settings
});

const WidgetTotalAreaPlantationsContainer = props => {
  const setInitialData = () => {
    setWidgetData(props);
  };

  const updateData = newProps => {
    newProps.setTotalAreaPlantationsIsLoading(true);
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    const { setTotalAreaPlantationsValues } = newProps;
    setTotalAreaPlantationsValues([
      { name: 'Outside tree plantations', value: 1200, color: '#e9e9ea' },
      {
        name: 'Large industrial tree plantation',
        value: 1100,
        color: '#fba79f'
      },
      {
        name: 'Mosaic of medium-sized tree plantations',
        value: 900,
        color: '#d29eea'
      },
      {
        name: 'Mosaic of small-sized tree plantations',
        value: 550,
        color: '#99cf95'
      },
      {
        name: 'Clearing/ very young tree plantation',
        value: 464,
        color: '#d3b294'
      }
    ]);
  };

  return createElement(WidgetTotalAreaPlantationsComponent, {
    ...props,
    setInitialData,
    updateData
  });
};

export default connect(mapStateToProps, actions)(
  WidgetTotalAreaPlantationsContainer
);
