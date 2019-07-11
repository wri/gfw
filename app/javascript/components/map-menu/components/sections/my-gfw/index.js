import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import { goToAOI } from 'components/modals/save-aoi/actions';

import Component from './component';

import { mapStateToProps } from './selectors';

class MyGFWMenu extends PureComponent {
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

MyGFWMenu.propTypes = {};

export default connect(mapStateToProps, {
  onInfoClick: setModalMetaSettings,
  goToAOI
})(MyGFWMenu);
