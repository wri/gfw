import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { track } from 'utils/analytics';
import reducerRegistry from 'app/registry';

import * as actions from './share-actions';
import reducers, { initialState } from './share-reducers';
import ShareComponent from './share-component';

const mapStateToProps = ({ share, location }) => ({
  ...share,
  location
});

class ShareContainer extends PureComponent {
  handleCopyToClipboard = input => {
    const { setShareCopied, selected, data: { shareUrl } } = this.props;
    input.select();

    try {
      document.execCommand('copy');
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch (err) {
      alert('This browser does not support clipboard access'); // eslint-disable-line
    }

    track(selected === 'link' ? 'shareCopyLink' : 'shareCopyEmbed', {
      label: shareUrl
    });
  };

  handleFocus = event => {
    event.target.select();
  };

  render() {
    return createElement(ShareComponent, {
      ...this.props,
      handleCopyToClipboard: this.handleCopyToClipboard,
      handleFocus: this.handleFocus
    });
  }
}

ShareContainer.propTypes = {
  setShareCopied: PropTypes.func.isRequired,
  selected: PropTypes.string,
  data: PropTypes.object
};

reducerRegistry.registerModule('share', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(ShareContainer);
