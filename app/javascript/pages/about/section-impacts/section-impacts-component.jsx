import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/slider';

import './section-impacts-styles.scss';

const cards = [
  {
    title: 'testy',
    image: 'test.png',
    outcome: 'test'
  },
  {
    title: 'testr',
    image: 'test.png',
    outcome: 'test'
  },
  {
    title: 'test',
    image: 'test.png',
    outcome: 'test'
  }
];

class SectionImpacts extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <section className="l-section-impacts">
        <h3>Impacts</h3>
        <Slider cards={cards} />
      </section>
    );
  }
}

// SectionImpacts.propTypes = {
//   cards: PropTypes.array.isRequired
// };

export default SectionImpacts;
