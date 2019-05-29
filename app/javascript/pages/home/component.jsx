import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import arrowIcon from 'assets/icons/arrow-down.svg';

import HistorySection from 'pages/about/section-history';
import Impacts from 'pages/about/section-impacts';
import Partners from 'pages/about/section-partners';
import How from 'pages/about/section-how';
import Contact from 'pages/about/section-contact';

import bgImage from './home-bg.jpg';
import './styles.scss';

const sectionComponents = {
  history: HistorySection,
  impacts: Impacts,
  partners: Partners,
  how: How,
  contact: Contact
};

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { sections } = this.props;
    return (
      <div className="l-home-page">
        <Cover
          title="Forest Monitoring Designed for Action"
          description="Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests."
          bgImage={bgImage}
          large
        >
          <Button className="scroll-to-btn" theme="square">
            <Icon icon={arrowIcon} />
          </Button>
        </Cover>
      </div>
    );
  }
}

Page.propTypes = {
  sections: PropTypes.array.isRequired
};

export default Page;
