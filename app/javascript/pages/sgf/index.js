import React, { PureComponent } from 'react';
import Header from 'components/header/header';
import Content from './content';

class SGF extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Header key="header" />
        <Content key="content" />
      </div>
    );
  }
}

export default SGF;
