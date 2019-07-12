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
      dashboard: {
        title: 'Select a country or subnational area',
        steps: [
          {
            target: '.select-container',
            content: 'View dashboards for countries and subnational areas.',
            disableBeacon: true,
            actions: {
              learnHow: () => {}
            }
          }
        ],
        settings: {
          disableOverlay: true
        }
      },
      analyses: {
        title: 'Explore analyses',
        steps: [
          {
            target: '.select-container',
            content: 'Explore available analyses for different topics.',
            disableBeacon: true,
            actions: {
              learnHow: () => {}
            }
          }
        ]
      },
      settings: {
        title: 'Change widget settings',
        steps: [
          {
            target: '.select-container',
            content:
              'Customize analyses by filtering data, selecting the time range and more.',
            disableBeacon: true,
            actions: {
              learnHow: () => {}
            }
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
            disableBeacon: true,
            actions: {
              learnHow: () => {}
            }
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
