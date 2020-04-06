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
    viewAfterSave: PropTypes.bool
  };

  componentWillUnmount() {
    this.handleCloseModal();
  }

  handleCloseModal = () => {
    const { setAreaOfInterestModalSettings } = this.props;
    setAreaOfInterestModalSettings({ open: false, activeAreaId: null });
  };

  render() {
    const { open, loading, userData, canDelete, viewAfterSave } = this.props;
    const { email, fullName, lastName, loggedIn } = userData || {};
    const isProfileFormFilled = email && (fullName || lastName);

    return (
      <Modal
        isOpen={open}
        contentLabel="Area of interest"
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
