import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class DatasetSection extends PureComponent {
  render() {
    const { title, subTitle, children } = this.props;
    return (
      <div className="c-dataset-section">
        {(title || subTitle) && (
          <div className="header">
            {title && <div className="title">{title}</div>}
            {subTitle && <div className="subtitle">{subTitle}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }
}

DatasetSection.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  children: PropTypes.node
};

export default DatasetSection;
