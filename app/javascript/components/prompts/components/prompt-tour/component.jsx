import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';

import PromptTooltip from 'components/prompts/components/prompt-tooltip';

import './styles.scss';

class MapTour extends PureComponent {
  render() {
    const { open, setMapTourOpen, steps } = this.props;

    return open ? (
      <Joyride
        steps={steps}
        run={open}
        continuous
        callback={data => {
          if (data.action === 'close' || data.type === 'tour:end') {
            setMapTourOpen(false);
          }
        }}
        spotlightPadding={0}
        tooltipComponent={e => (
          <PromptTooltip {...e} stepCount={steps.length} />
        )}
        styles={{
          options: {
            overlayColor: 'rgba(17, 55, 80, 0.4)',
            zIndex: 2000
          }
        }}
      />
    ) : null;
  }
}

MapTour.propTypes = {
  open: PropTypes.bool,
  steps: PropTypes.array,
  setMapTourOpen: PropTypes.func
};

export default MapTour;
