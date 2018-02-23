import { connect } from 'react-redux';

import { routes } from 'pages/about/router';
import PageComponent from './page-component';

const mapStateToProps = () => ({
  sections: Object.values(routes)[0].sections
});

export default connect(mapStateToProps)(PageComponent);
