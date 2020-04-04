import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';

import './styles.scss';

export default class Footer extends PureComponent {
  static propTypes = {
    pageLink: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="c-footer-embed">
        <p>For more info</p>
        <Button className="embed-btn" extLink={this.props.pageLink}>
          EXPLORE ON GFW
        </Button>
      </div>
    );
  }
}
