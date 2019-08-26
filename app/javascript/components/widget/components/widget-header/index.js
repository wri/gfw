import { connect } from 'react-redux';

import { getWidgetHeaderProps } from './selectors';
import WidgetHeaderComponent from './component';

export default connect(getWidgetHeaderProps)(WidgetHeaderComponent);
