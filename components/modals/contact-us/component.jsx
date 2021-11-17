import React from 'react';
import { useRouter } from 'next/router';
import { trackEvent } from 'utils/analytics';
import { useDispatch } from 'react-redux';

import Modal from 'components/modal';
import ContactForm from 'components/forms/contact';

import { setModalContactUsOpen } from './actions';

import './styles.scss';

const ModalContactUs = () => {
  const { query } = useRouter();
  const { contactUs } = query || {};
  const dispatch = useDispatch();
  return (
    <Modal
      open={!!contactUs}
      contentLabel="Contact Us"
      onRequestClose={() => {
        dispatch(setModalContactUsOpen(false));
      }}
      onAfterOpen={() =>
        trackEvent({
          category: 'Open modal',
          action: 'Click to open',
          label: 'Contact Us',
        })}
      title="Contact Us"
      className="c-contact-us-modal"
    >
      <ContactForm />
    </Modal>
  );
};

export default ModalContactUs;
