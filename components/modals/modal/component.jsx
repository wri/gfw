import PropTypes from 'prop-types';
import { track } from 'analytics';

import { Modal as ModalComponent } from 'gfw-components';

const Modal = ({ children, ...props }) => (
  <ModalComponent
    onAfterOpen={() => props.contentLabel && track('openModal', { label: props.contentLabel })}
    {...props}
  >
    {children}
  </ModalComponent>
);

Modal.propTypes = {
  children: PropTypes.node,
  contentLabel: PropTypes.string
}

export default Modal;
