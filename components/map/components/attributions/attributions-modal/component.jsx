import PropTypes from 'prop-types';

import Modal from 'components/modal';

import AttributionsContent from '../attributions-content/component';

// import './styles.scss';

const ModalAttributions = ({ open, onRequestClose }) => (
  <Modal
    open={open}
    contentLabel="Attributions"
    onRequestClose={onRequestClose}
    title="Map Attributions"
    className="c-modal-attributions"
  >
    <div className="modal-attributions-content">
      <AttributionsContent isModal />
    </div>
  </Modal>
);

ModalAttributions.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default ModalAttributions;
