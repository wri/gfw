import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ProfileForm from 'components/forms/profile';
import Modal from '../modal';

import './styles.scss';

class ProfileModal extends PureComponent {
  static propTypes = {
    open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    setProfileModalOpen: PropTypes.func,
    filledProfile: PropTypes.bool
  };

  handleCloseModal = () => {
    const { setProfileModalOpen } = this.props;
    setProfileModalOpen(false);
  };

  render() {
    const { open, filledProfile } = this.props;

    return (
      <Modal
        isOpen={!!open || !filledProfile}
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

export default ProfileModal;
