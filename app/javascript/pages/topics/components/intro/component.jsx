import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import tigerBg from 'pages/topics/assets/tiger.svg';

class Intro extends PureComponent {
  render() {
    return (
      <div className="c-topics-intro">
        <span className="intro-img">
          {/* <svg viewBox={tigerBg.viewBox || '0 0 32 32'}>
            <use xlinkHref={`#${tigerBg.id || tigerBg}`} />
          </svg> */}
        </span>
        <span className="intro-text">
          <h1>80% of terrestrial species live in forests.</h1>
          <p>
            We are currently undergoing the sixth great mass extinction of
            species. Human activity is driving extinction at a rate 1,000 to
            10,000 times beyond natural levels. Protecting forest habitats is
            key to protecting our planet’s remaining biodiversity.
          </p>
        </span>
      </div>
    );
  }
}

// Intro.propTypes = {
// };

export default Intro;
