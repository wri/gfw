import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/card';

// import styles from './section-projects-styles.scss';

class SectionProjects extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data } = this.props;
    return (
      <div className="">
        <div className="l-section">
          <div className="row">
            <div className="column small-12">
              I will be your globe component
            </div>
          </div>
        </div>
        <div className="l-section">
          {data &&
            !!data.length && (
              <ul className="row card-list">
                {data.map(d => (
                  <li key={d.id} className="column small-6">
                    <Card data={d} />
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    );
  }
}

SectionProjects.propTypes = {
  data: PropTypes.array.isRequired
};

export default SectionProjects;
