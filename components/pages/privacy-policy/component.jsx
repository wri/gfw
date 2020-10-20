import React from 'react';

import { Row, Column } from 'gfw-components';

import './styles.scss';

const PrivacyPolicyPage = () => (
  <div className="l-privacy-page">
    <Row>
      <Column width={[1, 1 / 12]} />
      <Column width={[1, 5 / 6]}>
        <div className="privacy-container">
          <iframe
            src="https://www.wri.org/upload/privacy-policy.html"
            style={{
              overflow: 'hidden',
              height: '100%',
              width: '100%',
            }}
            width="100%"
            height="100%"
            title="privacy-policy"
            frameBorder="0"
          />
        </div>
      </Column>
    </Row>
  </div>
);

export default PrivacyPolicyPage;
