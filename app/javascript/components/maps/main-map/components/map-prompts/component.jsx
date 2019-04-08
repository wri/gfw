import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import PromptTour from 'components/prompts';

import exploreGreenIcon from 'assets/icons/explore-green.svg';
import analysisGreenIcon from 'assets/icons/analysis-green.svg';

class MapPrompts extends PureComponent {
  renderExitOptions = () => (
    <div className="tour-exit-actions">
      <p className="intro">
        Not sure what to do next? Here are some suggestions:
      </p>
      <Button
        className="guide-btn"
        theme="theme-button-clear theme-button-dashed"
        onClick={() => {
          this.props.setExploreView();
          this.props.setMapTourOpen(false);
          track('welcomeModal', { label: 'topics' });
        }}
      >
        <Icon className="guide-btn-icon" icon={exploreGreenIcon} />
        <p>
          Try out the Explore tab for an introduction to key forest topics and
          high priority areas with recent forest loss.
        </p>
      </Button>
      <Button
        className="guide-btn"
        theme="theme-button-clear theme-button-dashed"
        onClick={() => {
          this.props.setAnalysisView();
          this.props.setMapTourOpen(false);
          track('welcomeModal', { label: 'Analysis' });
        }}
      >
        <Icon className="guide-btn-icon" icon={analysisGreenIcon} />
        <p>Test out our new and improved analysis features.</p>
      </Button>
    </div>
  );

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
  setMapTourOpen: PropTypes.func,
  setExploreView: PropTypes.func,
  setAnalysisView: PropTypes.func
};

export default MapPrompts;
