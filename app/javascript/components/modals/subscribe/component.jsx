import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';

import Modal from '../modal';
import SubscriptionForm from './components/subscription-form';

import './styles.scss';

class ModalSubscribe extends PureComponent {
  renderUserLoginForm = () => <MyGFWLogin className="mygfw-subscribe" />;

  render() {
    const {
      open,
      setSubscribeSettings,
      userData,
      loading,
      locationName
    } = this.props;

    return (
      <Modal
        isOpen={open}
        onRequestClose={() => setSubscribeSettings({ open: false })}
      >
        <div className="c-modal-subscribe">
          <h3>Subscribe to Forest Change Alerts for {locationName}</h3>
          <div className="subscribe-body">
            {loading && <Loader />}
            {!loading &&
              !isEmpty(userData) && <SubscriptionForm {...this.props} />}
            {!loading && isEmpty(userData) && this.renderUserLoginForm()}
          </div>
        </div>
      </Modal>
    );
  }
}

ModalSubscribe.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  setSubscribeSettings: PropTypes.func,
  userData: PropTypes.object,
  datasets: PropTypes.array,
  setModalMeta: PropTypes.func,
  locationName: PropTypes.string,
  activeDatasets: PropTypes.array
};

export default ModalSubscribe;
