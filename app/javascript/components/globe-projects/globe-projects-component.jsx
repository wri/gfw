import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Globe from 'components/globe';

import './globe-projects-styles.scss';

class GlobeProjects extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      globeWidth: 0
    };
  }

  componentDidMount() {
    const globeSize = this.container.clientWidth;
    this.setGlobeSize(globeSize);
  }

  setGlobeSize(globeSize) {
    this.setState({ globeSize });
  }

  handleClick = d => {
    this.props.setModal({
      isOpen: true,
      data: d
    });
  };

  render() {
    const { globeSize } = this.state;
    const globe =
      globeSize > 0 ? (
        <div className="c-globe-projects" style={{ height: globeSize }}>
          <Globe
            width={globeSize}
            height={globeSize}
            autorotate={false}
            data={this.props.data}
            onClick={this.handleClick}
          />
        </div>
      ) : null;
    return (
      <div
        ref={node => {
          this.container = node;
        }}
      >
        {globe}
      </div>
    );
  }
}

GlobeProjects.propTypes = {
  data: PropTypes.array,
  setModal: PropTypes.func.isRequired
};

export default GlobeProjects;
