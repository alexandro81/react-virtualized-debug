import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import { Component, PropTypes } from 'react';
import defaultHeaderRenderer from './defaultHeaderRenderer';
import defaultCellRenderer from './defaultCellRenderer';
import defaultCellDataGetter from './defaultCellDataGetter';

/**
 * Describes the header and cell contents of a table column.
 */

var Column = function (_Component) {
    _inherits(Column, _Component);

    function Column() {
        _classCallCheck(this, Column);

        return _possibleConstructorReturn(this, (Column.__proto__ || _Object$getPrototypeOf(Column)).apply(this, arguments));
    }

    return Column;
}(Component);

Column.defaultProps = {
    cellDataGetter: defaultCellDataGetter,
    cellRenderer: defaultCellRenderer,
    flexGrow: 0,
    flexShrink: 1,
    headerRenderer: defaultHeaderRenderer,
    style: {}
};
export default Column;
process.env.NODE_ENV !== "production" ? Column.propTypes = {
    /** Optional aria-label value to set on the column header */
    'aria-label': PropTypes.string,

    /**
     * Callback responsible for returning a cell's data, given its :dataKey
     * ({ columnData: any, dataKey: string, rowData: any }): any
     */
    cellDataGetter: PropTypes.func,

    /**
     * Callback responsible for rendering a cell's contents.
     * ({ cellData: any, columnData: any, dataKey: string, rowData: any, rowIndex: number }): node
     */
    cellRenderer: PropTypes.func,

    /** Optional CSS class to apply to cell */
    className: PropTypes.string,

    /** Optional additional data passed to this column's :cellDataGetter */
    columnData: PropTypes.object,

    /** Uniquely identifies the row-data attribute correspnding to this cell */
    dataKey: PropTypes.any.isRequired,

    /** If sort is enabled for the table at large, disable it for this column */
    disableSort: PropTypes.bool,

    /** Flex grow style; defaults to 0 */
    flexGrow: PropTypes.number,

    /** Flex shrink style; defaults to 1 */
    flexShrink: PropTypes.number,

    /** Optional CSS class to apply to this column's header */
    headerClassName: PropTypes.string,

    /**
     * Optional callback responsible for rendering a column header contents.
     * ({ columnData: object, dataKey: string, disableSort: boolean, label: string, sortBy: string, sortDirection: string }): PropTypes.node
     */
    headerRenderer: PropTypes.func.isRequired,

    /** Header label for this column */
    label: PropTypes.string,

    /** Maximum width of column; this property will only be used if :flexGrow is > 0. */
    maxWidth: PropTypes.number,

    /** Minimum width of column. */
    minWidth: PropTypes.number,

    /** Optional inline style to apply to cell */
    style: PropTypes.object,

    /** Flex basis (width) for this column; This value can grow or shrink based on :flexGrow and :flexShrink properties. */
    width: PropTypes.number.isRequired
} : void 0;