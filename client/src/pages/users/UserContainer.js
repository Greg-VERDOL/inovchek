import { compose, withState } from 'recompose';

import User from './UserView';

export default compose(
  withState('moreButtonRef', 'setMoreButtonRef', null),
  withState('isMoreMenuOpen', 'setMoreMenuOpen', false)
)(User);
