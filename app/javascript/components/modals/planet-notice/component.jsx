import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './styles.scss';

class ModalPlanetNotice extends PureComponent {
  render() {
    const {
      open,
      setModalPlanetNoticeOpen
    } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="High-resolution satellite imagery"
        onRequestClose={() => {
          setModalPlanetNoticeOpen(false);
        }}
        className="c-planet-notice-modal"
      >
        <p>High-resolution satellite imagery may no longer be available for this view, so we have added Landsat imagery as a substitute. To access another basemap or imagery for a specific date, view our discussion forum post here for instructions.</p>
      </Modal>
    );
  }
}

ModalPlanetNotice.propTypes = {
  open: PropTypes.bool,
  setModalPlanetNoticeOpen: PropTypes.func
};

export default ModalPlanetNotice;
