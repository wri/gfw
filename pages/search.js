import { useState, useEffect } from 'react';

import Layout from 'layouts/page';
import Search from 'pages/search';
import SearchUrlProvider from 'providers/search-url-provider';

const SearchPage = () => {
  const [ready, setReady] = useState(false);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <Layout
      noIndex
      title="Search | Global Forest Watch"
      description="Search forest information, including forest data, news, updates and more."
    >
      {ready && (
        <>
          <Search />
          <SearchUrlProvider />
        </>
      )}
    </Layout>
  );
};

export default SearchPage;
