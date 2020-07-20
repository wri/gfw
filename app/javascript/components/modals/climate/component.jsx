import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import { setModalClimateOpen } from './actions';
import Modal from '../modal';

import './styles.scss';

class ModalGFWClimate extends PureComponent {
  render() {
    const { open } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Global Forest Watch Climate"
        onRequestClose={() => {
          setModalClimateOpen(false);
        }}
        title="Global Forest Watch Climate."
        className="c-gfw-climate-modal"
      >
        <div className="climate-content">
          <p>
            {`The Global Forest Watch Climate website is no longer available. We
            hope you can find the data and information you're looking for
            here. If not, `}
            <a
              href=""
              onClick={() => {
                setModalClimateOpen(false);
                setModalContactUsOpen(true);
              }}
            >
              contact us
            </a>
            {" and we'll be happy to help."}
          </p>
        </div>
      </Modal>
    );
  }
}

ModalGFWClimate.propTypes = {
  open: PropTypes.bool,
};

export default ModalGFWClimate;
