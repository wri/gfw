import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import googleplusIcon from 'assets/icons/googleplus.svg';
import twitterIcon from 'assets/icons/twitter.svg';
import facebookIcon from 'assets/icons/facebook.svg';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon/icon';
import Loader from 'components/ui/loader';
import Modal from '../modal';

import './share-styles.scss';

class Share extends PureComponent {
  getContent() {
    const {
      selected,
      loading,
      copied,
      data,
      data: { title, subtitle, shareUrl, embedUrl, embedSettings },
      handleFocus,
      setShareSelected,
      handleCopyToClipboard
    } = this.props;

    const inputValue =
      selected === 'embed'
        ? `<iframe width="${embedSettings.width}" height="${
          embedSettings.height
        }" frameborder="0" src="${embedUrl}"></iframe>`
        : shareUrl;

    return (
      <div className="c-share">
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
        <div className="actions">
          <p className="info">
            {selected === 'embed'
              ? 'Click and paste HTML to embed in website'
              : 'Click and paste link in email or IM'}
          </p>
          <div className="input-container">
            <div className="input">
              {loading &&
                selected !== 'embed' && <Loader className="input-loader" />}
              <input
                ref={input => {
                  this.textInput = input;
                }}
                type="text"
                value={!loading ? inputValue : ''}
                readOnly
                onClick={handleFocus}
              />
            </div>
            <Button
              theme="theme-button-light"
              className="input-button"
              onClick={() => handleCopyToClipboard(this.textInput)}
              disabled={loading}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </Button>
          </div>
          {embedUrl ? (
            <div className="buttons-container">
              <Button
                className={`share-button ${
                  selected === 'embed' ? 'theme-button-light' : ''
                }`}
                onClick={() => setShareSelected('link')}
              >
                LINK
              </Button>
              <Button
                className={`share-button ${
                  selected !== 'embed' ? 'theme-button-light' : ''
                }`}
                onClick={() => setShareSelected('embed')}
              >
                EMBED
              </Button>
            </div>
          ) : null}
        </div>
        <div className="social-container">
          <Button
            extLink={`https://plus.google.com/share?url=${shareUrl}`}
            className="social-button -googleplus"
            trackingData={{
              ...data,
              socialNetwork: 'googleplus'
            }}
          >
            <Icon icon={googleplusIcon} className="googleplus-icon" />
          </Button>
          <Button
            extLink={`https://twitter.com/intent/tweet?text=${
              title
            }&via=globalforests&url=${shareUrl}`}
            className="social-button -twitter"
            trackingData={{
              ...data,
              socialNetwork: 'twitter'
            }}
          >
            <Icon icon={twitterIcon} className="twitter-icon" />
          </Button>
          <Button
            extLink={`https://www.facebook.com/sharer.php?u=${shareUrl}`}
            className="social-button -facebook"
            trackingData={{
              ...data,
              socialNetwork: 'facebook'
            }}
          >
            <Icon icon={facebookIcon} className="facebook-icon" />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { open, setShareOpen } = this.props;
    return (
      <Modal isOpen={open} onRequestClose={() => setShareOpen(false)}>
        {this.getContent()}
      </Modal>
    );
  }
}

Share.propTypes = {
  open: PropTypes.bool,
  selected: PropTypes.string,
  copied: PropTypes.bool,
  data: PropTypes.object,
  loading: PropTypes.bool,
  setShareOpen: PropTypes.func,
  setShareSelected: PropTypes.func,
  handleFocus: PropTypes.func,
  handleCopyToClipboard: PropTypes.func
};

export default Share;
