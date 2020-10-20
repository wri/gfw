import { Row, Column } from 'gfw-components';

import { foundingPartners, partnersCollaborators, funders } from './partners';

import './styles.scss';

const SectionPartners = () => (
  <section className="l-section-partners">
    <div className="logo-section">
      <Row>
        <Column>
          <h3>Founding partners</h3>
        </Column>
        {foundingPartners.map((l) => (
          <Column width={[1 / 2, 1 / 3, 1 / 4]}>
            <a
              key={l.title}
              href={l.link}
              target="_blank"
              rel="noopener noreferrer"
            >
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
          <Column width={[1 / 2, 1 / 3, 1 / 4]}>
            <a
              key={l.title}
              href={l.link}
              target="_blank"
              rel="noopener noreferrer"
            >
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
          <Column width={[1 / 2, 1 / 3, 1 / 4]}>
            <a
              key={l.title}
              href={l.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img alt={l.title} src={l.img} />
            </a>
          </Column>
        ))}
      </Row>
    </div>
  </section>
);

export default SectionPartners;
