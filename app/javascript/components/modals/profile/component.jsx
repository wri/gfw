import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ProfileForm from 'components/forms/profile';
import Modal from '../modal';

import './styles.scss';

class ModalSaveAOI extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    setProfileModalOpen: PropTypes.func
  };

  handleCloseModal = () => {
    const { setProfileModalOpen } = this.props;
    setProfileModalOpen(false);
  };

  render() {
    const { open } = this.props;

    return (
      <Modal
        isOpen={!!open}
        contentLabel="Update your profile"
        onRequestClose={this.handleCloseModal}
      >
        <div className="c-profile-modal">
          <ProfileForm />
        </div>
      </Modal>
    );
  }
}

export default ModalSaveAOI;
