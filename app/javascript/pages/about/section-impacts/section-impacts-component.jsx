import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'components/slider';

import './section-impacts-styles.scss';

class SectionImpacts extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data } = this.props;
    return (
      <section className="l-section-impacts">
        <div className="row">
          <div className="column small-12">
            <h3>Impacts</h3>
          </div>
        </div>
        <Slider cards={data} />
      </section>
    );
  }
}

SectionImpacts.propTypes = {
  data: PropTypes.array.isRequired
};

export default SectionImpacts;
