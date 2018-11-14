import { connect } from 'react-redux';

import { setMenuSettings } from 'pages/map/components/menu/menu-actions';
import PageComponent from './component';

export default connect(null, { setMenuSettings })(PageComponent);
