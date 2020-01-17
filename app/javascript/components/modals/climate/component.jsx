import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './styles.scss';

class ModalGFWClimate extends PureComponent {
  render() {
    const { open, setModalGFWClimateOpen } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Global Forest Watch Climate"
        onRequestClose={() => {
          setModalGFWClimateOpen(false);
        }}
        title={'Global Forest Watch Climate.'}
        className="c-gfw-climate-modal"
      >
        <div className="contact-us-content">
          <div className="feedback-message">
            <p>
              The Global Forest Watch Climate website is no longer available. We
              hope you can find the data and information you&#39;re looking for
              here. If not,
              <a href="">contact us</a>
              and we&#39;ll be happy to help.
            </p>
          </div>
        </div>
      </Modal>
    );
  }
}

ModalGFWClimate.propTypes = {
  open: PropTypes.bool,
  setModalGFWClimateOpen: PropTypes.func
};

export default ModalGFWClimate;
