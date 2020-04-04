import { PureComponent } from 'react';

import Layout from 'layouts/page';
import Search from 'layouts/search';

class SearchPage extends PureComponent {
  render() {
    return (
      <Layout {...this.props}>
        <Search />
      </Layout>
    );
  }
}

export default SearchPage;
