import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import { resendSubscriptionConfirmation } from 'services/subscriptions';

import Button from 'components/ui/button';
import Loader from 'components/ui/loader';

import Modal from '../modal';

import './styles.scss';

class ConfirmSubscriptionModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    setConfirmSubscriptionModalSettings: PropTypes.func,
    activeArea: PropTypes.object
  };

  state = {
    sendingConfirmation: false,
    sent: false
  }

  handleCloseModal = () => {
    const { setConfirmSubscriptionModalSettings } = this.props;
    setConfirmSubscriptionModalSettings({ open: false, activeAreaId: null });
  };

  handleResendConfirmation = () => {
    const { activeArea } = this.props;

    if (activeArea && activeArea.subscriptionId) {
      this.setState({ sendingConfirmation: true });
      resendSubscriptionConfirmation(activeArea.subscriptionId)
        .then(response => {
          this.setState({ sendingConfirmation: false, sent: true });
        })
        .catch(err => {
          this.setState({ sendingConfirmation: false });
        });
    }
  }

  render() {
    const {
      open,
      activeArea
    } = this.props;

    const { email, name } = activeArea || {};

    return (
      <Modal
        isOpen={open}
        contentLabel="confirm subscription"
        onRequestClose={this.handleCloseModal}
        className="c-confirm-subscription-modal"
        title="Please confirm this subscription"
      >
        <p>{ReactHtmlParser(`We have sent an email to <i>${email}</i> with a link to verify the alerts subscription for <i>${name}</i>`)}</p>
        <p>Please check your inbox and click the confirmation link. If you don't see this email, try checking your spam folder.</p>
        <Button className="resend-btn" theme="theme-button-light" onClick={this.handleResendConfirmation}>
          {this.state.sent ? 'sent!' : 'resend email'}
          {this.state.sendingConfirmation && <Loader className="resend-loader" />}
        </Button>
      </Modal>
    );
  }
}

export default ConfirmSubscriptionModal;
