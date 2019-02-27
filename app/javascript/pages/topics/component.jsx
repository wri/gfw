import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

// import Projects from 'pages/sgf/section-projects';
// import About from 'pages/sgf/section-about';
// import Apply from 'pages/sgf/section-apply';
// import Fullpage from 'fullpage.js';

import Header from 'components/header';
import TopicsHeader from 'pages/topics/components/topics-header';
import TopicsFooter from 'pages/topics/components/topics-footer';

import Section from 'pages/topics/components/section';
import Biodiversity from 'pages/topics/content/biodiversity.json';

import Text from 'pages/topics/components/topics-text';
import Image from 'pages/topics/components/topics-image';
import Button from 'components/ui/button';

import './styles.scss';
// const sectionComponents = {
//   projects: Projects,
//   about: About,
//   apply: Apply
// };

class TopicsPage extends PureComponent {
  componentDidMount() {
    /* global $ */
    $(document).ready(() => {
      $('#fullpage').fullpage();
    });
  }

  // componentWillUnmount() {
  //   $.document.ready(() => {
  //     $('#fullpage').destroy('all');
  //   });
  // }

  render() {
    // const { section } = this.props;
    // const SectionComponent = sectionComponents[(section && section.component) || 'projects'];

    const topics = [
      {
        label: 'Biodiversity',
        path: '/topics/biodiversity',
        active: true,
        component: Biodiversity
      },
      { label: 'Commodities', path: '/topics/commodities' },
      { label: 'Water', path: '/topics/water' },
      { label: 'Climate', path: '/topics/climate' }
    ];

    const activeTopic = topics.find(t => t.active);
    const topic = activeTopic ? activeTopic.component : Biodiversity;

    return (
      <div className="c-topics-page">
        <Header />
        <div id="fullpage">
          <TopicsHeader topics={topics} />
          {topic.map(s => (
            <Section key={s.subtitle}>
              <Text text={s.text} title={s.title} subtitle={s.subtitle} />
              <Image url={s.src} description={s.subtitle} />
              <Button theme="theme-button-grey topics-btn">Skip</Button>
            </Section>
          ))}
          <TopicsFooter />
        </div>
      </div>
    );
  }
}

// TopicsPage.propTypes = {
//    section: PropTypes.object.isRequired,
//    links: PropTypes.array.isRequired
// };

export default TopicsPage;
