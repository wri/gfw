import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';

import ButtonRegular from 'components/button-regular';
import Icon from 'components/icon/icon';

import googleplusIcon from 'assets/icons/googleplus.svg';
import twitterIcon from 'assets/icons/twitter.svg';
import facebookIcon from 'assets/icons/facebook.svg';

import './share-styles.scss';

class Share extends PureComponent {
  componentWillUpdate(newProps) {
    if (
      newProps.isOpen &&
      (newProps.data.url !== this.props.data.url ||
        newProps.selectedType !== this.props.selectedType)
    ) {
      const { setShareableUrl } = newProps;
      setShareableUrl(newProps);
    }
  }

  getContent() {
    const { url, haveEmbed, data, selectedType } = this.props;

    return (
      <div className="c-share">
        <div className="c-share__title">{data.title}</div>
        <div className="c-share__subtitle">
          {selectedType === 'embed'
            ? 'Click and paste HTML to embed in website.'
            : 'Click and paste link in email or IM'}
        </div>
        <div className="c-share__input-container">
          <input
            ref={input => {
              this.textInput = input;
            }}
            type="text"
            value={url}
            readOnly
            onClick={this.handleFocus}
            className="c-share__input"
          />
          <button
            className="c-share__input-button"
            onClick={this.copyToClipboard}
          >
            COPY
          </button>
        </div>
        {haveEmbed ? (
          <div className="c-share__buttons-container">
            <ButtonRegular
              text="EMBED"
              color="white-border"
              className={`c-share__button ${
                selectedType === 'embed' ? '-selected' : ''
              }`}
              clickFunction={() => this.changeType('embed')}
            />
            <ButtonRegular
              text="LINK"
              color="white-border"
              className={`c-share__button ${
                selectedType === 'link' ? '-selected' : ''
              }`}
              clickFunction={() => this.changeType('link')}
            />
          </div>
        ) : null}
        <div className="c-share__social-container">
          <a
            href={`https://plus.google.com/share?url=${url}`}
            target="_blank"
            className="c-share__social-button -googleplus"
          >
            <Icon icon={googleplusIcon} className="googleplus-icon" />
          </a>
          <a
            href={`https://twitter.com/share?url=${url}`}
            target="_blank"
            className="c-share__social-button -twitter"
          >
            <Icon icon={twitterIcon} className="twitter-icon" />
          </a>
          <a
            href={`https://www.facebook.com/sharer.php?u=${url}`}
            target="_blank"
            className="c-share__social-button -facebook"
          >
            <Icon icon={facebookIcon} className="facebook-icon" />
          </a>
        </div>
      </div>
    );
  }

  changeType(type) {
    const { setShareType } = this.props;
    setShareType(type);
  }

  copyToClipboard = () => {
    this.textInput.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      alert('This browser does not support clipboard access');
    }
  };

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
  haveEmbed: PropTypes.bool.isRequired,
  selectedType: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  setShareModal: PropTypes.func.isRequired,
  setShareType: PropTypes.func.isRequired
};

export default Share;
