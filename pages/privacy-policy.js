import { PureComponent } from 'react';

import Layout from 'layouts/page';
import PrivacyPolicy from 'layouts/privacy';

class PrivacyPolicyPage extends PureComponent {
  render() {
    return (
      <Layout {...this.props}>
        <PrivacyPolicy />
      </Layout>
    );
  }
}

export default PrivacyPolicyPage;
