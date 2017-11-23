import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';

import ButtonRegular from 'components/button-regular';

import './share-styles.scss';

class Share extends PureComponent {
  componentWillUpdate(newProps) {
    if (newProps.isOpen && newProps.url === '') {
      const { data, setShareableUrl } = newProps;
      setShareableUrl(data.url);
    }
  }

  getContent() {
    const { url } = this.props;

    return (
      <div className="c-share">
        <div className="c-share__title">Share this widget</div>
        <div className="c-share__subtitle">
          Click and paste link in email or IM
        </div>
        <div className="c-share__input-container">
          <input
            type="text"
            value={url}
            readOnly
            onClick={this.handleFocus}
            className="c-share__input"
          />
          <button className="c-share__input-button">COPY</button>
        </div>
        <div className="c-share__buttons-container">
          <ButtonRegular text="Embed" />
          <ButtonRegular text="Link" />
        </div>
      </div>
    );
  }

  handleFocus = event => {
    event.target.select();
  };

  handleClose = () => {
    this.props.setShareModal({ isOpen: false });
  };

  render() {
    const { isOpen } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.handleClose}
        customStyles={{
          overlay: {
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px 0 rgba(71, 44, 184, 0.1)',
            backgroundColor: 'rgba(17, 55, 80, 0.4)'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            width: '300px',
            padding: '0',
            border: 'none',
            borderRadius: 0
          }
        }}
        closeClass="c-share-close"
      >
        {this.getContent()}
      </Modal>
    );
  }
}

Share.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  setShareModal: PropTypes.func.isRequired
};

export default Share;
