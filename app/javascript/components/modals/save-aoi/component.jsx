import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import successIcon from 'assets/icons/success.svg';

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
    error: PropTypes.bool,
    geostoreId: PropTypes.string,
    saved: PropTypes.bool,
    deleted: PropTypes.bool,
    activeArea: PropTypes.object
  };

  componentWillUnmount() {
    this.handleCloseModal();
  }

  handleCloseModal = () => {
    const { setSaveAOISettings, resetSaveAOI, saving } = this.props;
    if (!saving) {
      setSaveAOISettings({ open: false, activeAreaId: null });
      resetSaveAOI();
    }
  };

  renderConfirmation = () => {
    const { deleted } = this.props;
    const message = deleted
      ? 'This area of interest has been deleted from your My GFW.'
      : 'This area of interest has been added to your My GFW. If you subscribed to alerts please check your email and click on the link to confirm your subscription.';

    return (
      <div className="confirmation-message">
        {!deleted && <Icon icon={successIcon} className="icon-confirmation" />}
        <p>{message}</p>
        <div className="confirmation-actions">
          <Button className="close-btn" onClick={this.handleCloseModal}>
            GOT IT!
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const {
      title,
      open,
      userData,
      loading,
      geostoreId,
      saved,
      deleted
    } = this.props;
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
              !loggedIn &&
              !saved &&
              !deleted && (
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
              !saved &&
              !deleted &&
              loggedIn && (
              <SaveAOIForm {...this.props} geostoreId={geostoreId} />
            )}
            {!loading && (saved || deleted) && this.renderConfirmation()}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalSaveAOI;
