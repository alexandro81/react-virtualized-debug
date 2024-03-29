import React, { PropTypes } from 'react';
import cn from 'classnames';
import SortDirection from './SortDirection';

/**
 * Displayed beside a header to indicate that a Table is currently sorted by this column.
 */
export default function SortIndicator(_ref) {
  var sortDirection = _ref.sortDirection;

  var classNames = cn('ReactVirtualized__Table__sortableHeaderIcon', {
    'ReactVirtualized__Table__sortableHeaderIcon--ASC': sortDirection === SortDirection.ASC,
    'ReactVirtualized__Table__sortableHeaderIcon--DESC': sortDirection === SortDirection.DESC
  });

  return React.createElement(
    'svg',
    {
      className: classNames,
      width: 18,
      height: 18,
      viewBox: '0 0 24 24'
    },
    sortDirection === SortDirection.ASC ? React.createElement('path', { d: 'M7 14l5-5 5 5z' }) : React.createElement('path', { d: 'M7 10l5 5 5-5z' }),
    React.createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' })
  );
}

process.env.NODE_ENV !== "production" ? SortIndicator.propTypes = {
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC])
} : void 0;