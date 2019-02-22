import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

import './section-biodiversity-styles.scss';

class SectionBiodiversity extends PureComponent {
  render() {
    return (
      <div className="l-section-biodiversity">
        <section className="intro">
          <div className="row intro" />
        </section>
        <section className="program">
          <div className="row">
            <div className="column small-12 medium-9">
              <h3 className="section-subtitle">Program Benefits</h3>
            </div>
          </div>
        </section>
        <section className="program">
          <div className="row">
            <div className="column small-12 medium-9" />
          </div>
        </section>
        <section className="results">
          <div className="row">
            <div className="column small-12">
              <h2 className="section-subtitle">Results</h2>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

// SectionAbout.propTypes = {
// };

export default SectionBiodiversity;
