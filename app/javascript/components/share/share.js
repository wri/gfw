import { createElement } from 'react';
import { connect } from 'react-redux';

import { getShortenUrl } from 'services/bitly';

import actions from './share-actions';
import reducers, { initialState } from './share-reducers';

import ShareComponent from './share-component';

const mapStateToProps = state => ({
  isOpen: state.share.isOpen,
  haveEmbed: state.share.haveEmbed,
  selectedType: state.share.selectedType,
  data: state.share.data
});

const ShareContainer = props => {
  const setShareableUrl = newProps => {
    const { data, selectedType, setShareUrl } = newProps;

    if (selectedType === 'link') {
      getShortenUrl(data.url).then(response => {
        setShareUrl(
          response.data.status_code === 200 ? response.data.data.url : data.url
        );
      });
    } else if (selectedType === 'embed') {
      setShareUrl(
        `<iframe width="${data.embedSettings.width}" height="${
          data.embedSettings.height
        }" frameborder="0" src="${
          data.embedUrl ? data.embedUrl : data.url
        }"></iframe>`
      );
    }
  };

  return createElement(ShareComponent, {
    ...props,
    setShareableUrl
  });
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ShareContainer);
