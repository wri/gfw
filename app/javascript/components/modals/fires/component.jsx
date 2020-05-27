import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './styles.scss';

class ModalGFWFires extends PureComponent {
  render() {
    const {
      open,
      location,
      setModalGFWFiresOpen,
      setModalContactUsOpen
    } = this.props;

    const { query, pathname } = location || {};

    let modalText = '';
    if (pathname) {
      if (pathname === '/topics/fires') {
        modalText = [
          'Welcome to the new home for Global Forest Watch Fires data and insights! ',
          <a
            href=""
            onClick={() => {
              setModalGFWFiresOpen(false);
              setModalContactUsOpen(true);
            }}
          >
            Contact us
          </a>,
          " if you don't find what you're looking for."
        ];
      } else if (pathname === '/map') {
        modalText = [
          `Welcome to the new home for Global Forest Watch Fires data and insights!
          If you're looking for the Fire Report, `,
          <a
            href="/dashboards/global?category=fires"
            onClick={() => {
              setModalGFWFiresOpen(false);
            }}
          >
            click here
          </a>,
          '.'
        ];
      } else if (
        pathname.includes('dashboards') &&
        query &&
        query.category === 'fires'
      ) {
        modalText = [
          `Welcome to the new home for Global Forest Watch Fires data and insights!
          Explore the links to fire data and analyses below. `,
          <a
            href=""
            onClick={() => {
              setModalGFWFiresOpen(false);
              setModalContactUsOpen(true);
            }}
          >
            Contact us
          </a>,
          " if you don't find what you're looking for."
        ];
      }
    }

    return (
      <Modal
        isOpen={open}
        contentLabel="Global Forest Watch Fires"
        onRequestClose={() => {
          setModalGFWFiresOpen(false);
        }}
        title={'Global Forest Watch Fires.'}
        className="c-gfw-fires-modal"
      >
        <div className="fires-modal-content">
          <p>{modalText}</p>
        </div>
      </Modal>
    );
  }
}

ModalGFWFires.propTypes = {
  open: PropTypes.bool,
  location: PropTypes.object,
  setModalGFWFiresOpen: PropTypes.func,
  setModalContactUsOpen: PropTypes.func
};

export default ModalGFWFires;
