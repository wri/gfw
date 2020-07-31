import React, { PureComponent } from 'react';

import './styles.scss';

import sgfLogo from './img/GFW_SGF_logo.png?webp';
import techLogo from './img/GFW_TECH_logo.png?webp';

class SectionAbout extends PureComponent {
  render() {
    return (
      <section className="l-section-apply">
        <div className="row">
          <div className="column small-12 medium-9">
            <p className="text -paragraph -color-2 -light -spaced">
              The specific focus of the Calls for Applications varies from year
              to year, though successful applicants must clearly articulate how
              GFW will support and enhance their ongoing work related to:
            </p>
            <ul className="list">
              <li>- Advocacy</li>
              <li>- Community engagement</li>
              <li>- Forest monitoring and enforcement</li>
              <li>- Journalism</li>
              <li>- Education</li>
            </ul>
            <p className="text -paragraph -color-2 -light -spaced">
              For details on how to apply to each, please see below:
            </p>
          </div>
        </div>
        <section className="apply-section">
          <div className="row">
            <div className="column small-12 medium-9 logo">
              <h2 className="section-title">Small Grants Fund</h2>
              <ul className="list">
                <p className="text -paragraph -color-2 -light -spaced">
                  The scope of this year’s Small Grants Fund is on using near
                  real-time data to combat deforestation. Winning proposals will
                  clearly demonstrate how they intend to use GLAD deforestation
                  and/or VIIRs fire alerts, made available through GFW tools, to
                  curb deforestation through enforcement or advocacy. Please
                  note that this year’s call also has geographic restrictions.
                  Applicants should carefully read through the Guidelines for
                  Applicants and Frequently Asked Questions for more details.
                </p>
                <li>
                  - Read the 2020&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="http://s3.amazonaws.com/gfw.blog/Training%20Guides/SGF/Guidelines%20for%20SGF%20Applicants%202020%20%281%29.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Guidelines for Applicants
                  </a>
                </li>
                <li>
                  - Review the&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://www.globalforestwatch.org/howto/categories/faqs/?page=0&filters=[%22small-grants-fund%22]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Small Grants Fund Frequently Asked Questions
                  </a>
                </li>
                <li>
                  - Listen to the&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://youtu.be/hHar_nUYi9k"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2020 Small Grants Fund Webinar
                  </a>
                </li>
              </ul>
              <p className="text -paragraph -color-2 -light -spaced">
                The 2020 Small Grants Fund application window is now closed.
              </p>
            </div>
            <div className="column small-12 medium-3 logo">
              <img
                src={sgfLogo}
                alt="Logo Global Forest Watch Small Grant Funds"
              />
            </div>
          </div>
        </section>
        <section className="apply-section">
          <div className="row">
            <div className="column small-12 medium-9 logo">
              <h2 className="section-title">Tech Fellowship</h2>
              <ul className="list">
                <li>
                  - Review the&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://www.globalforestwatch.org/howto/categories/faqs/?page=0&filters=[%22tech-fellowship%22]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tech Fellowship Frequently Asked Questions.
                  </a>
                </li>
                <li>
                  - Read the 2019&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://blog.globalforestwatch.org/wp-content/uploads/2019/01/2019-Fellowship-Guidelines-for-Applicants.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Guidelines for Applicants
                  </a>
                </li>
              </ul>
              <p className="text -paragraph -color-2 -light -spaced">
                The 2019 Tech Fellowship application window is now closed.
              </p>
            </div>
            <div className="column small-12 medium-3 logo">
              <img
                src={techLogo}
                alt="Logo Global Forest Watch Tech fellowship"
              />
            </div>
          </div>
        </section>
        <div className="row">
          <div className="column small-12 medium-9">
            <p className="text -paragraph -color-2 -light -spaced">
              For questions about the Small Grants Fund or Tech Fellowship
              program, or to be notifed when the next call opens, please write
              to us at&nbsp;
              <a
                className="text -paragraph -color-4 -bold"
                href="mailto:gfwfund@wri.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                gfwfund@wri.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default SectionAbout;
