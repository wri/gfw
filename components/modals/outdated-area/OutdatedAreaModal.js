import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';

const OutdatedAreaModal = ({ isOpen, handleCloseModal }) => {
  return (
    <Modal
      open={isOpen}
      contentLabel="Outdated area"
      onRequestClose={handleCloseModal}
      className="c-confirm-subscription-modal"
      title=" "
    >
      <p>
        This area uses an outdated version of political boundaries. As a result,
        alert notification emails can no longer be sent for this area. To
        continue receiving alerts, please navigate to this area on the map and
        re-save the area. Instructions on how to save an area and subscribe to
        alerts are available via in{' '}
        <a
          href="https://www.globalforestwatch.org/help/map/guides/save-area-subscribe-forest-change-notifications/"
          target="_blank"
          rel="noreferrer"
        >
          this Help Center article
        </a>
        . Please read through our{' '}
        <a
          href="https://www.globalforestwatch.org/blog/data-and-tools/updated-political-boundaries-gadm?utm_medium=email&utm_source=email1&utm_campaign=gadmupdate"
          target="_blank"
          rel="noreferrer"
        >
          blog outlining these changes
        </a>{' '}
        and let us know if you have any questions at{' '}
        <a href="mailto:gfw@wri.org">gfw@wri.org</a>.
      </p>
    </Modal>
  );
};

OutdatedAreaModal.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
};

export default OutdatedAreaModal;
