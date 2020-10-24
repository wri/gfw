import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { track } from 'analytics';

import { ContactUsModal } from 'gfw-components';

import { setModalContactUsOpen } from './actions';

import './styles.scss';

const ModalContactUs = () => {
  const { query } = useRouter();
  const { contactUs } = query || {};
  const dispatch = useDispatch();

  return (
    <ContactUsModal
      open={!!contactUs}
      contentLabel="Contact Us"
      onRequestClose={() => dispatch(setModalContactUsOpen(false))}
      title="Contact Us"
      className="c-contact-us-modal"
      onAfterOpen={() => track('openModal', { label: 'Contact Us' })}
    />
  );
};

export default ModalContactUs;
