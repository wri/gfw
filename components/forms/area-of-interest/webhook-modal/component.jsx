import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/modal';

import './styles.module.scss';

const WebhookModal = ({ open, onRequestClose }) => (
  <Modal
    open={open}
    title="Webhook URL"
    onRequestClose={onRequestClose}
    className="c-webhook-modal"
  >
    <h3>What is this feature?</h3>
    <p>
      Webhooks are data sent on demand from one app (GFW) to another over
      HTTP(S) instead of through the command line in your computer, formatted in
      XML, JSON, or form-encoded serialization.
    </p>
    <h3>What does the payload look like?</h3>
    <pre>
      {JSON.stringify(
        {
          layerSlug: 'layer slug',
          alert_name: 'area of interest name',
          alerts: 'data for your area alert',
          alert_date_begin: 'begin date',
          alert_date_end: 'end date',
          alert_link: 'url of the area on the map',
          dashboard_url: 'url of the area dashboard',
          subscription_url: 'url to My GFW for managing the area',
          unsubscribe_url: 'link to unsubscribe from alerts',
        },
        null,
        2
      )}
    </pre>
  </Modal>
);

WebhookModal.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default WebhookModal;
