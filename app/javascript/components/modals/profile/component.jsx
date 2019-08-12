import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';

import Modal from '../modal';
import SaveProfileForm from './components/save-profile-form';

import './styles.scss';

class ModalSaveAOI extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    saving: PropTypes.bool,
    loading: PropTypes.bool,
    userData: PropTypes.object,
    setProfileSettings: PropTypes.func
  };

  componentDidUpdate(prevProps) {
    const { saving } = this.props;
    if (!saving && saving !== prevProps.saving) {
      this.handleCloseModal();
    }
  }

  handleCloseModal = () => {
    const { setProfileSettings, saving } = this.props;
    if (!saving) {
      setProfileSettings({ open: false, activeAreaId: null });
    }
  };

  render() {
    const { open, loading, userData } = this.props;
    const loggedIn = !isEmpty(userData);

    return (
      <Modal
        isOpen={open}
        contentLabel="Update your profile"
        onRequestClose={this.handleCloseModal}
        title="Update your profile"
      >
        <div className="c-modal-save-aoi">
          <div className="save-aoi-body">
            {loading && <Loader />}
            {!loading && !loggedIn && <MyGFWLogin className="mygfw-save-aoi" />}
            {!loading && loggedIn && <SaveProfileForm userData={userData} />}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalSaveAOI;
