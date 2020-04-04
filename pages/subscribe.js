import { PureComponent } from 'react';

import Layout from 'layouts/page';
import Subscribe from 'layouts/subscribe';

class SubscribePage extends PureComponent {
  render() {
    return (
      <Layout {...this.props}>
        <Subscribe />
      </Layout>
    );
  }
}

export default SubscribePage;
