import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

import './section-apply-styles.scss';

import sgfLogo from './img/GFW_SGF_logo.png';
import techLogo from './img/GFW_TECH_logo.png';

class SectionAbout extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <section className="l-section-apply">
        <div className="row">
          <div className="column small-12 medium-9">
            <p className="text -paragraph -color-2 -light -spaced">
              The Small Grants Fund and Fellowship Calls for Applications opens
              once a year. Though the specific focus of the Calls varies from
              year to year, successful applicants must clearly articulate how
              GFW will support and enhance their ongoing work related to:
            </p>
            <ul className="list">
              <li>- Advocacy</li>
              <li>- Community engagement</li>
              <li>- Education</li>
              <li>- Forest monitoring and enforcement</li>
              <li>- Journalism</li>
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
                <li>
                  - Review the&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://www.globalforestwatch.org/howto/categories/faqs/?filters=[%22small-grants-fund%22]&page=0"
                  >
                    Small Grants Fund Frequently Asked Questions.
                  </a>
                </li>
                <li>
                  - Read the 2019&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://storage.googleapis.com/bcx_production_attachments/386fd3d4-c993-11e7-aa39-089e019fd298?GoogleAccessId=bcx-production%40bcx-production.iam.gserviceaccount.com&Expires=1510826892&Signature=yFQFuYv6RYQLaqCglmBHk1%2FcWcsZjX3AALvJTDghIwMOjmCknARmKgwJnlAQREs%2FbhK%2B8rmq2159RJCcnfUfLoGkR4mW5fakix9QphMzIqrNqp8rwIy6eHphRviv6cB84Xjau2kD7XRZ1tzJ%2FBJfNrhe9Zr2l0qnDFQDv4AmPpzsKAczo037XRvM%2BsBNenzcqZJ9uibufwV3S3QBr6rYdJriXmk7xgrY83SdrowjnnNaMJdnv88DRqJCF36iXojZv8C%2Br3AHcK7zPGvc6ak2WQ%2B%2F8KGwzyqR9IQGnV2WRs%2FAwnrcbcbYdodIppLM3SCd48yoV1rq%2FeYsCxO93iO3OA%3D%3D&response-content-type=application%2Fpdf&response-content-disposition=inline%3B+filename%3D%22Guidelines+for+Applicants+2017+final.pdf%22%3B+filename%2A%3DUTF-8%27%27Guidelines%2520for%2520Applicants%25202017%2520final.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Guidelines for Applicants
                  </a>
                </li>
                <li>
                  - Listen to the&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://www.youtube.com/watch?v=uHt1FqaSPwQ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    webinar featuring past SGF project recipients.
                  </a>
                </li>
              </ul>
              <p className="text -paragraph -color-2 -light -spaced">
                The call for applications for the 2019 Small Grants Fund will
                open on February 1st, 2019 and will close on March 15th, 2019.
                Please check back here for details.
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
                    href="https://www.globalforestwatch.org/howto/categories/faqs/?filters=[%22tech-fellowship%22]&page=0"
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
                    href="https://storage.googleapis.com/bcx_production_attachments/386fd3d4-c993-11e7-aa39-089e019fd298?GoogleAccessId=bcx-production%40bcx-production.iam.gserviceaccount.com&Expires=1510826892&Signature=yFQFuYv6RYQLaqCglmBHk1%2FcWcsZjX3AALvJTDghIwMOjmCknARmKgwJnlAQREs%2FbhK%2B8rmq2159RJCcnfUfLoGkR4mW5fakix9QphMzIqrNqp8rwIy6eHphRviv6cB84Xjau2kD7XRZ1tzJ%2FBJfNrhe9Zr2l0qnDFQDv4AmPpzsKAczo037XRvM%2BsBNenzcqZJ9uibufwV3S3QBr6rYdJriXmk7xgrY83SdrowjnnNaMJdnv88DRqJCF36iXojZv8C%2Br3AHcK7zPGvc6ak2WQ%2B%2F8KGwzyqR9IQGnV2WRs%2FAwnrcbcbYdodIppLM3SCd48yoV1rq%2FeYsCxO93iO3OA%3D%3D&response-content-type=application%2Fpdf&response-content-disposition=inline%3B+filename%3D%22Guidelines+for+Applicants+2017+final.pdf%22%3B+filename%2A%3DUTF-8%27%27Guidelines%2520for%2520Applicants%25202017%2520final.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Guidelines for Applicants
                  </a>
                </li>
              </ul>
              <p className="text -paragraph -color-2 -light -spaced">
                The call for applications for the 2019 Tech Fellowship will open
                on February 15th, 2019. Applications will be reviewed on a
                rolling basis. Please check back here for details.
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
              </a>.
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default SectionAbout;
