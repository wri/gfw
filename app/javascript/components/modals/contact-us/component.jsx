import React from 'react';
import { useRouter } from 'next/router';

import ContactForm from 'components/forms/contact';
import Modal from '../modal';

import { setModalContactUsOpen } from './actions';

import './styles.scss';

const ModalContactUs = () => {
  const { query } = useRouter();
  const { contactUs } = query || {};

  return (
    <Modal
      isOpen={!!contactUs}
      contentLabel="Contact Us"
      onRequestClose={() => setModalContactUsOpen(false)}
      title="Contact Us"
      className="c-contact-us-modal"
    >
      <ContactForm resetForm={() => setModalContactUsOpen(false)} />
    </Modal>
  );
};

export default ModalContactUs;
