import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';

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
          <button
            key="button"
            onClick={() => {
              setModalGFWFiresOpen(false);
              setModalContactUsOpen(true);
            }}
          >
            Contact us
          </button>,
          " if you don't find what you're looking for."
        ];
      } else if (pathname === '/map') {
        modalText = [
          `Welcome to the new home for Global Forest Watch Fires data and insights!
          If you're looking for the Fire Report, `,
          <Link
            key="link"
            href="/dashboards/global?category=fires"
            onClick={() => {
              setModalGFWFiresOpen(false);
            }}
          >
            click here
          </Link>,
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
          <button
            key="button"
            onClick={() => {
              setModalGFWFiresOpen(false);
              setModalContactUsOpen(true);
            }}
          >
            Contact us
          </button>,
          " if you don't find what you're looking for."
        ];
      }
    }

    return (
      <Modal
        isOpen={open && !!modalText}
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
