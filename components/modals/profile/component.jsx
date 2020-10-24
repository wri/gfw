import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Modal from 'components/modal';
import ProfileForm from 'components/forms/profile';

import './styles.scss';

const ProfileModal = ({ setProfileModalOpen, profileComplete }) => {
  const {
    query: { profile },
  } = useRouter();

  useEffect(() => {
    if (!profileComplete) {
      setProfileModalOpen(true);
    }
  }, []);

  return (
    <Modal
      open={!!profile}
      contentLabel="Update your profile"
      onRequestClose={() => setProfileModalOpen(false)}
    >
      <div className="c-profile-modal">
        <ProfileForm source="myGfw" />
      </div>
    </Modal>
  );
};

ProfileModal.propTypes = {
  setProfileModalOpen: PropTypes.func,
  profileComplete: PropTypes.bool,
};

export default ProfileModal;
