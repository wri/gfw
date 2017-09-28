import React, { Component } from 'react';
import {Element} from 'react-scroll';

import ContactUsForm from'./ContactUsForm';

class AboutHow extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (values) => {
    console.log(values);
  }

  render() {
    return (
      <Element name="contactUs" className="c-about-contactus">
        <div className="row">
          <div className="small-12 large-6 columns">
            <div className="c-about-contactus__content">
              <div className="c-about-contactus__title text -title-xs -color-3">CONTACT US</div>
              <div className="c-about-contactus__summary text -paragraph -color-2">Question, comment, request, feedback? We want to hear from you! Help us improve Global Forest Watch by completing the form on the right.</div>
            </div>
          </div>
          <div className="small-12 large-6 columns">
            <ContactUsForm
              onSubmit={this.handleSubmit}
            />
          </div>
        </div>
      </Element>
    );
  }
}

export default AboutHow;
