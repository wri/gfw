import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';
import Button from 'components/button';

// import dollarIcon from 'assets/icons/info.svg';
import './section-projects-modal-styles.scss';

class SectionProjectsModal extends PureComponent {
  getContent() {
    const { data } = this.props;
    if (!data) return null;

    return (
      <div className="c-projects-modal">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
        <div className="links">
          {data.sgf && (
            <Button
              theme="theme-button-light square"
              extLink="/small-grants-fund"
              tooltip={{
                title: 'SMALL GRANTS FUND',
                position: 'top',
                trigger: 'mouseenter'
              }}
            >
              &#36;
            </Button>
          )}
          {data.link && <Button extLink={data.link}>LEARN MORE</Button>}
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
