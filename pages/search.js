import PageLayout from 'layouts/wrappers/page';
import Search from 'layouts/search';

const SearchPage = () => (
  <PageLayout
    title="Search | Global Forest Watch"
    description="Search forest information, including forest data, news, updates and more."
    noIndex
  >
    <Search />
  </PageLayout>
);

export default SearchPage;
