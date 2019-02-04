import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './styles.scss';

class ModalNewsletter extends PureComponent {
  render() {
    const { open, setModalNewsletterOpen } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Contact Us"
        onRequestClose={() => {
          setModalNewsletterOpen(false);
        }}
      >
        {
          <div className="c-form-container">
            <h3>Contact us & feedback</h3>
            <p className="subtitle">
              Question, comment, request, feedback? We want to hear from you!
              Help us improve Global Forest Watch by completing the form below.
            </p>
            <iframe
              title="newsletter"
              scrolling="no"
              src="http://connect.wri.org/l/120942/2016-02-08/2trw5q"
              width="100%"
              height="900"
              type="text/html"
              frameBorder="0"
              allowTransparency="true"
              style={{ border: 0 }}
            />
          </div>
        }
      </Modal>
    );
  }
}

ModalNewsletter.propTypes = {
  open: PropTypes.bool,
  setModalNewsletterOpen: PropTypes.func
};

export default ModalNewsletter;
