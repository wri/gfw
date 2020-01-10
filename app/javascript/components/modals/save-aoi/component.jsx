import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

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
    activeArea: PropTypes.object,
    modalDesc: PropTypes.string
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

  parseBoldText = str => {
    if (str.includes('<b>')) {
      const regex = /(?:^|\s)<b>(.*?)<\/b>(?:\s|$)/g;
      const match = regex.exec(str);
      const other = str.split(match[0]);
      return (
        <p>
          {other[0]}
          <b>{match[1]}</b> {other[1]}
        </p>
      );
    }
    return <p>str</p>;
  };

  renderConfirmation = () => {
    const { deleted, modalDesc } = this.props;

    return (
      <div className="confirmation-message">
        {!deleted && <Icon icon={successIcon} className="icon-confirmation" />}
        {this.parseBoldText(modalDesc)}
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
        className={cx(
          'save-aoi-modal-wrapper',
          { confirmed: saved || deleted },
          { 'hide-title': loading }
        )}
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
