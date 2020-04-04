import { PureComponent } from 'react';

import Layout from 'layouts/page';
import Terms from 'layouts/terms';

class TermsPage extends PureComponent {
  render() {
    return (
      <Layout {...this.props}>
        <Terms />
      </Layout>
    );
  }
}

export default TermsPage;
