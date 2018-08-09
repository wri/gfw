import { connect } from 'react-redux';

import Component from './component';
import { getSelectorProps } from './selectors';

const mapStateToProps = (state, { options, selected, multi }) => ({
  ...(multi && {
    ...getSelectorProps({
      options,
      selected
    })
  })
});

export default connect(mapStateToProps, null)(Component);
