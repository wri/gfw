import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

import './section-apply-styles.scss';

class SectionAbout extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <section className="l-section">
          <div className="row">
            <div className="column small-12 medium-9">
              <p className="text -paragraph -color-2 -light -spaced">
                The Small Grants Fund Call for Applications opens once a year in
                February. Though the specific focus of the Call varies from year
                to year, successful applicants must clearly articulate how GFW
                will support and enhance their ongoing work related to:
              </p>
              <ul>
                <li className="text -paragraph -color-2 -light -spaced">
                  Forest management, monitoring and enforcement;
                </li>
                <li className="text -paragraph -color-2 -light -spaced">
                  Community empowerment
                </li>
                <li className="text -paragraph -color-2 -light -spaced">
                  Advocacy and policy change
                </li>
                <li className="text -paragraph -color-2 -light -spaced">
                  Journalism and storytelling; or
                </li>
                <li className="text -paragraph -color-2 -light -spaced">
                  A combination of these.
                </li>
              </ul>
              <br />
              <br />
              <p className="text -paragraph -color-2 -light -spaced">
                For more information about eligibility requirements and how to
                apply:
              </p>
              <ul>
                <li className="text -paragraph -color-2 -light -spaced">
                  Review the&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="http://www.globalforestwatch.org/howto/categories/faqs/?page=0&filters=%255b%2522small-grants-fund%2522%255d"
                  >
                    Small Grants Fund Frequently Asked Questions.
                  </a>
                </li>
                <li className="text -paragraph -color-2 -light -spaced">
                  Read the 2017&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://storage.googleapis.com/bcx_production_attachments/386fd3d4-c993-11e7-aa39-089e019fd298?GoogleAccessId=bcx-production%40bcx-production.iam.gserviceaccount.com&Expires=1510826892&Signature=yFQFuYv6RYQLaqCglmBHk1%2FcWcsZjX3AALvJTDghIwMOjmCknARmKgwJnlAQREs%2FbhK%2B8rmq2159RJCcnfUfLoGkR4mW5fakix9QphMzIqrNqp8rwIy6eHphRviv6cB84Xjau2kD7XRZ1tzJ%2FBJfNrhe9Zr2l0qnDFQDv4AmPpzsKAczo037XRvM%2BsBNenzcqZJ9uibufwV3S3QBr6rYdJriXmk7xgrY83SdrowjnnNaMJdnv88DRqJCF36iXojZv8C%2Br3AHcK7zPGvc6ak2WQ%2B%2F8KGwzyqR9IQGnV2WRs%2FAwnrcbcbYdodIppLM3SCd48yoV1rq%2FeYsCxO93iO3OA%3D%3D&response-content-type=application%2Fpdf&response-content-disposition=inline%3B+filename%3D%22Guidelines+for+Applicants+2017+final.pdf%22%3B+filename%2A%3DUTF-8%27%27Guidelines%2520for%2520Applicants%25202017%2520final.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Guidelines for Applicants
                  </a>
                </li>
                <li className="text -paragraph -color-2 -light -spaced">
                  Listen to the&nbsp;
                  <a
                    className="text -paragraph -color-4 -bold"
                    href="https://www.youtube.com/watch?v=RtcrS7dmhcI"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2016 webinar for prospective applicants.
                  </a>
                </li>
                <li className="text -paragraph -color-2 -light -spaced">
                  Listen to the&nbsp;
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
                Applicants will apply via an online form, which will be posted
                on this page when the call opens. For questions about the Small
                Grants Fund program, or to be notified when the 2018 call opens,
                please write to us at&nbsp;
                <a
                  className="text -paragraph -color-4 -bold"
                  href="mailto:gfwfund@wri.org"
                >
                  gfwfund@wri.org
                </a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

SectionAbout.propTypes = {};

export default SectionAbout;
