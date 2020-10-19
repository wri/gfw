import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './styles.scss';

const ModalVideo = ({ open, src, onRequestClose }) => (
  <Modal
    isOpen={open}
    contentLabel="Video"
    onRequestClose={onRequestClose}
    customStyles={{
      overlay: {
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
        backgroundColor: 'rgba(17, 55, 80, 0.4)',
        overflow: 'auto',
        padding: 0,
      },
      content: {
        position: 'relative',
        top: 'auto',
        margin: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        padding: '0',
        border: 'none',
        borderRadius: 0,
        maxWidth: '100%',
      },
    }}
    className="c-modal-video"
  >
    <div className="modal-video-content">
      <iframe
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        title="About video"
      />
    </div>
  </Modal>
);

ModalVideo.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
  src: PropTypes.string,
};

export default ModalVideo;
