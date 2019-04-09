import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PromptTour from 'components/prompts';

class MapPrompts extends PureComponent {
  render() {
    const {
      open,
      stepIndex,
      stepsKey,
      data,
      setMapTourOpen,
      setMapPromptsSettings
    } = this.props;

    return open && data ? (
      <PromptTour
        title={data.title}
        steps={data.steps}
        open={open}
        stepIndex={stepIndex}
        setTourClosed={setMapTourOpen}
        handleStateChange={state =>
          setMapPromptsSettings({ stepsKey, ...state })
        }
        settings={data.settings}
      />
    ) : null;
  }
}

MapPrompts.propTypes = {
  open: PropTypes.bool,
  stepIndex: PropTypes.number,
  stepsKey: PropTypes.string,
  data: PropTypes.object,
  setMapPromptsSettings: PropTypes.func,
  setMapTourOpen: PropTypes.func
};

export default MapPrompts;
