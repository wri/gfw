import { connect } from 'react-redux';
import replace from 'lodash/replace';
import * as WIDGETS from 'components/widget/widget-manifest';

import MetaComponent from './meta-component';

const mapStateToProps = () => {
  const widget = replace(window.location.hash, '#', '');
  return {
    widgetImage: widget ? WIDGETS[widget].initialState.config.shareImage : null
  };
};

export default connect(mapStateToProps, null)(MetaComponent);
