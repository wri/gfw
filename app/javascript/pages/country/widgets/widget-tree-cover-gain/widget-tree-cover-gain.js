import { createElement } from 'react';
import { connect } from 'react-redux';

import {
  getTreeCoverGain,
  getTotalCountriesTreeCoverGain
} from 'services/tree-gain';

import WidgetTreeCoverGainComponent from './widget-tree-cover-gain-component';
import actions from './widget-tree-cover-gain-actions';

export { initialState } from './widget-tree-cover-gain-reducers';
export { default as reducers } from './widget-tree-cover-gain-reducers';
export { default as actions } from './widget-tree-cover-gain-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  isLoading: state.widgetTreeCoverGain.isLoading,
  totalAmount: state.widgetTreeCoverGain.totalAmount,
  percentage: state.widgetTreeCoverGain.percentage,
  settings: state.widgetTreeCoverGain.settings,
  locations: state.widgetTreeCoverGain.locations
});

const WidgetTreeCoverGainContainer = props => {
  const setInitialData = newProps => {
    setWidgetData(newProps);
  };

  const updateData = newProps => {
    newProps.setTreeCoverGainIsLoading(true);
    setWidgetData(newProps);
  };

  const setWidgetData = newProps => {
    const { location, settings, setTreeCoverGainValues } = newProps;

    getTreeCoverGain(
      location.admin0,
      location.admin1,
      {
        minYear: settings.startYear,
        maxYear: settings.endYear
      },
      settings.canopy
    ).then(coverGain => {
      getTotalCountriesTreeCoverGain(
        {
          minYear: settings.startYear,
          maxYear: settings.endYear
        },
        settings.canopy
      ).then(totalCoverGain => {
        const percentage =
          coverGain.data.data[0].value / totalCoverGain.data.data[0].value;
        const values = {
          totalAmount: coverGain.data.data[0].value,
          percentage: percentage * 100
        };
        setTreeCoverGainValues(values);
      });
    });
  };

  return createElement(WidgetTreeCoverGainComponent, {
    ...props,
    setInitialData,
    updateData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer);
