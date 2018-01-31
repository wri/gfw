import { connect } from 'react-redux';
import replace from 'lodash/replace';
import WIDGETS from 'pages/country/data/widgets-config.json';

import MetaComponent from './meta-component';

const mapStateToProps = () => {
  const widget = replace(window.location.hash, '#', '');
  return {
    widgetImage: widget ? WIDGETS[widget].config.shareImage : null
  };
};

export default connect(mapStateToProps, null)(MetaComponent);
