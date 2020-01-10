import { connect } from 'react-redux';
import * as modalSourcesActions from 'components/modals/sources/actions';
import Component from './component';

export default connect(null, modalSourcesActions)(Component);
