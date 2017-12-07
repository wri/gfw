import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import closeIcon from 'assets/icons/close.svg';

import './modal-styles.scss';

class CustomModal extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      isOpen,
      onRequestClose,
      customStyles,
      contentLabel,
      closeClass,
      children
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel={contentLabel}
      >
        <button
          onClick={onRequestClose}
          className={`c-modal-close ${closeClass}`}
        >
          <Icon icon={closeIcon} />
        </button>
        {children}
      </Modal>
    );
  }
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  contentLabel: PropTypes.string,
  customStyles: PropTypes.object,
  closeClass: PropTypes.string,
  children: PropTypes.node
};

CustomModal.defaultProps = {
  contentLabel: 'Modal content',
  customStyles: {
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
      width: '1080px',
      padding: '0',
      maxHeight: '640px',
      height: 'calc(100vh - 100px)',
      border: 'none',
      borderRadius: 0
    }
  }
};

export default CustomModal;
