import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { track } from 'app/analytics';
import cx from 'classnames';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';

import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';

import './styles.scss';

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
      contentLabel,
      closeClass,
      children,
      title,
      className,
      loading
    } = this.props;

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <Modal
            isOpen={!!isOpen}
            onRequestClose={onRequestClose}
            style={{
              overlay: {
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
                backgroundColor: 'rgba(17, 55, 80, 0.4)',
                overflow: 'auto',
                padding: isDesktop ? '40px 10px' : '10px'
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
            }}
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
        )}
      </MediaQuery>
    );
  }
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  track: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  contentLabel: PropTypes.string,
  closeClass: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string
};

CustomModal.defaultProps = {
  contentLabel: 'Modal content',
  track: true
};

export default CustomModal;
