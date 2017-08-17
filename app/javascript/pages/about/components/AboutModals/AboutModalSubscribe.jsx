import React from 'react';
import PropTypes from 'prop-types';

const AboutModalSubscribe = (props) => {
  return (
    <div className="c-about-modal-subscribe">
      <div className="c-about-modal-subscribe__content">
        <ul className="steps">
          <!-- STEP CONTACT -->
          <li className="step" data-step="contact">
            <svg className="icon-close">
              <use xlink:href="#icon-close"></use>
            </svg>
            <div className="step-content">
              <form id="contact-form">
                <div className="form-content">
                  <span className="gradient"></span>
                  <div className="contain-width">
                    <header className="step-header">
                      <h2 className="text -title-big -light">Contact us & feedback</h2>
                      <h3 className="text -title-s -light">Question, comment, request, feedback? We want to hear from you! Help us improve Global Forest Watch by completing the form below.</h3>
                    </header>
                    <div className="field -default">
                      <label for="contact-email">Email *</label>
                      <input id="contact-email" type="email" name="email">
                    </div>
                    <div className="field -default">
                      <label for="contact-topic">Topic *</label>
                      <select id="contact-topic" className="js- chosen-select default required" name="topic" data-placeholder="Please select a topic so that we can best respond">
                        <option value="">Select a topic</option>
                        <option value="report-a-bug-or-error-on-gfw">Report a bug or error on GFW</option>
                        <option value="provide-feedback">Provide feedback</option>
                        <option value="media-request">Media request</option>
                        <option value="data-related-inquiry">Data related inquiry or suggestion</option>
                        <option value="gfw-commodities-inquiry">GFW Commodities inquiry</option>
                        <option value="gfw-fires-inquiry">GFW Fires inquiry</option>
                        <option value="gfw-climate-inquiry">GFW Climate inquiry</option>
                        <option value="gfw-water-inquiry">GFW Water inquiry</option>
                        <option value="general-inquiry">General inquiry</option>
                      </select>
                    </div>
                    <div className="field -default">
                      <label for="contact-message">Message *</label>
                      <textarea id="contact-message" name="message" placeholder="How can we help you?"></textarea>
                    </div>
                    <div className="field -default -block">
                      <h3>INTERESTED IN TESTING NEW FEATURES ON GFW?</h3>
                      <p>Sign up and become an official GFW tester!</p>
                      <div className="radio-box -inline">
                        <div className="custom-radio">
                          <input id="contact-signup-true" type="radio" name="signup" value="true">
                          <label for="contact-signup-true">
                            <span></span> Yes, sign me up.
                          </label>
                        </div>
                        <div className="custom-radio">
                          <input id="contact-signup-false" type="radio" name="signup" value="false" checked>
                          <label for="contact-signup-false">
                            <span></span> No thanks.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="m-btncontainer">
                  <button className="btn green medium huge-padding uppercase step-btn js-dinamic-color js-btn-submit -active c-regular-button -green">Submit</button>
                </div>
              </form>
            </div>
          </li>

          <!-- STEP SUCCESS -->
          <li className="step" data-step="success">
            <div className="m-newsletter">
              <header>
                <h3 className="text -title-big -light">Thank you for contacting Global Forest Watch! Check your inbox for a confirmation email.</h3>

                <div className="contain-button-sign-up">
                  <h4 className="text -title-s -light">Interested in getting news and updates from us?</h4>
                  <a className="btn green uppercase js-newsletter-sign-up c-regular-button -green" href="/?show_newsletter=true">Sign up for our newsletter</a>
                </div>
              </header>
              <!-- Pardot team newsletter -->
              <div id="newsletter"></div>
            </div>
            <div className="contain-button-close">
                <a className="c-regular-button -green" href="/?show_newsletter=true">Close</a>
            </div>
          </li>

          <!-- STEP ERROR -->
          <li className="step" data-step="error">
            <header className="m-newsletter-error">
              <h2 className="text -title-big -light">We're sorry, </br>but something went wrong</h2>
            </header>
          </li>
        </ul>
      </div>
    </div>


  );
};

export default AboutModalSubscribe;
