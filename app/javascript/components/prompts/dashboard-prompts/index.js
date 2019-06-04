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
      recentImagery: {
        title: 'Recent Satellite Imagery',
        steps: [
          {
            target: '.recent-imagery-btn',
            content:
              'Display recent satellite imagery over an area, filtered by date and cloud cover.',
            disableBeacon: true,
            actions: {
              learnHow: () => {}
            }
          }
        ],
        settings: {
          disableOverlay: true
        }
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
