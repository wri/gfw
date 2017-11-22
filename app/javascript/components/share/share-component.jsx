import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';

import './share-styles.scss';

class Share extends PureComponent {
  getContent() {
    const { data } = this.props;
    return (
      <div className="c-share">
        <div className="c-share__title">Share this widget</div>
        <div className="c-share__subtitle">
          Click and paste link in email or IM
          {data}
        </div>
      </div>
    );
  }

  handleClose = () => {
    this.props.setShareModal({ isOpen: false });
  };

  render() {
    const { isOpen } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.handleClose}
        customStyles={{
          overlay: {
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
            backgroundColor: 'rgba(17, 55, 80, 0.4)'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            width: '300px',
            padding: '0',
            border: 'none',
            borderRadius: 0
          }
        }}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

Share.propTypes = {
  data: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setShareModal: PropTypes.func.isRequired
};

export default Share;
