import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ContactForm from 'components/forms/contact';
import Modal from '../modal';

import './styles.scss';

class ModalContactUs extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Contact Us"
        onRequestClose={onClose}
        title="Contact Us"
        className="c-contact-us-modal"
      >
        <ContactForm onClose={onClose} />
      </Modal>
    );
  }
}

export default ModalContactUs;
