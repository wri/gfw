import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PromptTour from 'components/prompts';

class DashboardPrompts extends PureComponent {
  render() {
    const {
      open,
      stepIndex,
      stepsKey,
      data,
      setTourOpen,
      setDashboardPromptsSettings,
      showPrompts,
      handleShowPrompts
    } = this.props;

    return open && data ? (
      <PromptTour
        title={data.title}
        steps={data.steps}
        open={open}
        stepIndex={stepIndex}
        setTourClosed={setTourOpen}
        showPrompts={showPrompts}
        handleStateChange={state =>
          setDashboardPromptsSettings({ stepsKey, ...state, force: true })
        }
        handleShowPrompts={handleShowPrompts}
        settings={data.settings}
      />
    ) : null;
  }
}

DashboardPrompts.propTypes = {
  open: PropTypes.bool,
  stepIndex: PropTypes.number,
  stepsKey: PropTypes.string,
  data: PropTypes.object,
  setDashboardPromptsSettings: PropTypes.func,
  setTourOpen: PropTypes.func,
  showPrompts: PropTypes.bool,
  handleShowPrompts: PropTypes.func
};

export default DashboardPrompts;
