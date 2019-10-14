import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { SCREEN_S } from 'utils/constants';

import Modal from '../modal';

import './styles.scss';

class ModalNewsletter extends PureComponent {
  render() {
    const { open, setModalNewsletterOpen } = this.props;

    return (
      <MediaQuery minWidth={SCREEN_S}>
        {isDesktop => (
          <Modal
            isOpen={open}
            contentLabel="Newsletter"
            onRequestClose={() => {
              setModalNewsletterOpen(false);
            }}
          >
            {
              <div className="c-newsletter">
                <h2>Updates and newsletters</h2>
                <p className="subtitle">Subscribe me to the GFW Newsletter!</p>
                <iframe
                  title="newsletter"
                  scrolling="no"
                  src="https://connect.wri.org/l/120942/2016-02-08/2trw5q"
                  width={isDesktop ? 600 : 280}
                  height="800"
                  type="text/html"
                  frameBorder="0"
                  style={{ border: 0 }}
                />
              </div>
            }
          </Modal>
        )}
      </MediaQuery>
    );
  }
}

ModalNewsletter.propTypes = {
  open: PropTypes.bool,
  setModalNewsletterOpen: PropTypes.func
};

export default ModalNewsletter;
