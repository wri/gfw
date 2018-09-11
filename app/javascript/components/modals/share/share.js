import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './share-actions';
import reducers, { initialState } from './share-reducers';
import ShareComponent from './share-component';

const mapStateToProps = ({ share, location }) => ({
  ...share,
  location
});

class ShareContainer extends PureComponent {
  handleCopyToClipboard = input => {
    const { setShareCopied } = this.props;
    input.select();

    try {
      document.execCommand('copy');
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
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
  setShareCopied: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ShareContainer);
