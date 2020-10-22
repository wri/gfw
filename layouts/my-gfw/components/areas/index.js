import { connect } from 'react-redux';

import Component from './component';
import { getAreasProps } from './selectors';

export default connect(getAreasProps)(Component);
