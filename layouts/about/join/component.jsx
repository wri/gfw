import { Row, Column, Button } from '@worldresources/gfw-components';

const AboutJoinSection = () => (
  <section className="l-section-join">
    <Row>
      <Column className="content">
        <h4>
          <i>We welcome others to join the growing GNW partnership.</i>
        </h4>
        <a
          href="https://globalnaturewatch.zendesk.com/hc/en-us/requests/new"
          target="_blank"
          rel="noreferrer"
        >
          <Button light className="anchor">
            EMAIL US
          </Button>
        </a>
      </Column>
    </Row>
  </section>
);

export default AboutJoinSection;
