import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { track } from 'analytics';

import Button from 'components/ui/button';
import Checkbox from 'components/ui/checkbox';

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
      showPrompts,
    } = this.props;
    return (
      <div className="modal-welcome-content">
        {description && <p className="intro">{description}</p>}
        {mapTourSteps && (
          <ul className="map-tour-steps">
            {mapTourSteps.map((step) => (
              <li key={step.label} className="map-tour-step">
                <button
                  className="guide-btn"
                  onClick={() => {
                    setModalWelcome(false);
                    setMapPromptsSettings({
                      open: true,
                      stepsKey: step.promptKey,
                      stepIndex: 0,
                      force: true,
                    });
                  }}
                >
                  <img
                    src={step.thumbnail}
                    alt={`Map welcome thumbnail - ${step.label}`}
                    className="map-tour-thumbnail"
                  />
                  <p>{step.label}</p>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="outro">
          <p>
            Not finding what you want?
            {' '}
            <Button
              theme="theme-button-inline"
              onClick={() => {
                setModalWelcome(false);
                setMapPromptsSettings({
                  open: true,
                  stepsKey: 'mapTour',
                  force: true,
                });
                track('welcomeModal', { label: 'Tour' });
              }}
            >
              Take a tour of the map
            </Button>
            {' '}
            or
            {' '}
            <Link href="">visit the Help Center</Link>
            {' '}
            for tutorials.
          </p>
          <button
            className="show-prompts-btn"
            onClick={() => setShowMapPrompts(!showPrompts)}
          >
            <Checkbox className="prompts-checkbox" value={showPrompts} />
            Show me tips
          </button>
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
  setShowMapPrompts: PropTypes.func,
};

export default ModalWelcome;
