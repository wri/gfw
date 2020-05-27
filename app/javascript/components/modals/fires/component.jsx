import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './styles.scss';

class ModalGFWFires extends PureComponent {
  render() {
    const {
      open,
      path,
      setModalGFWFiresOpen,
      setModalContactUsOpen
    } = this.props;

    let modalText;
    switch (path) {
      case '/topics/fires':
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
        break;
      case '/map':
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
        break;
      default:
        modalText = '';
    }

    return (
      <Modal
        isOpen={open}
        contentLabel="Global Forest Watch Fires"
        onRequestClose={() => {
          setModalGFWFiresOpen(false);
        }}
        title={'Global Forest Watch Fires.'}
        className="c-gfw-climate-modal"
      >
        <div className="climate-content">
          <p>{modalText}</p>
        </div>
      </Modal>
    );
  }
}

ModalGFWFires.propTypes = {
  open: PropTypes.bool,
  path: PropTypes.string,
  setModalGFWFiresOpen: PropTypes.func,
  setModalContactUsOpen: PropTypes.func
};

export default ModalGFWFires;
