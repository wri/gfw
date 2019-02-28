import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

class Section extends PureComponent {
  addNav() {
    return (
      <div
        id="fp-nav"
        className="right"
        // style={{ height: '100%', position: 'absolute', right: 0 }}
      >
        <ul>
          {range(1, 5).map(i => {
            const active = Array.prototype.slice
              .call(document.querySelectorAll('.section'))
              .find(n => n.className.includes('active'));
            const index = Array.prototype.slice
              .call(document.querySelectorAll('.section'))
              .indexOf(active);
            return `<li>
              <a href=#${this.anchors ? this.anchors[i - 1] : ''} className=${
        i === index ? 'active' : ''
      }>
                <span class="fp-sr-only">
                </span>
                <span></span>
              </a>
            </li>`;
          })}
        </ul>
      </div>
    );

    // centering it vertically
    // css($(SECTION_NAV_SEL), {'margin-top': '-' + ($(SECTION_NAV_SEL)[0].offsetHeight/2) + 'px'});

    // activating the current active section
    // const bullet = document.querySelectorAll('li', (SECTION_NAV_SEL)[0])[index($(SECTION_ACTIVE_SEL)[0], SECTION_SEL)];
    // addClass($('a', bullet), 'active');
  }

  render() {
    const { children, className } = this.props;
    return <div className={`c-section section ${className}`}>{children}</div>;
  }
}

Section.propTypes = {
  // anchors: PropTypes.array,
  children: PropTypes.node,
  className: PropTypes.string
};

export default Section;
