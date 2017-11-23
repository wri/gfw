import { createElement } from 'react';
import { connect } from 'react-redux';

import { getShortenUrl } from 'services/bitly';

import actions from './share-actions';
import reducers, { initialState } from './share-reducers';

import ShareComponent from './share-component';

const mapStateToProps = state => ({
  isOpen: state.share.isOpen,
  data: state.share.data,
  url: state.share.url
});

const ShareContainer = props => {
  const setShareableUrl = url => {
    getShortenUrl(url).then(response => {
      if (response.data.status_code === 200) {
        props.setShareUrl(response.data.data.url);
      } else {
        props.setShareUrl(url);
      }
    });
  };

  return createElement(ShareComponent, {
    ...props,
    setShareableUrl
  });
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ShareContainer);
