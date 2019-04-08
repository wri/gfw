import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Icon from 'components/ui/icon';
import Button from 'components/ui/button';

import arrowIcon from 'assets/icons/arrow-down.svg';
import exploreGreenIcon from 'assets/icons/explore-green.svg';
import helpGreenIcon from 'assets/icons/help-green.svg';
import analysisGreenIcon from 'assets/icons/analysis-green.svg';

import Modal from '../modal';

import './styles.scss';

class ModalWelcome extends PureComponent {
  getContent() {
    const {
      setAnalysisView,
      setExploreView,
      setMapPromptsSettings,
      setModalWelcome
    } = this.props;
    return (
      <div className="c-modal-welcome">
        <h3>Welcome to the new Global Forest Watch map!</h3>
        <div className="body">
          <p className="intro">
            We&#39;ve made exciting changes to the map to make it faster, more
            powerful, and easier to use.
          </p>
          <Button
            className="guide-btn tour-btn negative"
            theme="theme-button-clear theme-button-dashed"
            onClick={() => {
              setModalWelcome(false);
              setMapPromptsSettings({ open: true, stepsKey: 'mapTour' });
              track('welcomeModal', { label: 'Tour' });
            }}
          >
            <Icon className="guide-btn-icon" icon={helpGreenIcon} />
            <p>
              Check out the highlights and learn what you can do with the map.
            </p>
            <Icon className="arrow-icon" icon={arrowIcon} />
          </Button>
          <p className="btn-intro">
            <b>How-to guide:</b>
          </p>
          <Button
            className="guide-btn"
            theme="theme-button-clear theme-button-dashed"
            onClick={() => {
              setExploreView();
              track('welcomeModal', { label: 'Topics' });
            }}
          >
            <Icon className="guide-btn-icon" icon={exploreGreenIcon} />
            <p>
              Try out the Explore tab for an introduction to key forest topics
              and high priority areas with recent forest loss.
            </p>
            <Icon className="arrow-icon" icon={arrowIcon} />
          </Button>
          <Button
            className="guide-btn"
            theme="theme-button-clear theme-button-dashed"
            onClick={() => {
              setAnalysisView();
              track('welcomeModal', { label: 'Analysis' });
            }}
          >
            <Icon className="guide-btn-icon" icon={analysisGreenIcon} />
            <p>Test out our new and improved analysis features.</p>
            <Icon className="arrow-icon" icon={arrowIcon} />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { open, setModalWelcome } = this.props;
    return (
      <Modal
        isOpen={open}
        contentLabel="Welcome"
        onRequestClose={() => {
          setModalWelcome(false);
          track('welcomeModal', { label: 'Close' });
        }}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

ModalWelcome.propTypes = {
  open: PropTypes.bool,
  setModalWelcome: PropTypes.func,
  setAnalysisView: PropTypes.func,
  setMapPromptsSettings: PropTypes.func,
  setExploreView: PropTypes.func
};

export default ModalWelcome;
