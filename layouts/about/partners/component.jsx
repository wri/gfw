import { Row, Column } from 'gfw-components';

import { foundingPartners, partnersCollaborators, funders } from './partners';

// import './styles.scss';

const AboutPartnersSection = () => (
  <section className="l-section-partners">
    <div className="logo-section">
      <Row>
        <Column>
          <h3>Founding partners</h3>
        </Column>
        {foundingPartners.map((l) => (
          <Column
            className="logo-container"
            key={l.title}
            width={[1 / 2, 1 / 3, 1 / 4]}
          >
            <a href={l.link} target="_blank" rel="noopener noreferrer">
              <img alt={l.title} src={l.img} />
            </a>
          </Column>
        ))}
      </Row>
    </div>
    <div className="logo-section">
      <Row>
        <Column>
          <h3>Partners</h3>
        </Column>
        {partnersCollaborators.map((l) => (
          <Column
            className="logo-container"
            key={l.title}
            width={[1 / 2, 1 / 3, 1 / 4]}
          >
            <a href={l.link} target="_blank" rel="noopener noreferrer">
              <img alt={l.title} src={l.img} />
            </a>
          </Column>
        ))}
      </Row>
    </div>
    <div className="logo-section">
      <Row>
        <Column>
          <h3>Funders</h3>
        </Column>
        {funders.map((l) => (
          <Column
            className="logo-container"
            key={l.title}
            width={[1 / 2, 1 / 3, 1 / 4]}
          >
            <a href={l.link} target="_blank" rel="noopener noreferrer">
              <img alt={l.title} src={l.img} />
            </a>
          </Column>
        ))}
      </Row>
    </div>
  </section>
);

export default AboutPartnersSection;
