import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './project-card-styles.scss';

class ProjectCard extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { title, items } = this.props.data;
    return (
      <div className="m-card -big-padding">
        <h3 className="card-title">{title}</h3>
        {items &&
          !!items.length && (
            <ul className="card-description">
              {items.map(i => <li key={i.label}>{i.label}</li>)}
            </ul>
          )}
      </div>
    );
  }
}

ProjectCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
  }).isRequired
};

export default ProjectCard;
