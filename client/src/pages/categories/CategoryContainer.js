import { compose, withState } from 'recompose';

import category from './CategoryView';

export default compose(
  withState('moreButtonRef', 'setMoreButtonRef', null),
  withState('isMoreMenuOpen', 'setMoreMenuOpen', false)
)(category);
