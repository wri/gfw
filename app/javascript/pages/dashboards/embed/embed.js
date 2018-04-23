import { connect } from 'react-redux';

import EmbedComponent from './embed-component';

const mapStateToProps = ({ location }) => ({
  widgetKey: location.payload.widget
});

export default connect(mapStateToProps)(EmbedComponent);
