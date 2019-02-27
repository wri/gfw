import React, { PureComponent } from 'react';

import Footer from 'components/footer';
import Card from 'components/ui/card';
import Section from 'pages/topics/components/section';

class TopicsFooter extends PureComponent {
  render() {
    return (
      <Section className="fp-auto-height">
        <h2>COMMODITIES RELATED TOOLS</h2>
        {[0, 1, 2, 3].map(item => (
          <Card
            key={item}
            theme="theme-card-small"
            data={{
              title: item,
              summary: 'asfd'
            }}
          />
        ))}
        <Footer />
      </Section>
    );
  }
}

export default TopicsFooter;
