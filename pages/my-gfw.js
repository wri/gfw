import PageLayout from 'layouts/page';
import MyGfw from 'components/pages/my-gfw';

const MyGfwPage = () => (
  <PageLayout
    title="My GFW | Global Forest Watch"
    description="Create an account or log into My GFW. Explore the status of forests in custom areas by layering data to create custom maps of forest change, cover and use."
    noIndex
  >
    <MyGfw />
  </PageLayout>
);

export default MyGfwPage;
