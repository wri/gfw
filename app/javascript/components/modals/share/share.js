import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from './share-actions';
import reducers, { initialState } from './share-reducers';
import ShareComponent from './share-component';

const mapStateToProps = ({ share, location }) => ({
  open: share.open,
  selected: share.selected,
  copied: share.copied,
  data: share.data,
  loading: share.loading,
  location
});

class ShareContainer extends PureComponent {
  handleCopyToClipboard = input => {
    const { setShareCopied, data } = this.props;
    input.select();

    try {
      document.execCommand('copy');
      setShareCopied(data);
    } catch (err) {
      alert('This browser does not support clipboard access'); // eslint-disable-line
    }
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
  data: PropTypes.object
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ShareContainer);
