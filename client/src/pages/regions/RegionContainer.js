import { compose, withState } from 'recompose';

import Region from './RegionView';

export default compose(
  withState('moreButtonRef', 'setMoreButtonRef', null),
  withState('isMoreMenuOpen', 'setMoreMenuOpen', false)
)(Region);
