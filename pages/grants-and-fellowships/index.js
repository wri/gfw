import { PureComponent } from 'react';

import Layout from 'layouts/page';
import GrantsAndFellowships from 'layouts/grants-and-fellowships';

class GrantsAndFellowshipsPage extends PureComponent {
  render() {
    return <Layout {...this.props}><GrantsAndFellowships /></Layout>;
  }
}

export default GrantsAndFellowshipsPage;
