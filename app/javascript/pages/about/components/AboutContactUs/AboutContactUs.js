import React, { Component } from 'react';
import { Element } from 'react-scroll';
import axios from 'axios';

import ContactUsForm from './ContactUsForm';

class AboutHow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      success: false
    };
  }

  getLanguage = () =>
    (window.Transifex ? window.Transifex.live.getSelectedLanguageCode() : 'en');

  closeModal = () => {
    this.setState({ success: false });
  };

  handleSubmit = values => {
    const newValues = { ...values };
    newValues.language = this.getLanguage();

    axios.post(
      `${window.gfw.config.GFW_API_HOST_PROD}/form/contact-us`,
      newValues
    );
    this.setState({ success: true });
  };

  render() {
    return (
      <Element name="contactUs" className="c-about-contactus">
        {!this.state.success ? (
          <div className="row">
            <div className="small-12 large-6 columns">
              <div className="c-about-contactus__content">
                <div className="c-about-contactus__title text -title-xs -color-3">
                  CONTACT US
                </div>
                <div className="c-about-contactus__summary text -paragraph -color-2">
                  Question, comment, request, feedback? We want to hear from
                  you! Help us improve Global Forest Watch by completing the
                  form on the right.
                </div>
                <div className="c-about-contactus__address text -paragraph-2 -color-2">
                  <p>Global Forest Watch, 10 G Street NE Suite 800</p>
                  <p>Washington, DC 20002, USA</p>
                  <p>
                    <a
                      className="text -title-xxs -color-4"
                      href="http://www.wri.org/our-work/project/global-forest-watch"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore the team
                    </a>
                  </p>
                  <p>
                    <a
                      className="text -title-xxs -color-4"
                      href="https://careers.wri.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore jobs
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="small-12 large-6 columns">
              <ContactUsForm onSubmit={this.handleSubmit} />
            </div>
          </div>
        ) : (
          <div className="c-about-contactus__success">
            <div className="row">
              <div className="c-about-contactus__success-title">
                Thank you for contacting Global Forest Watch! Check your inbox
                for a confirmation email.
              </div>
              <div className="c-about-contactus__success-subtitle">
                Interested in getting news and updates from us?
              </div>
              <a
                href="?show_newsletter=true"
                className="c-about-contactus__success-button"
              >
                Sign up for our newsletter
              </a>
              <button
                className="c-about-contactus__cancel-button"
                onClick={this.closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Element>
    );
  }
}

export default AboutHow;
