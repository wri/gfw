import { connect } from 'react-redux';
import * as actions from './section-projects-actions';
import reducers, { initialState } from './section-projects-reducers';
import Component from './section-projects-component';
import {
  getCategoriesList,
  getProjectsSelected,
  getCategorySelected
} from './section-projects-selectors';

const mapStateToProps = ({ projects }) => ({
  data: getProjectsSelected(projects),
  categories: getCategoriesList(projects),
  categorySelected: getCategorySelected(projects)
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
