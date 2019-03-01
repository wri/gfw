import React, { PureComponent } from 'react';
import tiger from 'pages/topics/assets/tiger.png';
import tiger2x from 'pages/topics/assets/tiger@2x.png';

import './styles.scss';

class Intro extends PureComponent {
  render() {
    return (
      <div className="c-topics-intro">
        <div className="row titleRow">
          <div className="column small-12 medium-6 titleCol">
            <div className="tiger-wrapper">
              <div className="tiger-img">
                <img
                  srcSet={`${tiger} 1x, ${tiger2x} 2x`}
                  src={tiger}
                  alt="sad tiger"
                />
              </div>
            </div>
          </div>
          <div className="column small-12 medium-6 titleCol">
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
      </div>
    );
  }
}

export default Intro;
