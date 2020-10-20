import PageLayout from 'layouts/page';
import Search from 'components/pages/search';

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
