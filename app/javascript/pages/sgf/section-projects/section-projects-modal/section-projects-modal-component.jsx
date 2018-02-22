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
        <div className="header">
          {data.title && <h1>{data.title}</h1>}
          <h2>
            {data.legend} - {data.city}
          </h2>
        </div>
        {data.image && (
          <div className="image">
            <img src={data.image} alt="SGF project detail" />
            <span>{data.image_credit}</span>
          </div>
        )}
        <div className="content">
          {data.outcome && <p className="short-description">{data.outcome}</p>}
          {data.category && <p className="category">{data.category}</p>}
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
