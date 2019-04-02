import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';

import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';

import './modal-styles.scss';

class CustomModal extends PureComponent {
  trackModalOpen = () => {
    if (this.props.track) {
      track('openModal', { label: this.props.contentLabel });
    }
  };

  render() {
    const {
      isOpen,
      onRequestClose,
      customStyles,
      contentLabel,
      closeClass,
      children,
      title
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel={contentLabel}
        onAfterOpen={this.trackModalOpen}
      >
        <button
          onClick={onRequestClose}
          className={`modal-close ${closeClass}`}
        >
          <Icon icon={closeIcon} />
        </button>
        {title && <p className="modal-title">:{title}</p>}
        {children}
      </Modal>
    );
  }
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool,
  track: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  contentLabel: PropTypes.string,
  customStyles: PropTypes.object,
  closeClass: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string
};

CustomModal.defaultProps = {
  contentLabel: 'Modal content',
  track: true,
  customStyles: {
    overlay: {
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
      backgroundColor: 'rgba(17, 55, 80, 0.4)',
      overflow: 'auto',
      padding: window.innerWidth > 600 ? '40px 0' : '0'
    },
    content: {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      margin: 'auto',
      padding: '0',
      border: 'none',
      borderRadius: 0
    }
  }
};

export default CustomModal;
