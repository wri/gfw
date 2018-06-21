import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayersBlock from 'pages/map/menu/components/layers-block';

class ForestChange extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className="c-forest-change">
        {data &&
          data.map(block => {
            const { name, description, layers } = block;
            return (
              <LayersBlock
                key={`layers-block-${name}`}
                name={name}
                description={description}
                layers={layers}
              />
            );
          })}
      </div>
    );
  }
}

ForestChange.propTypes = {
  data: PropTypes.array
};

export default ForestChange;
