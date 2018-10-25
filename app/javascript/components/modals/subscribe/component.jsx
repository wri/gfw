import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import MyGFWLogin from 'components/mygfw-login';
import Modal from '../modal';

import './styles.scss';

class ModalSubscribe extends PureComponent {
  renderUserLoginForm = () => <MyGFWLogin className="mygfw-subscribe" />;

  renderSubscriptionForm = () => {
    const { userData } = this.props;
    return <div className="subscription-form">subscribe</div>;
  };

  render() {
    const { open, setModalSubscribe, userData } = this.props;

    return (
      <Modal isOpen={open} onRequestClose={() => setModalSubscribe(false)}>
        <div className="c-modal-subscribe">
          <h3>Subscribe to Forest Change Alerts</h3>
          <div className="subscribe-body">
            {!isEmpty(userData)
              ? this.renderSubscriptionForm()
              : this.renderUserLoginForm()}
          </div>
        </div>
      </Modal>
    );
  }
}

ModalSubscribe.propTypes = {
  open: PropTypes.bool,
  setModalSubscribe: PropTypes.func,
  userData: PropTypes.object
};

export default ModalSubscribe;
