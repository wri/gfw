import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { routes } from 'router';
import PageComponent from './page-component';

const links = Object.values(routes)
  .filter(r => r.submenu)
  .map(r => ({ label: r.label, path: r.path }));

const mapStateToProps = ({ location }) => ({ section: location.type });

class PageContainer extends PureComponent {
  render() {
    const { section } = this.props;
    const sectionComponent = routes[section] ? routes[section].component : null;
    return createElement(PageComponent, {
      section: sectionComponent,
      links
    });
  }
}

PageContainer.propTypes = {
  section: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(PageContainer);
