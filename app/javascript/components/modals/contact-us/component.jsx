import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Contact from 'components/forms/contact';
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
    const { open, setModalContactUsOpen } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Contact Us"
        onRequestClose={() => {
          setModalContactUsOpen(false);
        }}
        title="Contact Us"
        className="c-contact-us-modal"
      >
        <Contact onSubmit={this.handleSubmit} />
        {/* <div className="contact-us-content">
          {showConfirm ? (
            <div className="feedback-message">
              <p>Interested in getting news and updates from us?</p>
              <div className="button-group">
                <Link to="/subscribe">
                  <Button>Sign up for our newsletter</Button>
                </Link>
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
                <a href="mailto:katie.lyons@wri.org">katie.lyons@wri.org</a>
              </p>
              <Contact onSubmit={this.handleSubmit} />
            </div>
          )}
        </div> */}
      </Modal>
    );
  }
}

ModalContactUs.propTypes = {
  open: PropTypes.bool,
  setModalContactUsOpen: PropTypes.func,
  sendContactForm: PropTypes.func
};

export default ModalContactUs;
