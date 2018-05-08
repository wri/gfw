import { connect } from 'react-redux';
import replace from 'lodash/replace';

import MetaComponent from './meta-component';

const mapStateToProps = ({ widgets }) => {
  const widget = replace(window.location.hash, '#', '');
  return {
    widgetImage: widget ? widgets[widget].config.shareImage : null
  };
};

export default connect(mapStateToProps, null)(MetaComponent);
