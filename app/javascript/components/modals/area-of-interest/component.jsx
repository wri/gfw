import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/ui/loader';
import LoginForm from 'components/forms/login';
import ProfileForm from 'components/forms/profile';
import AreaOfInterestForm from 'components/forms/area-of-interest';

import Modal from '../modal';

import './styles.scss';

class AreaOfInterestModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    userData: PropTypes.object,
    loading: PropTypes.bool,
    canDelete: PropTypes.bool,
    setAreaOfInterestModalSettings: PropTypes.func,
    setMenuSettings: PropTypes.func,
    viewAfterSave: PropTypes.bool,
    activeArea: PropTypes.object
  };

  handleCloseModal = () => {
    const { setAreaOfInterestModalSettings, setMenuSettings } = this.props;
    setAreaOfInterestModalSettings({ open: false, activeAreaId: null });
    setMenuSettings({ menuSection: 'my-gfw' });
  };

  render() {
    const {
      open,
      loading,
      userData,
      canDelete,
      viewAfterSave,
      activeArea
    } = this.props;
    const { email, fullName, lastName, loggedIn, sector, subsector } =
      userData || {};
    const isProfileFormFilled =
      !!email &&
      (!!fullName || !!lastName) &&
      !!sector &&
      (subsector.includes('Other')
        ? !!subsector.split('Other:')[1].trim()
        : false);

    return (
      <Modal
        isOpen={open}
        contentLabel={`${activeArea ? 'Edit' : 'Save'} area of interest`}
        onRequestClose={this.handleCloseModal}
        className="c-area-of-interest-modal"
      >
        <div className="save-aoi-body">
          {loading && <Loader />}
          {!loading && !loggedIn && <LoginForm />}
          {!loading &&
            loggedIn &&
            !isProfileFormFilled && (
            <ProfileForm source="AreaOfInterestModal" />
          )}
          {!loading &&
            loggedIn &&
            isProfileFormFilled && (
            <AreaOfInterestForm
              canDelete={canDelete}
              closeForm={this.handleCloseModal}
              viewAfterSave={viewAfterSave}
            />
          )}
        </div>
      </Modal>
    );
  }
}

export default AreaOfInterestModal;
