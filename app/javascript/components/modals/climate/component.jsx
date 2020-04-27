import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

import './styles.scss';

class ModalGFWClimate extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    setClimateModalOpen: PropTypes.func.isRequired,
    setContactUsModalOpen: PropTypes.func.isRequired,
  };

  render() {
    const { open, setClimateModalOpen, setContactUsModalOpen } = this.props;

    return (
      <Modal
        isOpen={open}
        contentLabel="Global Forest Watch Climate"
        onRequestClose={() => setClimateModalOpen(false)}
        title="Global Forest Watch Climate."
        className="c-gfw-climate-modal"
      >
        <div className="climate-content">
          <p>
            {`The Global Forest Watch Climate website is no longer available. We
            hope you can find the data and information you're looking for
            here. If not, `}
            <a
              href=""
              onClick={() => {
                setClimateModalOpen();
                setContactUsModalOpen(true);
              }}
            >
              contact us
            </a>
            {" and we'll be happy to help."}
          </p>
        </div>
      </Modal>
    );
  }
}

export default ModalGFWClimate;
