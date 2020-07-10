import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modals/modal';
import Button from 'components/ui/button';
import Tip from 'components/ui/tip';

import './styles.scss';

class SectionProjectsModal extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    isOpen: PropTypes.bool,
    setSectionProjectsModal: PropTypes.func.isRequired,
  };

  getContent() {
    const { data } = this.props;
    if (!data) return null;

    return (
      <div className="c-projects-modal">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
        <div className="links">
          {data.sgf && (
            <a
              href="/grants-and-fellowships"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                theme="theme-button-light square"
                tooltip={{
                  theme: 'tip',
                  position: 'top',
                  arrow: true,
                  html: <Tip text="SMALL GRANTS FUND" />,
                }}
              >
                $
              </Button>
            </a>
          )}
          {data.link && (
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              <Button>LEARN MORE</Button>
            </a>
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
      <Modal isOpen={!!isOpen} onRequestClose={this.handleClose}>
        {this.getContent()}
      </Modal>
    );
  }
}

export default SectionProjectsModal;
