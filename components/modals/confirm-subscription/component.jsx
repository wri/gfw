import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import { resendSubscriptionConfirmation } from 'services/subscriptions';

import { Loader, Button } from 'gfw-components';

import Modal from 'components/modal';

// import './styles.scss';

class ConfirmSubscriptionModal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    setConfirmSubscriptionModalSettings: PropTypes.func,
    activeArea: PropTypes.object,
  };

  state = {
    sendingConfirmation: false,
    sent: false,
    failed: false,
  };

  handleCloseModal = () => {
    const { setConfirmSubscriptionModalSettings } = this.props;
    setConfirmSubscriptionModalSettings({ open: false, activeAreaId: null });
  };

  handleSuccessfulResend = () => {
    this.setState({ sendingConfirmation: false, sent: true });
    setTimeout(() => this.setState({ sent: false }), 4000);
  };

  handleResendConfirmation = () => {
    const { activeArea } = this.props;

    if (activeArea && activeArea.subscriptionId) {
      this.setState({ sendingConfirmation: true, sent: false, failed: false });
      resendSubscriptionConfirmation(activeArea.subscriptionId)
        .then(() => {
          this.handleSuccessfulResend();
        })
        .catch(() => {
          this.setState({ failed: true, sendingConfirmation: false });
        });
    }
  };

  render() {
    const { open, activeArea } = this.props;

    const { email, name } = activeArea || {};

    return (
      <Modal
        open={open}
        contentLabel="confirm subscription"
        onRequestClose={this.handleCloseModal}
        className="c-confirm-subscription-modal"
        title="Please confirm this subscription"
      >
        <p>
          {ReactHtmlParser(
            `We have sent an email to <i>${email}</i> with a link to verify the alerts subscription for <i>${name}</i>`
          )}
        </p>
        <p>
          Please check your inbox and click the confirmation link. If you
          don&apos;t see this email, try checking your spam folder.
        </p>
        <div className="resend-footer">
          <Button
            className="resend-btn"
            light
            onClick={this.handleResendConfirmation}
          >
            resend email
            {this.state.sendingConfirmation && (
              <Loader className="resend-loader" />
            )}
          </Button>
          {this.state.sent && <span>confirmation resent</span>}
          {this.state.failed && (
            <span className="error">
              there was an issue resending your confirmation
            </span>
          )}
        </div>
      </Modal>
    );
  }
}

export default ConfirmSubscriptionModal;
