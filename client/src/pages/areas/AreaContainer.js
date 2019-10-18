import { compose, withState } from 'recompose';

import Area from './AreaView';

export default compose(
  withState('moreButtonRef', 'setMoreButtonRef', null),
  withState('isMoreMenuOpen', 'setMoreMenuOpen', false)
)(Area);
