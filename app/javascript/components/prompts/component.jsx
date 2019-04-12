import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

import PromptTooltip from 'components/prompts/prompt-tooltip';

class PromptTour extends PureComponent {
  render() {
    const {
      open,
      steps,
      title,
      stepIndex,
      handleStateChange,
      settings,
      showPrompts,
      handleShowPrompts
    } = this.props;

    return open ? (
      <Joyride
        steps={steps}
        run={open}
        stepIndex={stepIndex}
        continuous
        floaterProps={{
          styles: {
            floater: {
              transition: 'none'
            }
          },
          disableAnimation: true
        }}
        callback={data => {
          const { action, index, type, status, step } = data;
          const { actions } = step || {};

          if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            // Need to set our running state to false, so we can restart if we click start again.
            handleStateChange({ open: false, stepIndex: 0 });
          } else if (data.action === 'close' || data.type === 'tour:end') {
            handleStateChange({
              stepIndex: 0,
              open: false
            });
          } else if (
            [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)
          ) {
            const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
            // Update state to advance the tour
            if (action === 'prev' && actions && actions.prev) {
              actions.prev();
              setTimeout(() => {
                handleStateChange({
                  stepIndex: newStepIndex
                });
              }, 500);
            } else if (action === 'next' && actions && actions.next) {
              actions.next();
              setTimeout(() => {
                handleStateChange({
                  stepIndex: newStepIndex
                });
              }, 500);
            } else {
              handleStateChange({
                stepIndex: newStepIndex
              });
            }
          }
        }}
        spotlightPadding={0}
        tooltipComponent={step => (
          <PromptTooltip
            {...step}
            title={title}
            showPrompts={showPrompts}
            handleShowPrompts={handleShowPrompts}
          />
        )}
        styles={{
          options: {
            overlayColor: 'rgba(17, 55, 80, 0.4)',
            zIndex: 2000,
            arrowColor: '#333'
          }
        }}
        {...settings}
      />
    ) : null;
  }
}

PromptTour.propTypes = {
  open: PropTypes.bool,
  steps: PropTypes.array,
  setTourClosed: PropTypes.func,
  title: PropTypes.string,
  stepIndex: PropTypes.number,
  handleStateChange: PropTypes.func,
  settings: PropTypes.object,
  showPrompts: PropTypes.bool,
  handleShowPrompts: PropTypes.func
};

export default PromptTour;
