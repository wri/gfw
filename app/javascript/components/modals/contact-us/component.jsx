import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Contact from 'components/forms/contact';
import Button from 'components/ui/button';
import Loader from 'components/ui/loader';
import Modal from '../modal';

import './styles.scss';

class ModalContactUs extends PureComponent {
  handleSubmit = values => {
    const { sendContactForm } = this.props;
    const language = window.Transifex
      ? window.Transifex.live.getSelectedLanguageCode()
      : 'en';
    sendContactForm({ ...values, language });
  };

  render() {
    const { open, setModalContactUsOpen, showConfirm, submitting } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Contact Us"
        onRequestClose={() => {
          setModalContactUsOpen(false);
        }}
        title={
          showConfirm
            ? 'Thank you for contacting Global Forest Watch! Check your inbox for a confirmation email.'
            : 'Contact us'
        }
        className="c-contact-us"
      >
        <div className="contact-us-content">
          {submitting && <Loader />}
          {showConfirm ? (
            <div className="feedback-message">
              <p>Interested in getting news and updates from us?</p>
              <div className="button-group">
                <Button link="/about?show_newsletter=true">
                  Sign up for our newsletter
                </Button>
                <Button
                  className="close-button"
                  onClick={() => setModalContactUsOpen(false)}
                >
                  No thanks
                </Button>
              </div>
            </div>
          ) : (
            <div className="contact-form">
              <p className="subtitle">
                For media inquiries, email{' '}
                <a href="mailto:katie.fletcher@wri.org">
                  katie.fletcher@wri.org
                </a>
              </p>
              <Contact onSubmit={this.handleSubmit} />
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

ModalContactUs.propTypes = {
  open: PropTypes.bool,
  setModalContactUsOpen: PropTypes.func,
  showConfirm: PropTypes.bool,
  submitting: PropTypes.bool,
  sendContactForm: PropTypes.func
};

export default ModalContactUs;
