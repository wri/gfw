import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';

import './section-projects-modal-styles.scss';

class SectionProjectsModal extends PureComponent {
  getContent() {
    const { data } = this.props;
    if (!data) return null;
    return (
      <div className="c-projects-modal">
        <div className="c-projects-modal__header">
          {data.title && (
            <h1 className="text -title-big -color-2 -light">{data.title}</h1>
          )}
          <h2 className="text -title-xxs -color-2-o">
            {data.legend} {data.city}
          </h2>
        </div>
        {data.image && (
          <div className="c-projects-modal__image">
            <img src={data.image} alt="SGF project detail" />
            <span>{data.image_credit}</span>
          </div>
        )}
        <div className="c-projects-modal__content">
          {data.outcome && (
            <p className="text -paragraph -color-2 -light">{data.outcome}</p>
          )}
        </div>
        <div className="c-projects-modal__footer">
          {data.category && (
            <p className="text -paragraph-5 -color-4">{data.category}</p>
          )}
        </div>
      </div>
    );
  }

  handleClose = () => {
    this.props.setSectionProjectsModal({ isOpen: false });
  };

  render() {
    const { isOpen } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestClose={this.handleClose}>
        {this.getContent()}
      </Modal>
    );
  }
}

SectionProjectsModal.propTypes = {
  data: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setSectionProjectsModal: PropTypes.func.isRequired
};

export default SectionProjectsModal;
