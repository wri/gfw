import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';

import Modal from '../modal';
import SaveAOIForm from './components/save-aoi-form';

class ModalSaveAOI extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    saving: PropTypes.bool,
    loading: PropTypes.bool,
    resetSaveAOI: PropTypes.func,
    setSaveAOISettings: PropTypes.func,
    onAfterSave: PropTypes.func,
    onAferDelete: PropTypes.func,
    userData: PropTypes.object
  };

  componentDidUpdate(prevProps) {
    const { saving } = this.props;
    if (!saving && saving !== prevProps.saving) {
      this.handleCloseModal();
    }
  }

  handleCloseModal = () => {
    const { setSaveAOISettings, resetSaveAOI, saving } = this.props;
    if (!saving) {
      setSaveAOISettings({ open: false, activeAreaId: null });
      resetSaveAOI();
    }
  };

  render() {
    const { title, open, userData, loading } = this.props;
    const loggedIn = !isEmpty(userData);

    return (
      <Modal
        isOpen={open}
        contentLabel={title}
        onRequestClose={this.handleCloseModal}
        title={title}
      >
        <div className="c-modal-save-aoi">
          <div className="save-aoi-body">
            {loading && <Loader />}
            {!loading && !loggedIn && <MyGFWLogin className="mygfw-save-aoi" />}
            {!loading &&
              loggedIn && (
              <SaveAOIForm
                {...this.props}
                email={userData.email}
                lang={userData.language}
              />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalSaveAOI;
