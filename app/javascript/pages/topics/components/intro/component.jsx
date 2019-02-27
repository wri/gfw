import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import tigerBg from 'pages/topics/assets/tiger.svg';

import './styles.scss';

class Intro extends PureComponent {
  render() {
    return (
      <div className="c-topics-intro">
        <div className="row titleBg">
          <div className="column small-12 medium-6" />
          <div className="column small-12 medium-6">
            <h1 className="intro-title">
              80% of terrestrial species live in forests.
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-6" />
          <div className="column small-12 medium-6">
            <p className="intro-text">
              We are currently undergoing the sixth great mass extinction of
              species. Human activity is driving extinction at a rate 1,000 to
              10,000 times beyond natural levels. Protecting forest habitats is
              key to protecting our planet’s remaining biodiversity.
            </p>
          </div>
        </div>
        <div className="tigerImg">
          <svg viewBox={tigerBg.viewBox || '0 0 32 32'}>
            <use xlinkHref={`#${tigerBg.id || tigerBg}`} />
          </svg>
        </div>
      </div>
    );
  }
}

// Intro.propTypes = {
// };

export default Intro;
