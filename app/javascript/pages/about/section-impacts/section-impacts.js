import { connect } from 'react-redux';

import Component from './section-impacts-component';
import actions from './section-impacts-actions';
import reducers, { initialState } from './section-impacts-reducers';

const awards = [
  {
    img: '/assets/backgrounds/awards.png',
    link: 'http://events.esri.com/conference/sagList/',
    title: 'SAG list'
  },
  {
    img: '/assets/backgrounds/awards2.png',
    link:
      'http://www.unglobalpulse.org/big-data-climate-challenge-winners-announced',
    title: 'Big data climate challenge'
  },
  {
    img: '/assets/backgrounds/awards3.png',
    link: 'http://www.socialtech.org.uk/projects/global-forest-watch/',
    title: 'Social tech'
  },
  {
    img: '/assets/backgrounds/awards1.png',
    link:
      'http://www.computerworld.com/article/2977562/data-analytics/world-resources-institute.html',
    title: 'WRI'
  }
];

const mapStateToProps = ({ impacts }) => ({
  data: impacts.data,
  awards
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
