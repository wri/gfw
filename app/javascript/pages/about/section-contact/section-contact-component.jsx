import React, { PureComponent } from 'react';
import ContactForm from 'components/forms/contact';

import './section-contact-styles.scss';

class SectionContact extends PureComponent {
  render() {
    return (
      <div className="l-section-contact">
        <div className="row">
          <div className="column small-12 large-6 desc">
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
          </div>
          <div className="column small-12 large-6">
            <ContactForm />
          </div>
        </div>
      </div>
    );
  }
}

export default SectionContact;
