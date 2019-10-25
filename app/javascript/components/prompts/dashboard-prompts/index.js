import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';
import { getDashboardPromptsProps } from './selectors';

class DashboardPromptsContainer extends PureComponent {
  getStepsData = () => {
    const { stepsKey } = this.props;

    const allSteps = {
      viewNationalDashboards: {
        title: 'Select a country or subnational area',
        steps: [
          {
            target: '.select-container',
            content: 'View dashboards for countries and subnational areas.',
            disableBeacon: true
          }
        ]
      },
      dashboardAnalyses: {
        title: 'Explore analyses',
        steps: [
          {
            target: '.c-subnav-menu',
            content: 'Explore available analyses for different topics.',
            disableBeacon: true
          }
        ]
      },
      widgetSettings: {
        title: 'Change widget settings',
        steps: [
          {
            target: '.c-widget-settings-button',
            content:
              'Customize analyses by filtering data, selecting the time range and more.',
            disableBeacon: true
          }
        ]
      },
      share: {
        title: 'Share widget',
        steps: [
          {
            target: '.select-container',
            content:
              'Share this analysis by copying a link or embedding your map view in another website.',
            disableBeacon: true
          }
        ]
      },
      stats: {
        title: 'Download stats',
        steps: [
          {
            target: '.select-container',
            content:
              'Download tree cover, tree cover loss and tree cover gain statistics.',
            disableBeacon: true,
            actions: {
              learnHow: () => {}
            }
          }
        ]
      }
    };

    return allSteps[stepsKey];
  };

  resetPrompts = () => {
    this.props.setDashboardPromptsSettings({
      open: false,
      stepIndex: 0,
      stepsKey: '',
      force: true
    });
  };

  handleShowPrompts = showPrompts => {
    this.props.setShowDashboardPrompts(showPrompts);
  };

  render() {
    return createElement(Component, {
      ...this.props,
      data: this.getStepsData(),
      handleShowPrompts: this.handleShowPrompts
    });
  }
}

DashboardPromptsContainer.propTypes = {
  setDashboardPromptsSettings: PropTypes.func,
  setShowDashboardPrompts: PropTypes.func,
  stepsKey: PropTypes.string
};

reducerRegistry.registerModule('dashboardPrompts', {
  actions,
  reducers,
  initialState
});

export default connect(getDashboardPromptsProps, {
  ...actions
})(DashboardPromptsContainer);
