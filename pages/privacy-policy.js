import PageWrapper from 'layouts/page';
import PrivacyPolicy from 'pages/privacy-policy';

const PrivacyPolicyPage = () => (
  <PageWrapper
    title="Privacy Policy | Global Forest Watch"
    description="This Privacy Policy tells you how WRI handles information collected about you through our websites and applications."
    noIndex
  >
    <PrivacyPolicy />
  </PageWrapper>
);

export default PrivacyPolicyPage;
