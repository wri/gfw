import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import awards0 from 'pages/about/section-impacts/images/awards.png?webp';
import awards1 from 'pages/about/section-impacts/images/awards1.png?webp';
import awards2 from 'pages/about/section-impacts/images/awards2.png?webp';
import awards3 from 'pages/about/section-impacts/images/awards3.png?webp';

import Component from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';

const awards = [
  {
    img: awards0,
    link: 'http://events.esri.com/conference/sagList/',
    title: 'SAG list',
  },
  {
    img: awards1,
    link:
      'http://www.unglobalpulse.org/big-data-climate-challenge-winners-announced',
    title: 'Big data climate challenge',
  },
  {
    img: awards2,
    link: 'http://www.socialtech.org.uk/projects/global-forest-watch/',
    title: 'Social tech',
  },
  {
    img: awards3,
    link:
      'http://www.computerworld.com/article/2977562/data-analytics/world-resources-institute.html',
    title: 'WRI',
  },
];

const mapStateToProps = ({ impacts }) => ({
  data: impacts && impacts.data,
  awards,
});

reducerRegistry.registerModule('impacts', {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(Component);
