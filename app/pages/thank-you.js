import { PureComponent } from 'react';

import Layout from 'layouts/page';
import ThankYou from 'layouts/thank-you';

class ThankYouPage extends PureComponent {
  render() {
    return (
      <Layout {...this.props}>
        <ThankYou />
      </Layout>
    );
  }
}

export default ThankYouPage;
