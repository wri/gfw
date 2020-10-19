import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Row, Column } from 'gfw-components';

import './styles.scss';

class SectionPartners extends PureComponent {
  static propTypes = {
    foundingPartners: PropTypes.array,
    partnersCollaborators: PropTypes.array,
    funders: PropTypes.array,
  };

  render() {
    const { foundingPartners, partnersCollaborators, funders } = this.props;
    return (
      <section className="l-section-partners">
        <div className="logo-section">
          <Row>
            <Column>
              <h3>Founding partners</h3>
            </Column>
            {foundingPartners.map((l) => (
              <a
                key={l.title}
                className="columns small-6 medium-4 large-3"
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img alt={l.title} src={l.img} />
              </a>
            ))}
          </Row>
        </div>
        <div className="logo-section">
          <Row>
            <Column>
              <h3>Partners</h3>
            </Column>
            {partnersCollaborators.map((l) => (
              <a
                key={l.title}
                className="columns small-6 medium-4 large-3"
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img alt={l.title} src={l.img} />
              </a>
            ))}
          </Row>
        </div>
        <div className="logo-section">
          <Row>
            <Column>
              <h3>Funders</h3>
            </Column>
            {funders.map((l) => (
              <a
                key={l.title}
                className="columns small-6 medium-4 large-3"
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img alt={l.title} src={l.img} />
              </a>
            ))}
          </Row>
        </div>
      </section>
    );
  }
}

export default SectionPartners;
