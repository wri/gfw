import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ShareComponent from './share-component';
import actions from './share-actions';

export { initialState } from './share-reducers';
export { default as reducers } from './share-reducers';
export { default as actions } from './share-actions';

const mapStateToProps = state => ({
  isOpen: state.share.isOpen,
  haveEmbed: state.share.haveEmbed,
  selectedType: state.share.selectedType,
  data: state.share.data,
  location: state.location
});

class ShareContainer extends PureComponent {
  componentWillUpdate(nextProps) {
    const { isOpen, setShare } = nextProps;

    if (isOpen && !this.props.isOpen) {
      setShare(nextProps);
    }
  }

  changeType = type => {
    const { setShareType } = this.props;
    setShareType(type);
  };

  copyToClipboard = input => {
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

  handleClose = () => {
    const { setIsOpen } = this.props;
    setIsOpen(false);
  };

  render() {
    return createElement(ShareComponent, {
      ...this.props,
      changeType: this.changeType,
      copyToClipboard: this.copyToClipboard,
      handleFocus: this.handleFocus,
      handleClose: this.handleClose
    });
  }
}

ShareContainer.propTypes = {
  isOpen: PropTypes.bool,
  setShareType: PropTypes.func,
  setIsOpen: PropTypes.func
};

export default connect(mapStateToProps, actions)(ShareContainer);
