import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';

import Modal from '../modal';

import './styles.scss';

class ModalWelcome extends PureComponent {
  getContent() {
    const { setModalTCLDislaimer } = this.props;
    return (
      <div className="c-modal-tcl-disclaimer">
        <h3>Tree Cover loss 2018!</h3>
        <div className="body">
          <p className="intro">
            NOTE: 2018 tree cover loss data is coming to the dashboards soon! In
            the meantime, download 2018 tree cover loss statistics here.
          </p>
          <div className="buttons">
            <Button
              className="download-btn"
              extLink="https://gfw2-data.s3.amazonaws.com/country-pages/country_stats/download/global.xlsx"
            >
              DOWNLOAD 2018 DATA
            </Button>
            <Button
              theme="theme-button-light"
              onClick={() => setModalTCLDislaimer(false)}
            >
              CONTINUE
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { open, setModalTCLDislaimer } = this.props;
    return (
      <Modal
        isOpen={open}
        contentLabel="TCL Disclaimer"
        onRequestClose={() => setModalTCLDislaimer(false)}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

ModalWelcome.propTypes = {
  open: PropTypes.bool,
  setModalTCLDislaimer: PropTypes.func
};

export default ModalWelcome;
