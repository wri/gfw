import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logEvent } from 'app/analytics';

import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import Checkbox from 'components/ui/checkbox';

import arrowIcon from 'assets/icons/arrow-down.svg?sprite';
import helpGreenIcon from 'assets/icons/help-green.svg?sprite';

import Modal from '../modal';

import './styles.scss';

class ModalWelcome extends PureComponent {
  getContent() {
    const {
      setMapPromptsSettings,
      setShowMapPrompts,
      setModalWelcome,
      description,
      mapTourSteps,
      showPrompts
    } = this.props;
    return (
      <div className="modal-welcome-content">
        <p className="intro">{description}</p>
        <Button
          className="guide-btn tour-btn negative"
          theme="theme-button-clear theme-button-dashed"
          onClick={() => {
            setModalWelcome(false);
            setMapPromptsSettings({
              open: true,
              stepsKey: 'mapTour',
              force: true
            });
            logEvent('welcomeModal', { label: 'Tour' });
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
          <button
            className="show-prompts-btn"
            onClick={() => setShowMapPrompts(!showPrompts)}
          >
            <Checkbox className="prompts-checkbox" value={showPrompts} />
            Show me tips
          </button>
        </p>
        {mapTourSteps &&
          mapTourSteps.map(step => (
            <Button
              key={step.label}
              className="guide-btn"
              theme="theme-button-clear theme-button-dashed"
              onClick={() => {
                setModalWelcome(false);
                setMapPromptsSettings({
                  open: true,
                  stepsKey: step.promptKey,
                  stepIndex: 0,
                  force: true
                });
              }}
            >
              <p>{step.label}</p>
              <Icon className="arrow-icon" icon={arrowIcon} />
            </Button>
          ))}
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
          logEvent('welcomeModal', { label: 'Close' });
        }}
        title="Welcome to the new Global Forest Watch map!"
        className="c-modal-welcome"
      >
        {this.getContent()}
      </Modal>
    );
  }
}

ModalWelcome.propTypes = {
  open: PropTypes.bool,
  showPrompts: PropTypes.bool,
  description: PropTypes.string,
  setModalWelcome: PropTypes.func,
  mapTourSteps: PropTypes.array,
  setMapPromptsSettings: PropTypes.func,
  setShowMapPrompts: PropTypes.func
};

export default ModalWelcome;
