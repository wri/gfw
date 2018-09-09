import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './video-styles.scss';

class ModalVideo extends PureComponent {
  getContent() {
    const { data } = this.props;

    return (
      <div className="c-modal-video">
        <iframe
          src={data && data.src}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title="About video"
        />
      </div>
    );
  }

  render() {
    const { open, setModalVideoClosed } = this.props;
    return (
      <Modal isOpen={open} onRequestClose={() => setModalVideoClosed()}>
        {this.getContent()}
      </Modal>
    );
  }
}

ModalVideo.propTypes = {
  open: PropTypes.bool,
  setModalVideoClosed: PropTypes.func,
  data: PropTypes.object
};

export default ModalVideo;
