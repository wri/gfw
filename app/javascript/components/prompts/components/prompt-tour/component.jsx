import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';

import PromptTooltip from 'components/prompts/components/prompt-tooltip';

class PromptTour extends PureComponent {
  render() {
    const { open, setTourClosed, steps, title } = this.props;

    return open ? (
      <Joyride
        steps={steps}
        run={open}
        continuous
        floaterProps={{
          styles: {
            arrow: {
              color: 'red'
            }
          }
        }}
        callback={data => {
          if (data.action === 'close' || data.type === 'tour:end') {
            setTourClosed(false);
          }
        }}
        spotlightPadding={0}
        tooltipComponent={step => <PromptTooltip {...step} title={title} />}
        styles={{
          options: {
            overlayColor: 'rgba(17, 55, 80, 0.4)',
            zIndex: 2000,
            arrowColor: '#333'
          }
        }}
      />
    ) : null;
  }
}

PromptTour.propTypes = {
  open: PropTypes.bool,
  steps: PropTypes.array,
  setTourClosed: PropTypes.func,
  title: PropTypes.string
};

export default PromptTour;
