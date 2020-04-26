import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logEvent } from 'app/analytics';

import twitterIcon from 'assets/icons/twitter.svg?sprite';
import facebookIcon from 'assets/icons/facebook.svg?sprite';

import Switch from 'components/ui/switch';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Loader from 'components/ui/loader';
import Modal from '../modal';

import './styles.scss';

class Share extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    selected: PropTypes.string,
    copied: PropTypes.bool,
    data: PropTypes.object,
    loading: PropTypes.bool,
    setShareOpen: PropTypes.func,
    setShareSelected: PropTypes.func,
    handleFocus: PropTypes.func,
    handleCopyToClipboard: PropTypes.func,
  };

  getContent() {
    const {
      selected,
      loading,
      copied,
      data,
      handleFocus,
      setShareSelected,
      handleCopyToClipboard,
    } = this.props;
    const { title, shareUrl, embedUrl, embedSettings } = data || {};
    const { width, height } = embedSettings || {};

    const inputValue =
      selected === 'embed'
        ? `<iframe width="${width || 670}" height="${
            height || 490
          }" frameborder="0" src="${embedUrl}"></iframe>`
        : shareUrl;

    return (
      <div className="c-share">
        <div className="actions">
          {embedUrl ? (
            <Switch
              className="share-switch-tab"
              theme="theme-switch-light"
              value={selected}
              options={[
                { label: 'LINK', value: 'link' },
                { label: 'EMBED', value: 'embed' },
              ]}
              onChange={
                selected === 'embed'
                  ? () => setShareSelected('link')
                  : () => setShareSelected('embed')
              }
            />
          ) : null}
          <p className="info">
            {selected === 'embed'
              ? 'Click and paste HTML to embed in website'
              : 'Click and paste link in email or IM'}
          </p>
          <div className="input-container">
            <div className="input">
              {loading && selected !== 'embed' && (
                <Loader className="input-loader" />
              )}
              <input
                ref={(input) => {
                  this.textInput = input;
                }}
                type="text"
                value={!loading ? inputValue : ''}
                readOnly
                onClick={handleFocus}
              />
            </div>
            <Button
              theme="theme-button-medium"
              className="input-button"
              onClick={() => handleCopyToClipboard(this.textInput)}
              disabled={loading}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </Button>
          </div>
        </div>
        <div className="social-container">
          <Button
            extLink={`https://twitter.com/intent/tweet?text=${title}&via=globalforests&url=${shareUrl}`}
            className="social-button"
            theme="theme-button-light theme-button-grey  square"
            onClick={() =>
              logEvent('shareSocial', {
                label: shareUrl,
              })}
          >
            <Icon icon={twitterIcon} className="twitter-icon" />
          </Button>
          <Button
            extLink={`https://www.facebook.com/sharer.php?u=${shareUrl}`}
            theme="theme-button-light theme-button-grey square"
            className="social-button"
            onClick={() =>
              logEvent('shareSocial', {
                label: shareUrl,
              })}
          >
            <Icon icon={facebookIcon} className="facebook-icon" />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { open, setShareOpen, data } = this.props;
    return (
      <Modal
        isOpen={open}
        contentLabel={`Share: ${data && data.title}`}
        onRequestClose={() => setShareOpen(false)}
        title={this.props.data && this.props.data.title}
      >
        {this.getContent()}
      </Modal>
    );
  }
}

export default Share;
