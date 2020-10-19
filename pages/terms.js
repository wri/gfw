import PageWrapper from 'wrappers/page';
import Terms from 'pages/terms';

const TermsPage = () => (
  <PageWrapper
    title="Terms of Service | Global Forest Watch"
    description="Welcome to the WRI family of environmental data platforms. By using the Services, you agree to be bound by these Terms of Service and any future updates."
    noIndex
  >
    <Terms />
  </PageWrapper>
);

export default TermsPage;
