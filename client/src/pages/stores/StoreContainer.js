import { compose, withState } from 'recompose';

import Store from './StoreView';

export default compose(
  withState('moreButtonRef', 'setMoreButtonRef', null),
  withState('isMoreMenuOpen', 'setMoreMenuOpen', false)
)(Store);
