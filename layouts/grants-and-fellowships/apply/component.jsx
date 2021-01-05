import { Row, Column } from 'gfw-components';

import sgfLogo from './assets/gfw-sgf-logo.png';
import techLogo from './assets/gfw-tech-fellowship-logo.png';

import './styles.scss';

const GrantsApplySection = () => (
    <section className="apply-section">
      <Row>
        <Column width={[1, 3 / 4]} className="logo">
          <h2 className="section-title">Small Grants Fund</h2>
          <ul className="list">
            <p className="text -paragraph -color-2 -light -spaced">
              The scope of this year’s Small Grants Fund focuses on three key themes: forest protection, forests and agriculture, and forest policy. The specific objectives for each theme, along with more details on the application process, can be found in the Guidelines for Applicants. Before applying, please carefully review these guidelines along with the Small Grants Fund FAQ.  
Winning proposals will clearly demonstrate how they intend to use GFW’s suite of tools and data on GFW to curb deforestation within one of these three key themes. 
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
        </Column>
        <Column width={[1, 1 / 4]} className="logo">
          <img src={sgfLogo} alt="Logo Global Forest Watch Small Grant Funds" />
        </Column>
      </Row>
    </section>
    <section className="apply-section">
      <Row>
        <Column width={[1, 3 / 4]} className="logo">
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
            Applications for the GFW Tech Fellowship are currently closed.
          </p>
        </Column>
        <Column width={[1, 1 / 4]} className="logo">
          <img src={techLogo} alt="Logo Global Forest Watch Tech fellowship" />
        </Column>
      </Row>
    </section>
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
