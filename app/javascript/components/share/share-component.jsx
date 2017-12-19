import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modal';

import Button from 'components/button';
import Icon from 'components/icon/icon';

import googleplusIcon from 'assets/icons/googleplus.svg';
import twitterIcon from 'assets/icons/twitter.svg';
import facebookIcon from 'assets/icons/facebook.svg';

import './share-styles.scss';

class Share extends PureComponent {
  componentWillUpdate(newProps) {
    const { isOpen, data: { url, embedUrl }, setShareableUrl } = newProps;

    if (
      isOpen &&
      (url !== this.props.data.url || embedUrl !== this.props.data.embedUrl)
    ) {
      setShareableUrl(newProps);
    }
  }

  getContent() {
    const {
      haveEmbed,
      selectedType,
      data: { title, url, embedUrl }
    } = this.props;

    return (
      <div className="c-share">
        <div className="c-share__title">{title}</div>
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
            value={selectedType === 'embed' ? embedUrl : url}
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
            <Button
              className={`share-button ${
                selectedType !== 'embed' ? 'theme-button-light-green' : ''
              }`}
              onClick={() => this.changeType('embed')}
            >
              EMBED
            </Button>
            <Button
              className={`share-button ${
                selectedType === 'embed' ? 'theme-button-light-green' : ''
              }`}
              onClick={() => this.changeType('link')}
            >
              LINK
            </Button>
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
  data: PropTypes.object.isRequired,
  setShareModal: PropTypes.func.isRequired,
  setShareType: PropTypes.func.isRequired
};

export default Share;
