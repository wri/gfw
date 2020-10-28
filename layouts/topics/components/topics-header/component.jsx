import PropTypes from 'prop-types';

import { Button, Row, Column } from 'gfw-components';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import Icon from 'components/ui/icon';

import bgImage from 'layouts/topics/assets/bg-leaf.jpeg';
import arrowIcon from 'assets/icons/arrow-down.svg?sprite';

import Intro from './topics-intro';

import './styles.scss';

const TopicsHeader = ({
  topics,
  intro,
  fullpageApi,
  title,
  handleSkipToTools,
}) => (
  <div className="c-topics-header">
    <div className="intro-top">
      <Cover
        title="Topics"
        description="Explore the relationship between forests and several key themes critical to sustainability and the health of our
        future ecosystems."
        bgImage={bgImage}
      />
      <SubnavMenu links={topics} theme="theme-subnav-dark" />
      <Intro
        className={title}
        intro={intro}
        handleSkipToTools={handleSkipToTools}
      />
    </div>
    <div className="intro-bottom">
      <Row>
        <Column>
          <div className="scroll-to-discover">
            <Button
              round
              className="scroll-btn"
              onClick={() => {
                fullpageApi.moveSectionDown();
              }}
            >
              <Icon icon={arrowIcon} />
            </Button>
            <p>Scroll to discover</p>
          </div>
        </Column>
      </Row>
    </div>
  </div>
);

TopicsHeader.propTypes = {
  topics: PropTypes.array,
  intro: PropTypes.object,
  fullpageApi: PropTypes.object,
  title: PropTypes.string,
  handleSkipToTools: PropTypes.func,
};

export default TopicsHeader;
