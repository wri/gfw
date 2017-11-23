import { createElement } from 'react';
import { connect } from 'react-redux';

import actions from './widget-header-actions';
import reducers, { initialState } from './widget-header-reducers';

import WidgetHeaderComponent from './widget-header-component';

const mapStateToProps = () => ({});

const WidgetHeaderContainer = props => {
  const openShare = shareAnchor => {
    props.setShareModal({
      isOpen: true,
      data: {
        url: `${window.location.href}#${shareAnchor}`
      }
    });
  };

  return createElement(WidgetHeaderComponent, {
    ...props,
    openShare
  });
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetHeaderContainer);
