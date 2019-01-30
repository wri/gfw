import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Contact from 'components/forms/contact';
import { submitContactForm } from 'services/forms';
import Modal from '../modal';

import './styles.scss';

class ModalContactUs extends PureComponent {
  render() {
    const { open, setModalContactUsOpen } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Contact Us"
        onRequestClose={() => {
          setModalContactUsOpen(false);
        }}
      >
        <Contact onSubmit={submitContactForm} />
      </Modal>
    );
  }
}

ModalContactUs.propTypes = {
  open: PropTypes.bool,
  setModalContactUsOpen: PropTypes.func
};

export default ModalContactUs;
