import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';

// import styles from './section-projects-modal-styles.scss';

class SectionProjectsModal extends PureComponent {
  handleClose = () => {
    this.props.setSectionProjectsModal({ isOpen: false });
  };

  render() {
    const { isOpen } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestClose={this.handleClose}>
        your project modal is here
      </Modal>
    );
  }
}

SectionProjectsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setSectionProjectsModal: PropTypes.func.isRequired
};

export default SectionProjectsModal;
