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
            <h3>Updates and newsletters</h3>
            <p className="subtitle">Subscribe me to the GFW Newsletter!</p>
            <iframe
              title="newsletter"
              scrolling="no"
              src="http://connect.wri.org/l/120942/2016-02-08/2trw5q"
              width={280}
              height="900"
              type="text/html"
              frameBorder="0"
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
