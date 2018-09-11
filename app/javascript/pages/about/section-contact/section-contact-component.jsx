import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/button';
import Contact from 'components/forms/contact';
import Loader from 'components/ui/loader';

import './section-contact-styles.scss';

class SectionContact extends PureComponent {
  render() {
    const {
      handleSubmit,
      showConfirm,
      setShowConfirm,
      error,
      submitting
    } = this.props;
    return (
      <div className="l-section-contact">
        <div className="row">
          {submitting && <Loader />}
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
              href="http://www.wri.org/our-work/project/global-forest-watch"
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
            <Contact onSubmit={handleSubmit} />
          </div>
          {showConfirm && (
            <div className="feedback-message">
              <h3>
                Thank you for contacting Global Forest Watch! Check your inbox
                for a confirmation email.
              </h3>
              <p>Interested in getting news and updates from us?</p>
              <div className="button-group">
                <Button link="/about?show_newsletter=true">
                  Sign up for our newsletter
                </Button>
                <Button
                  className="close-button"
                  onClick={() => setShowConfirm(false)}
                >
                  No thanks
                </Button>
              </div>
            </div>
          )}
          {error && (
            <div className="feedback-message">
              <h3>There was a problem sending your message.</h3>
              <Button onClick={() => setShowConfirm(false)}>Try again</Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

SectionContact.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  showConfirm: PropTypes.bool,
  setShowConfirm: PropTypes.func,
  error: PropTypes.bool,
  submitting: PropTypes.bool
};

export default SectionContact;
