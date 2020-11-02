import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/modal';

import './styles.scss';

const ModalVideo = ({ open, src, onRequestClose }) => (
  <Modal
    open={open}
    contentLabel="What is global forest wathc video"
    onRequestClose={onRequestClose}
    className="c-modal-video"
  >
    <iframe
      src={src}
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen
      title="What is global forest wathc video"
    />
  </Modal>
);

ModalVideo.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
  src: PropTypes.string,
};

export default ModalVideo;
