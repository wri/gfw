import { connect } from 'react-redux';

import { setWidgetSettings } from 'components/widgets/actions';
import Component from './component';

export default connect(null, { setWidgetSettings })(Component);
