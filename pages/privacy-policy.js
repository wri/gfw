import PageLayout from 'wrappers/page';
import PrivacyPolicy from 'layouts/privacy-policy';

const PrivacyPolicyPage = () => (
  <PageLayout
    title="Privacy Policy | Global Forest Watch"
    description="This Privacy Policy tells you how WRI handles information collected about you through our websites and applications."
    noIndex
  >
    <PrivacyPolicy />
  </PageLayout>
);

export default PrivacyPolicyPage;
