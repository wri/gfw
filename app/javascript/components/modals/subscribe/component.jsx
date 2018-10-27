import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';

import successIcon from 'assets/icons/success.svg';

import Modal from '../modal';
import SubscriptionForm from './components/subscription-form';

import './styles.scss';

class ModalSubscribe extends PureComponent {
  handleCloseModal = () => {
    const { setSubscribeSettings, resetSubscribe } = this.props;
    setSubscribeSettings({ open: false });
    resetSubscribe();
  };

  renderUserLoginForm = () => <MyGFWLogin className="mygfw-subscribe" />;

  renderSaved = () => (
    <div className="saved">
      <Icon icon={successIcon} className="icon-success" />
      <p>
        This subscription has been added to your profile. Please check your
        email and click on the link to confirm your subscription. Visit your
        saved subscriptions to manage them.
      </p>
      <div className="success-actions">
        <Button
          className="mygfw-btn"
          theme="theme-button-light"
          extLink="/my_gfw/subscriptions"
        >
          VIEW IN MY GFW
        </Button>
        <Button className="reset-btn" onClick={this.handleCloseModal}>
          RETURN TO MAP
        </Button>
      </div>
    </div>
  );

  render() {
    const { open, userData, loading, locationName, saved } = this.props;

    return (
      <Modal isOpen={open} onRequestClose={this.handleCloseModal}>
        <div className="c-modal-subscribe">
          <h3>
            {saved
              ? 'Subscription saved'
              : `Subscribe to forest change alerts for ${locationName}`}
          </h3>
          <div className="subscribe-body">
            {loading && <Loader />}
            {!loading && isEmpty(userData) && this.renderUserLoginForm()}
            {!loading &&
              !isEmpty(userData) &&
              !saved && <SubscriptionForm {...this.props} />}
            {!loading && !isEmpty(userData) && saved && this.renderSaved()}
          </div>
        </div>
      </Modal>
    );
  }
}

ModalSubscribe.propTypes = {
  saved: PropTypes.bool,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  setSubscribeSettings: PropTypes.func,
  resetSubscribe: PropTypes.func,
  userData: PropTypes.object,
  datasets: PropTypes.array,
  setModalMeta: PropTypes.func,
  locationName: PropTypes.string,
  activeDatasets: PropTypes.array
};

export default ModalSubscribe;
