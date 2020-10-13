import Layout from 'layouts/page';
import PrivacyPolicy from 'pages/privacy';

const PrivacyPolicyPage = () => (
  <Layout
    noIndex
    title="Privacy Policy | Global Forest Watch"
    description="This Privacy Policy tells you how WRI handles information collected about you through our websites and applications."
  >
    <PrivacyPolicy />
  </Layout>
);

export default PrivacyPolicyPage;
