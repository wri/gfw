import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modals/modal';
import Button from 'components/ui/button';
import Tip from 'components/ui/tip';

// import dollarIcon from 'assets/icons/info.svg';
import './styles.scss';

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
                theme: 'tip',
                position: 'top',
                arrow: true,
                html: <Tip text="SMALL GRANTS FUND" />
              }}
            >
              $
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
  isOpen: PropTypes.bool,
  setSectionProjectsModal: PropTypes.func.isRequired
};

export default SectionProjectsModal;
