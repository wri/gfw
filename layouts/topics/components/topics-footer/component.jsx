import PropTypes from 'prop-types';

import { Row, Column, Desktop, Mobile } from '@worldresources/gfw-components';

import Footer from 'components/footer';

import TopicsCards from './cards';

const TopicsFooter = ({ cards, topic }) => (
  <div className="c-topics-footer">
    <Row>
      <Column>
        <h3 className="footer-title">{`${topic} RELATED TOOLS`}</h3>
      </Column>
    </Row>
    <Row className="row-cards">
      <Column>
        <Desktop>
          <TopicsCards cards={cards} topic={topic} />
        </Desktop>
        <Mobile>
          <TopicsCards
            cards={cards}
            topic={topic}
            settings={{ slidesToShow: 1 }}
          />
        </Mobile>
      </Column>
    </Row>
    <Footer />
  </div>
);

TopicsFooter.propTypes = {
  cards: PropTypes.array,
  topic: PropTypes.string,
};

export default TopicsFooter;
