import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from 'utils/analytics';

import Button from 'components/ui/button';
import Checkbox from 'components/ui/checkbox';
import Modal from 'components/modal';

// import './styles.scss';

class ModalWelcome extends PureComponent {
  getContent() {
    const {
      setMapSettings,
      setMapPromptsSettings,
      setMainMapSettings,
      setShowMapPrompts,
      setModalWelcome,
      setMenuSettings,
      description,
      welcomeCards,
      showPrompts,
    } = this.props;
    return (
      <div className="modal-welcome-content">
        {description && <p className="intro">{description}</p>}
        {welcomeCards && (
          <ul className="map-tour-steps">
            {welcomeCards.map(
              ({ label, map, menu, mainMap, promptKey, thumbnail } = {}) => (
                <li key={label} className="map-tour-step">
                  <button
                    className="guide-btn"
                    onClick={() => {
                      setModalWelcome(false);

                      if (map) {
                        setMapSettings(map);
                      }

                      if (menu) {
                        setMenuSettings(menu);
                      }

                      if (mainMap) {
                        setMainMapSettings(mainMap);
                      }

                      if (promptKey) {
                        setMapPromptsSettings({
                          open: true,
                          stepsKey: promptKey,
                          stepIndex: 0,
                          force: true,
                        });
                      }
                    }}
                  >
                    <img
                      src={thumbnail}
                      alt={`Map welcome thumbnail - ${label}`}
                      className="map-tour-thumbnail"
                    />
                    <p>{label}</p>
                  </button>
                </li>
              )
            )}
          </ul>
        )}
        <div className="outro">
          <p>
            Not finding what you want?{' '}
            <Button
              theme="theme-button-inline"
              onClick={() => {
                setModalWelcome(false);
                setMapPromptsSettings({
                  open: true,
                  stepsKey: 'mapTour',
                  force: true,
                });
                trackEvent({
                  category: 'Map landing',
                  action: 'User interacts with popup',
                  label: 'Tour',
                });
              }}
            >
              Take a tour of the map
            </Button>{' '}
            or{' '}
            <a href="https://www.globalforestwatch.org/help/">
              visit the Help Center
            </a>{' '}
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
        open={open}
        contentLabel="Welcome map modal"
        onRequestClose={() => {
          setModalWelcome(false);
          trackEvent({
            category: 'Map landing',
            action: 'User interacts with popup',
            label: 'Close',
          });
        }}
        title="Welcome to the Global Forest Watch map!"
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
  setMenuSettings: PropTypes.func,
  welcomeCards: PropTypes.array,
  setMapPromptsSettings: PropTypes.func,
  setShowMapPrompts: PropTypes.func,
  setMapSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
};

export default ModalWelcome;
