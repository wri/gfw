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
          <h2>{data.meta}</h2>
        </div>
        {data.image && (
          <div className="image">
            <img src={data.image} alt="SGF project detail" />
          </div>
        )}
        <div className="content">
          {data.description && (
            <p className="description">{data.description}</p>
          )}
          {data.descriptionLink && (
            <p className="links">{data.descriptionLink}</p>
          )}
          {data.blogSentence && <p className="links">{data.blogSentence}</p>}
          {data.blogLink && <p className="links">{data.blogLink}</p>}
          {data.categories && (
            <p className="links">{data.categories.filter(i => i).join(', ')}</p>
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
