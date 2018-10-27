import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import exploreIcon from 'assets/icons/explore.svg';
import analysisIcon from 'assets/icons/analysis.svg';

import Modal from '../modal';

import './styles.scss';

class ModalWelcome extends PureComponent {
  getContent() {
    const { setAnalysisView, setExploreView } = this.props;
    return (
      <div className="c-modal-welcome">
        <h3>Welcome to the brand new Global Forest Watch map!</h3>
        <div className="body">
          <p className="intro">
            We’ve made some significant changes to the site to make it faster,
            more powerful and easier to use. Enjoy playing around with the new
            features, and{' '}
            <a
              href="https://in.hotjar.com/s?siteId=1060074&surveyId=119711"
              target="_blank"
              rel="noopener noreferrer"
            >
              please tell us what you think
            </a>.
          </p>
          <div className="guide-cards">
            <button className="guide-btn" onClick={setExploreView}>
              <p>
                <b>If its your first time:</b>
              </p>
              <p>
                Try out the explore tab for an introduction to key forest
                topics.
              </p>
              <Icon icon={exploreIcon} />
            </button>
            <button className="guide-btn" onClick={setAnalysisView}>
              <p>
                <b>If you’re returning:</b>
              </p>
              <p>Try out the new one-click analysis feature.</p>
              <Icon icon={analysisIcon} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { open, setModalWelcome } = this.props;
    return (
      <Modal isOpen={open} onRequestClose={() => setModalWelcome(false)}>
        {this.getContent()}
      </Modal>
    );
  }
}

ModalWelcome.propTypes = {
  open: PropTypes.bool,
  setModalWelcome: PropTypes.func,
  setAnalysisView: PropTypes.func,
  setExploreView: PropTypes.func
};

export default ModalWelcome;
