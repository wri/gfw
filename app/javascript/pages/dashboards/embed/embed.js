import { connect } from 'react-redux';
import EmbedComponent from './embed-component';

const mapStateToProps = ({ location }) => ({
  ...location
});

export default connect(mapStateToProps, null)(EmbedComponent);
