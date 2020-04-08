import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ContactForm from 'components/forms/contact';
import Modal from '../modal';

import './styles.scss';

class ModalContactUs extends PureComponent {
  render() {
    const { open, setModalContactUsOpen } = this.props;

    return (
      <Modal
        isOpen={!!open}
        contentLabel="Contact Us"
        onRequestClose={() => {
          setModalContactUsOpen(false);
        }}
        title="Contact Us"
        className="c-contact-us-modal"
      >
        <ContactForm resetForm={() => setModalContactUsOpen(false)} />
      </Modal>
    );
  }
}

ModalContactUs.propTypes = {
  open: PropTypes.bool,
  setModalContactUsOpen: PropTypes.func
};

export default ModalContactUs;
