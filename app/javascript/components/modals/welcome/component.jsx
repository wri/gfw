import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { track } from 'utils/analytics';

import Icon from 'components/ui/icon';

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
      setMapTourOpen,
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
          <p className="btn-intro">
            <b>If it&#39;s your first time:</b>
          </p>
          <button
            className="guide-btn"
            onClick={() => {
              setModalWelcome(false);
              setMapTourOpen(true);
              track('welcomeModal', { label: 'tour' });
            }}
          >
            <Icon className="guide-btn-icon" icon={helpGreenIcon} />
            <p>
              Check out the highlights and learn what you can do with the map.
            </p>
          </button>
          <p className="btn-intro">
            <b>If you&#39;re returning:</b>
          </p>
          <button
            className="guide-btn"
            onClick={() => {
              setExploreView();
              track('welcomeModal', { label: 'topics' });
            }}
          >
            <Icon className="guide-btn-icon" icon={exploreGreenIcon} />
            <p>
              Try out the Explore tab for an introduction to key forest topics
              and high priority areas with recent forest loss.
            </p>
          </button>
          <button
            className="guide-btn"
            onClick={() => {
              setAnalysisView();
              track('welcomeModal', { label: 'analysis' });
            }}
          >
            <Icon className="guide-btn-icon" icon={analysisGreenIcon} />
            <p>Test out our new and improved analysis features.</p>
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
          track('welcomeModal', { label: 'close' });
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
  setMapTourOpen: PropTypes.func,
  setExploreView: PropTypes.func
};

export default ModalWelcome;
