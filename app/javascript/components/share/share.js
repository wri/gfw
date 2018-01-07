import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from './share-actions';
import reducers, { initialState } from './share-reducers';
import ShareComponent from './share-component';

const mapStateToProps = ({ share, location }) => ({
  open: share.open,
  selected: share.selected,
  data: share.data,
  loading: share.loading,
  location
});

class ShareContainer extends PureComponent {
  handleCopyToClipboard = input => {
    input.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      alert('This browser does not support clipboard access');
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

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ShareContainer);
