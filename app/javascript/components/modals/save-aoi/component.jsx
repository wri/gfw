import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';

import Modal from '../modal';
import SaveAOIForm from './components/save-aoi-form';

import './styles.scss';

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
    userData: PropTypes.object,
    error: PropTypes.bool
  };

  componentDidUpdate(prevProps) {
    const { saving, error } = this.props;
    if (!saving && saving !== prevProps.saving && !error) {
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
            {!loading &&
              !loggedIn && (
              <Fragment>
                <p className="login-intro">
                    Login to manage your profile and areas of interest.
                    Questions?{' '}
                  <a
                    href="mailto:gfw@wri.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      Contact us
                  </a>.
                </p>
                <MyGFWLogin className="mygfw-save-aoi" />
              </Fragment>
            )}
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
