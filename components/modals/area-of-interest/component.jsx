import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { Loader } from '@worldresources/gfw-components';

import { checkUserProfileFilled } from 'utils/user';

import LoginForm from 'components/forms/login';
import ProfileForm from 'components/forms/profile';
import AreaOfInterestForm from 'components/forms/area-of-interest';
import Modal from 'components/modal';

const AreaOfInterestModal = ({
  loading,
  userData,
  canDelete,
  viewAfterSave,
  areas,
  setMenuSettings,
  setAreaOfInterestModalSettings,
}) => {
  const {
    query: { areaId },
  } = useRouter();
  const activeArea = areas?.find((a) => a.id === areaId);
  const { loggedIn } = userData || {};
  const profileComplete = checkUserProfileFilled(userData);

  const handleCloseModal = () => {
    setAreaOfInterestModalSettings(null);
    setMenuSettings({ menuSection: 'my-gfw' });
  };

  return (
    <Modal
      open={!!areaId}
      contentLabel={`${activeArea ? 'Edit' : 'Save'} area of interest`}
      onRequestClose={handleCloseModal}
      className="c-area-of-interest-modal"
    >
      {loading && <Loader />}
      <div className="save-aoi-body">
        {!loading && !loggedIn && <LoginForm />}
        {!loading && loggedIn && !profileComplete && (
          <ProfileForm source="AreaOfInterestModal" />
        )}
        {!loading && loggedIn && profileComplete && (
          <AreaOfInterestForm
            canDelete={canDelete}
            closeForm={handleCloseModal}
            viewAfterSave={viewAfterSave}
            areaId={activeArea?.id}
          />
        )}
      </div>
    </Modal>
  );
};

AreaOfInterestModal.propTypes = {
  userData: PropTypes.object,
  loading: PropTypes.bool,
  canDelete: PropTypes.bool,
  setMenuSettings: PropTypes.func,
  viewAfterSave: PropTypes.bool,
  areas: PropTypes.array,
  setAreaOfInterestModalSettings: PropTypes.func,
};

export default AreaOfInterestModal;
