import { connect } from 'react-redux';

import EmbedComponent from './embed-component';
import { getEmbedDashboardsProps } from './embed-selectors';

export default connect(getEmbedDashboardsProps)(EmbedComponent);
