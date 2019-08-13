import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import { viewArea } from 'providers/areas-provider/actions';
import { setSaveAOISettings } from 'components/modals/save-aoi/actions';

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
  viewArea,
  onEditClick: setSaveAOISettings
})(MyGFWMenu);
