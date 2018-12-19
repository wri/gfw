import { connect } from 'react-redux';
import replace from 'lodash/replace';

import MetaComponent from './meta-component';

const mapStateToProps = ({ widgets }) => {
  const widgetKey = replace(window.location.hash, '#', '');
  const widget =
    widgets && widgetKey && widgets.widgets && widgets.widgets[widgetKey];

  return {
    widgetImage: widget ? widget.config && widget.config.shareImage : null
  };
};

export default connect(mapStateToProps, null)(MetaComponent);
