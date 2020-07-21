import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';
import cx from 'classnames';

import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg?sprite';

import './styles.scss';

Modal.setAppElement('#maincontent');

class CustomModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    loading: PropTypes.bool,
    track: PropTypes.bool,
    onRequestClose: PropTypes.func.isRequired,
    contentLabel: PropTypes.string,
    closeClass: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.string,
    className: PropTypes.string,
    customStyles: PropTypes.object,
  };

  static defaultProps = {
    contentLabel: 'Modal content',
    track: true,
  };

  trackModalOpen = () => {
    if (this.props.track) {
      track('openModal', { label: this.props.contentLabel });
    }
  };

  render() {
    const {
      isOpen,
      onRequestClose,
      contentLabel,
      closeClass,
      children,
      title,
      className,
      loading,
      customStyles,
    } = this.props;

    return (
      <Modal
        isOpen={!!isOpen}
        onRequestClose={onRequestClose}
        style={
          customStyles || {
            overlay: {
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
              backgroundColor: 'rgba(17, 55, 80, 0.4)',
              overflow: 'auto',
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
              borderRadius: 0,
            },
          }
        }
        contentLabel={contentLabel}
        onAfterOpen={this.trackModalOpen}
        className={cx('c-modal', className)}
      >
        <button
          onClick={onRequestClose}
          className={`modal-close ${closeClass}`}
        >
          <Icon icon={closeIcon} />
        </button>
        {loading && <Loader />}
        {!loading && title && <p className="modal-title">{title}</p>}
        {!loading && <div className="modal-content">{children}</div>}
      </Modal>
    );
  }
}

export default CustomModal;
