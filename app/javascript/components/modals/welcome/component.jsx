import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Icon from 'components/ui/icon';
import Button from 'components/ui/button';

import arrowIcon from 'assets/icons/arrow-down.svg';
import helpGreenIcon from 'assets/icons/help-green.svg';

import Modal from '../modal';

import './styles.scss';

class ModalWelcome extends PureComponent {
  getContent() {
    const {
      setMapPromptsSettings,
      setModalWelcome,
      title,
      description,
      mapTourSteps
    } = this.props;
    return (
      <div className="c-modal-welcome">
        <h3>{title}</h3>
        <div className="body">
          <p className="intro">{description}</p>
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
                    stepsKey: step.promptKey
                  });
                }}
              >
                <p>{step.label}</p>
                <Icon className="arrow-icon" icon={arrowIcon} />
              </Button>
            ))}
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
  title: PropTypes.string,
  description: PropTypes.string,
  setModalWelcome: PropTypes.func,
  mapTourSteps: PropTypes.array,
  setMapPromptsSettings: PropTypes.func
};

export default ModalWelcome;
