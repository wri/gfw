import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './video-styles.scss';

class ModalVideo extends PureComponent {
  getContent() {
    const { data } = this.props;

    return (
      <div className="modal-video-content">
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
      <Modal
        isOpen={open}
        contentLabel="Video"
        onRequestClose={() => setModalVideoClosed()}
        customStyles={{
          overlay: {
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
            backgroundColor: 'rgba(17, 55, 80, 0.4)',
            overflow: 'auto',
            padding: 0
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
            borderRadius: 0
          }
        }}
        className="c-modal-video"
      >
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
