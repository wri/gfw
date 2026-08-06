import { Row, Column } from '@worldresources/gfw-components';

const AboutContactSection = () => (
  <div className="l-section-contact">
    <Row>
      <Column width={[1, 3 / 4]} className="desc">
        <h3>Contact us</h3>
        <p className="intro">
          Question, comment, request, feedback? We want to hear from you! Get in
          touch by completing the form at&nbsp;
          <a
            href="https://globalnaturewatch.zendesk.com/hc/en-us/requests/new"
            target="_blank"
            rel="noreferrer"
          >
            https://globalnaturewatch.zendesk.com/hc/en-us/requests/new
          </a>
        </p>
        <p>Global Nature Watch, 10 G Street NE Suite 800</p>
        <p>Washington, DC 20002, USA</p>
        <a
          href="https://www.wri.org/project-experts/37654?page=1"
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
      </Column>
    </Row>
  </div>
);

export default AboutContactSection;
