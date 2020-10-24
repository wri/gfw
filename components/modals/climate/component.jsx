import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/modals/modal';

import { setModalClimateOpen, setContactUsOpen } from './actions';

import './styles.scss';

class ModalGFWClimate extends PureComponent {
  render() {
    const { open } = this.props;

    return (
      <Modal
        open={open}
        contentLabel="Global Forest Watch Climate"
        onRequestClose={() => {
          setModalClimateOpen(false);
        }}
        title="Global Forest Watch Climate."
        className="c-gfw-climate-modal"
      >
        <p>
          {`The Global Forest Watch Climate website is no longer available. We
          hope you can find the data and information you're looking for
          here. If not, `}
          <a
            href=""
            onClick={() => {
              setContactUsOpen();
            }}
          >
            contact us
          </a>
          {" and we'll be happy to help."}
        </p>
      </Modal>
    );
  }
}

ModalGFWClimate.propTypes = {
  open: PropTypes.bool,
};

export default ModalGFWClimate;
