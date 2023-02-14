import React, { PureComponent } from 'react';
import { apiRequest } from 'utils/request';

class ThisIsAnError extends PureComponent {
  state = {
    data: [],
  };

  componentDidMount = () => {
    apiRequest.get('/v2/geostore/admin/IDN/?thresh=0.05').then((response) => {
      this.setState({ data: response.data.data.id });
    });
  };

  render() {
    return (
      <div>
        <span>This will be an error:</span>
        <span>{this.state.data.map((d) => d)}</span>
      </div>
    );
  }
}

export default ThisIsAnError;
