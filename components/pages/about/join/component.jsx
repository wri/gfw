import { Link as AnchorLink } from 'react-scroll';

import { Row, Column, Button } from 'gfw-components';

import './styles.scss';

const AboutJoinSection = () => (
  <section className="l-section-join">
    <Row>
      <Column className="content">
        <h4>
          <i>We welcome others to join the growing GFW partnership.</i>
        </h4>
        <AnchorLink to="contact" spy smooth duration={500}>
          <Button light className="anchor">
            EMAIL US
          </Button>
        </AnchorLink>
      </Column>
    </Row>
  </section>
);

export default AboutJoinSection;
