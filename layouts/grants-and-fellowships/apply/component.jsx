import { Row, Column } from 'gfw-components';

import sgfLogo from './assets/gfw-sgf-logo.png';
import techLogo from './assets/gfw-tech-fellowship-logo.png';

import './styles.scss';

const GrantsApplySection = () => (
  <section className="l-grants-apply-section">
    <Row>
      <Column width={[1, 3 / 4]} className="logo">
        <h2 className="section-title">Small Grants Fund</h2>
        <p className="text -paragraph -color-2 -light -spaced">
          The Global Forest Watch Small Grants Fund seeks to build the capacity
          of civil society organizations to effectively use GFW tools and data
          to reduce illegal or unplanned deforestation. Successful projects
          translate data into action, applying GFW to overcome challenges in
          protecting the world’s forests.
        </p>
        <p className="text -paragraph -color-2 -light -spaced">
          For information on the 2023 grant cycle, please click on the links
          below.
        </p>
        <ul className="list">
          <li>
            - Read the 2023&nbsp;
            <a
              className="text -paragraph -color-4 -bold"
              href="https://s3.amazonaws.com/gfw.blog/Training+Guides/SGF/Guidelines+for+SGF+Applicants+2023.pdf"
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
              href="https://www.globalforestwatch.org/help/faqs/grants-fellowships/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Small Grants Fund Frequently Asked Questions
            </a>
          </li>
          <li>
            - Watch a recording of the&nbsp;
            <a
              className="text -paragraph -color-4 -bold"
              href="https://www.youtube.com/watch?v=B6bk7Gl4644"
              target="_blank"
              rel="noopener noreferrer"
            >
              2023 Small Grants Fund Applicant Webinar
            </a>
          </li>
        </ul>
        <p className="text -paragraph -color-2 -light -spaced">
          Applications for the current grant cycle are now closed.
        </p>
      </Column>
      <Column width={[1, 1 / 4]} className="logo">
        <img src={sgfLogo} alt="Logo Global Forest Watch Small Grant Funds" />
      </Column>
    </Row>
    <Row>
      <Column width={[1, 3 / 4]} className="logo">
        <h2 className="section-title">Tech Fellowship</h2>
        <p className="text -paragraph -color-2 -light -spaced">
          We are not currently accepting applications for the GFW Tech
          Fellowship. For more information about the Tech Fellowship, see our
          {' '}
          <a
            className="text -paragraph -color-4 -bold"
            href="https://www.globalforestwatch.org/help/faqs/grants-fellowships/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Frequently Asked Questions
          </a>
          .
        </p>
      </Column>
      <Column width={[1, 1 / 4]} className="logo">
        <img src={techLogo} alt="Logo Global Forest Watch Tech fellowship" />
      </Column>
    </Row>
    <Row>
      <Column width={[1, 3 / 4]}>
        <p className="text -paragraph -color-2 -light -spaced">
          For questions about the Small Grants Fund or Tech Fellowship program,
          or to be notifed when the next call opens, please write to us at&nbsp;
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
      </Column>
    </Row>
  </section>
);

export default GrantsApplySection;
