import PropTypes from 'prop-types';
import { trackEvent } from 'utils/analytics';

import { Modal as ModalComponent } from '@worldresources/gfw-components';

const Modal = ({ children, ...props }) => (
  <ModalComponent
    onAfterOpen={() =>
      props.contentLabel &&
      trackEvent({
        category: 'Open modal',
        action: 'Click to open',
        label: props.contentLabel,
      })}
    {...props}
  >
    {children}
  </ModalComponent>
);

Modal.propTypes = {
  children: PropTypes.node,
  contentLabel: PropTypes.string,
};

export default Modal;
