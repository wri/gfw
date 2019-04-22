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
      setMapPromptsSettings,
      showPrompts,
      handleShowPrompts
    } = this.props;

    return open && data ? (
      <PromptTour
        title={data.title}
        steps={data.steps}
        open={open}
        stepIndex={stepIndex}
        setTourClosed={setMapTourOpen}
        showPrompts={showPrompts}
        handleStateChange={state =>
          setMapPromptsSettings({ stepsKey, ...state, force: true })
        }
        handleShowPrompts={handleShowPrompts}
        settings={data.settings}
        initAction={data.initAction}
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
  setMapTourOpen: PropTypes.func,
  showPrompts: PropTypes.bool,
  handleShowPrompts: PropTypes.func
};

export default MapPrompts;
