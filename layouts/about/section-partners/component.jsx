import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
          <div className="row">
            <div className="column small-12">
              <h3>Founding partners</h3>
            </div>
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
          </div>
        </div>
        <div className="logo-section">
          <div className="row">
            <div className="column small-12">
              <h3>Partners</h3>
            </div>
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
          </div>
        </div>
        <div className="logo-section">
          <div className="row">
            <div className="column small-12">
              <h3>Funders</h3>
            </div>
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
          </div>
        </div>
      </section>
    );
  }
}

export default SectionPartners;
