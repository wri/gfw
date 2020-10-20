import React, { PureComponent } from 'react';

import { Row, Column, ContactUsForm } from 'gfw-components';

import './styles.scss';

class SectionContact extends PureComponent {
  render() {
    return (
      <div className="l-section-contact">
        <Row>
          <Column width={[1, 1 / 2]} className="desc">
            <h3>Contact us</h3>
            <p className="intro">
              Question, comment, request, feedback? We want to hear from you!
              Help us improve Global Forest Watch by completing the form on the
              right.
            </p>
            <p>Global Forest Watch, 10 G Street NE Suite 800</p>
            <p>Washington, DC 20002, USA</p>
            <a
              href="https://www.wri.org/our-work/project/global-forest-watch"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the team
            </a>
            <br />
            <a
              href="https://jobs.jobvite.com/wri/jobs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore jobs
            </a>
          </Column>
          <Column width={[1, 1 / 2]}>
            <ContactUsForm />
          </Column>
        </Row>
      </div>
    );
  }
}

export default SectionContact;
