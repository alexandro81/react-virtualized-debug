'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Column = require('./Column');

var _Column2 = _interopRequireDefault(_Column);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Grid = require('../Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _defaultRowRenderer = require('./defaultRowRenderer');

var _defaultRowRenderer2 = _interopRequireDefault(_defaultRowRenderer);

var _SortDirection = require('./SortDirection');

var _SortDirection2 = _interopRequireDefault(_SortDirection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */
var Table = function (_PureComponent) {
  _inherits(Table, _PureComponent);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _this.state = {
      scrollbarWidth: 0
    };

    _this._createColumn = _this._createColumn.bind(_this);
    _this._createRow = _this._createRow.bind(_this);
    _this._onScroll = _this._onScroll.bind(_this);
    _this._onSectionRendered = _this._onSectionRendered.bind(_this);
    _this._setRef = _this._setRef.bind(_this);
    return _this;
  }

  _createClass(Table, [{
    key: 'forceUpdateGrid',
    value: function forceUpdateGrid() {
      this.Grid.forceUpdate();
    }

    /** See Grid#measureAllCells */

  }, {
    key: 'measureAllRows',
    value: function measureAllRows() {
      this.Grid.measureAllCells();
    }

    /** See Grid#recomputeGridSize */

  }, {
    key: 'recomputeRowHeights',
    value: function recomputeRowHeights() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.Grid.recomputeGridSize({
        rowIndex: index
      });
    }

    /** See Grid#scrollToCell */

  }, {
    key: 'scrollToRow',
    value: function scrollToRow() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.Grid.scrollToCell({
        columnIndex: 0,
        rowIndex: index
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._setScrollbarWidth();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._setScrollbarWidth();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          disableHeader = _props.disableHeader,
          gridClassName = _props.gridClassName,
          gridStyle = _props.gridStyle,
          headerHeight = _props.headerHeight,
          height = _props.height,
          id = _props.id,
          noRowsRenderer = _props.noRowsRenderer,
          rowClassName = _props.rowClassName,
          rowStyle = _props.rowStyle,
          scrollToIndex = _props.scrollToIndex,
          style = _props.style,
          width = _props.width;
      var scrollbarWidth = this.state.scrollbarWidth;


      var availableRowsHeight = disableHeader ? height : height - headerHeight;

      var rowClass = rowClassName instanceof Function ? rowClassName({ index: -1 }) : rowClassName;
      var rowStyleObject = rowStyle instanceof Function ? rowStyle({ index: -1 }) : rowStyle;

      // Precompute and cache column styles before rendering rows and columns to speed things up
      this._cachedColumnStyles = [];
      _react2.default.Children.toArray(children).forEach(function (column, index) {
        var flexStyles = _this2._getFlexStyleForColumn(column, column.props.style);

        _this2._cachedColumnStyles[index] = _extends({}, flexStyles, {
          overflow: 'hidden'
        });
      });

      // Note that we specify :rowCount, :scrollbarWidth, :sortBy, and :sortDirection as properties on Grid even though these have nothing to do with Grid.
      // This is done because Grid is a pure component and won't update unless its properties or state has changed.
      // Any property that should trigger a re-render of Grid then is specified here to avoid a stale display.
      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('ReactVirtualized__Table', className),
          id: id,
          style: style
        },
        !disableHeader && _react2.default.createElement(
          'div',
          {
            className: (0, _classnames2.default)('ReactVirtualized__Table__headerRow', rowClass),
            style: _extends({}, rowStyleObject, {
              height: headerHeight,
              overflow: 'hidden',
              paddingRight: scrollbarWidth,
              width: width
            })
          },
          this._getRenderedHeaderRow()
        ),
        _react2.default.createElement(_Grid2.default, _extends({}, this.props, {
          autoContainerWidth: true,
          className: (0, _classnames2.default)('ReactVirtualized__Table__Grid', gridClassName),
          cellRenderer: this._createRow,
          columnWidth: width,
          columnCount: 1,
          height: availableRowsHeight,
          id: undefined,
          noContentRenderer: noRowsRenderer,
          onScroll: this._onScroll,
          onSectionRendered: this._onSectionRendered,
          ref: this._setRef,
          scrollbarWidth: scrollbarWidth,
          scrollToRow: scrollToIndex,
          style: _extends({}, gridStyle, {
            overflowX: 'hidden'
          })
        }))
      );
    }
  }, {
    key: '_createColumn',
    value: function _createColumn(_ref) {
      var column = _ref.column,
          columnIndex = _ref.columnIndex,
          isScrolling = _ref.isScrolling,
          parent = _ref.parent,
          rowData = _ref.rowData,
          rowIndex = _ref.rowIndex;
      var _column$props = column.props,
          cellDataGetter = _column$props.cellDataGetter,
          cellRenderer = _column$props.cellRenderer,
          className = _column$props.className,
          columnData = _column$props.columnData,
          dataKey = _column$props.dataKey;


      var cellData = cellDataGetter({ columnData: columnData, dataKey: dataKey, rowData: rowData });
      var renderedCell = cellRenderer({ cellData: cellData, columnData: columnData, dataKey: dataKey, isScrolling: isScrolling, parent: parent, rowData: rowData, rowIndex: rowIndex });

      var style = this._cachedColumnStyles[columnIndex];

      var title = typeof renderedCell === 'string' ? renderedCell : null;

      return _react2.default.createElement(
        'div',
        {
          key: 'Row' + rowIndex + '-Col' + columnIndex,
          className: (0, _classnames2.default)('ReactVirtualized__Table__rowColumn', className),
          style: style,
          title: title
        },
        renderedCell
      );
    }
  }, {
    key: '_createHeader',
    value: function _createHeader(_ref2) {
      var column = _ref2.column,
          index = _ref2.index;
      var _props2 = this.props,
          headerClassName = _props2.headerClassName,
          headerStyle = _props2.headerStyle,
          onHeaderClick = _props2.onHeaderClick,
          sort = _props2.sort,
          sortBy = _props2.sortBy,
          sortDirection = _props2.sortDirection;
      var _column$props2 = column.props,
          dataKey = _column$props2.dataKey,
          disableSort = _column$props2.disableSort,
          headerRenderer = _column$props2.headerRenderer,
          label = _column$props2.label,
          columnData = _column$props2.columnData;

      var sortEnabled = !disableSort && sort;

      var classNames = (0, _classnames2.default)('ReactVirtualized__Table__headerColumn', headerClassName, column.props.headerClassName, {
        'ReactVirtualized__Table__sortableHeaderColumn': sortEnabled
      });
      var style = this._getFlexStyleForColumn(column, headerStyle);

      var renderedHeader = headerRenderer({
        columnData: columnData,
        dataKey: dataKey,
        disableSort: disableSort,
        label: label,
        sortBy: sortBy,
        sortDirection: sortDirection
      });

      var a11yProps = {};

      if (sortEnabled || onHeaderClick) {
        // If this is a sortable header, clicking it should update the table data's sorting.
        var newSortDirection = sortBy !== dataKey || sortDirection === _SortDirection2.default.DESC ? _SortDirection2.default.ASC : _SortDirection2.default.DESC;

        var onClick = function onClick() {
          sortEnabled && sort({
            sortBy: dataKey,
            sortDirection: newSortDirection
          });
          onHeaderClick && onHeaderClick({ columnData: columnData, dataKey: dataKey });
        };

        var onKeyDown = function onKeyDown(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            onClick();
          }
        };

        a11yProps['aria-label'] = column.props['aria-label'] || label || dataKey;
        a11yProps.role = 'rowheader';
        a11yProps.tabIndex = 0;
        a11yProps.onClick = onClick;
        a11yProps.onKeyDown = onKeyDown;
      }

      return _react2.default.createElement(
        'div',
        _extends({}, a11yProps, {
          key: 'Header-Col' + index,
          className: classNames,
          style: style
        }),
        renderedHeader
      );
    }
  }, {
    key: '_createRow',
    value: function _createRow(_ref3) {
      var _this3 = this;

      var index = _ref3.rowIndex,
          isScrolling = _ref3.isScrolling,
          key = _ref3.key,
          parent = _ref3.parent,
          style = _ref3.style;
      var _props3 = this.props,
          children = _props3.children,
          onRowClick = _props3.onRowClick,
          onRowDoubleClick = _props3.onRowDoubleClick,
          onRowMouseOver = _props3.onRowMouseOver,
          onRowMouseOut = _props3.onRowMouseOut,
          rowClassName = _props3.rowClassName,
          rowGetter = _props3.rowGetter,
          rowRenderer = _props3.rowRenderer,
          rowStyle = _props3.rowStyle;
      var scrollbarWidth = this.state.scrollbarWidth;


      var rowClass = rowClassName instanceof Function ? rowClassName({ index: index }) : rowClassName;
      var rowStyleObject = rowStyle instanceof Function ? rowStyle({ index: index }) : rowStyle;
      var rowData = rowGetter({ index: index });

      var columns = _react2.default.Children.toArray(children).map(function (column, columnIndex) {
        return _this3._createColumn({
          column: column,
          columnIndex: columnIndex,
          isScrolling: isScrolling,
          parent: parent,
          rowData: rowData,
          rowIndex: index,
          scrollbarWidth: scrollbarWidth
        });
      });

      var className = (0, _classnames2.default)('ReactVirtualized__Table__row', rowClass);
      var flattenedStyle = _extends({}, style, rowStyleObject, {
        height: this._getRowHeight(index),
        overflow: 'hidden',
        paddingRight: scrollbarWidth
      });

      return rowRenderer({
        className: className,
        columns: columns,
        index: index,
        isScrolling: isScrolling,
        key: key,
        onRowClick: onRowClick,
        onRowDoubleClick: onRowDoubleClick,
        onRowMouseOver: onRowMouseOver,
        onRowMouseOut: onRowMouseOut,
        rowData: rowData,
        style: flattenedStyle
      });
    }

    /**
     * Determines the flex-shrink, flex-grow, and width values for a cell (header or column).
     */

  }, {
    key: '_getFlexStyleForColumn',
    value: function _getFlexStyleForColumn(column) {
      var customStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var flexValue = column.props.flexGrow + ' ' + column.props.flexShrink + ' ' + column.props.width + 'px';

      var style = _extends({}, customStyle, {
        flex: flexValue,
        msFlex: flexValue,
        WebkitFlex: flexValue
      });

      if (column.props.maxWidth) {
        style.maxWidth = column.props.maxWidth;
      }

      if (column.props.minWidth) {
        style.minWidth = column.props.minWidth;
      }

      return style;
    }
  }, {
    key: '_getRenderedHeaderRow',
    value: function _getRenderedHeaderRow() {
      var _this4 = this;

      var _props4 = this.props,
          children = _props4.children,
          disableHeader = _props4.disableHeader;

      var items = disableHeader ? [] : _react2.default.Children.toArray(children);

      return items.map(function (column, index) {
        return _this4._createHeader({ column: column, index: index });
      });
    }
  }, {
    key: '_getRowHeight',
    value: function _getRowHeight(rowIndex) {
      var rowHeight = this.props.rowHeight;


      return rowHeight instanceof Function ? rowHeight({ index: rowIndex }) : rowHeight;
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(_ref4) {
      var clientHeight = _ref4.clientHeight,
          scrollHeight = _ref4.scrollHeight,
          scrollTop = _ref4.scrollTop;
      var onScroll = this.props.onScroll;


      onScroll({ clientHeight: clientHeight, scrollHeight: scrollHeight, scrollTop: scrollTop });
    }
  }, {
    key: '_onSectionRendered',
    value: function _onSectionRendered(_ref5) {
      var rowOverscanStartIndex = _ref5.rowOverscanStartIndex,
          rowOverscanStopIndex = _ref5.rowOverscanStopIndex,
          rowStartIndex = _ref5.rowStartIndex,
          rowStopIndex = _ref5.rowStopIndex;
      var onRowsRendered = this.props.onRowsRendered;


      onRowsRendered({
        overscanStartIndex: rowOverscanStartIndex,
        overscanStopIndex: rowOverscanStopIndex,
        startIndex: rowStartIndex,
        stopIndex: rowStopIndex
      });
    }
  }, {
    key: '_setRef',
    value: function _setRef(ref) {
      this.Grid = ref;
    }
  }, {
    key: '_setScrollbarWidth',
    value: function _setScrollbarWidth() {
      var Grid = (0, _reactDom.findDOMNode)(this.Grid);
      var clientWidth = Grid.clientWidth || 0;
      var offsetWidth = Grid.offsetWidth || 0;
      var scrollbarWidth = offsetWidth - clientWidth;

      this.setState({ scrollbarWidth: scrollbarWidth });
    }
  }]);

  return Table;
}(_react.PureComponent);

Table.defaultProps = {
  disableHeader: false,
  estimatedRowSize: 30,
  headerHeight: 0,
  headerStyle: {},
  noRowsRenderer: function noRowsRenderer() {
    return null;
  },
  onRowsRendered: function onRowsRendered() {
    return null;
  },
  onScroll: function onScroll() {
    return null;
  },
  overscanRowCount: 10,
  rowRenderer: _defaultRowRenderer2.default,
  rowStyle: {},
  scrollToAlignment: 'auto',
  style: {}
};
exports.default = Table;
process.env.NODE_ENV !== "production" ? Table.propTypes = {
  'aria-label': _react.PropTypes.string,

  /**
   * Removes fixed height from the scrollingContainer so that the total height
   * of rows can stretch the window. Intended for use with WindowScroller
   */
  autoHeight: _react.PropTypes.bool,

  /** One or more Columns describing the data displayed in this row */
  children: function children(props, propName, componentName) {
    var children = _react2.default.Children.toArray(props.children);
    for (var i = 0; i < children.length; i++) {
      if (children[i].type !== _Column2.default) {
        return new Error('Table only accepts children of type Column');
      }
    }
  },

  /** Optional CSS class name */
  className: _react.PropTypes.string,

  /** Disable rendering the header at all */
  disableHeader: _react.PropTypes.bool,

  /**
   * Used to estimate the total height of a Table before all of its rows have actually been measured.
   * The estimated total height is adjusted as rows are rendered.
   */
  estimatedRowSize: _react.PropTypes.number.isRequired,

  /** Optional custom CSS class name to attach to inner Grid element. */
  gridClassName: _react.PropTypes.string,

  /** Optional inline style to attach to inner Grid element. */
  gridStyle: _react.PropTypes.object,

  /** Optional CSS class to apply to all column headers */
  headerClassName: _react.PropTypes.string,

  /** Fixed height of header row */
  headerHeight: _react.PropTypes.number.isRequired,

  /** Fixed/available height for out DOM element */
  height: _react.PropTypes.number.isRequired,

  /** Optional id */
  id: _react.PropTypes.string,

  /** Optional renderer to be used in place of table body rows when rowCount is 0 */
  noRowsRenderer: _react.PropTypes.func,

  /**
  * Optional callback when a column's header is clicked.
  * ({ columnData: any, dataKey: string }): void
  */
  onHeaderClick: _react.PropTypes.func,

  /** Optional custom inline style to attach to table header columns. */
  headerStyle: _react.PropTypes.object,

  /**
   * Callback invoked when a user clicks on a table row.
   * ({ index: number }): void
   */
  onRowClick: _react.PropTypes.func,

  /**
   * Callback invoked when a user double-clicks on a table row.
   * ({ index: number }): void
   */
  onRowDoubleClick: _react.PropTypes.func,

  /**
   * Callback invoked when the mouse leaves a table row.
   * ({ index: number }): void
   */
  onRowMouseOut: _react.PropTypes.func,

  /**
   * Callback invoked when a user moves the mouse over a table row.
   * ({ index: number }): void
   */
  onRowMouseOver: _react.PropTypes.func,

  /**
   * Callback invoked with information about the slice of rows that were just rendered.
   * ({ startIndex, stopIndex }): void
   */
  onRowsRendered: _react.PropTypes.func,

  /**
   * Callback invoked whenever the scroll offset changes within the inner scrollable region.
   * This callback can be used to sync scrolling between lists, tables, or grids.
   * ({ clientHeight, scrollHeight, scrollTop }): void
   */
  onScroll: _react.PropTypes.func.isRequired,

  /**
   * Number of rows to render above/below the visible bounds of the list.
   * These rows can help for smoother scrolling on touch devices.
   */
  overscanRowCount: _react.PropTypes.number.isRequired,

  /**
   * Optional CSS class to apply to all table rows (including the header row).
   * This property can be a CSS class name (string) or a function that returns a class name.
   * If a function is provided its signature should be: ({ index: number }): string
   */
  rowClassName: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),

  /**
   * Callback responsible for returning a data row given an index.
   * ({ index: number }): any
   */
  rowGetter: _react.PropTypes.func.isRequired,

  /**
   * Either a fixed row height (number) or a function that returns the height of a row given its index.
   * ({ index: number }): number
   */
  rowHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]).isRequired,

  /** Number of rows in table. */
  rowCount: _react.PropTypes.number.isRequired,

  /**
   * Responsible for rendering a table row given an array of columns:
   * Should implement the following interface: ({
   *   className: string,
   *   columns: Array,
   *   index: number,
   *   isScrolling: boolean,
   *   onRowClick: ?Function,
   *   onRowDoubleClick: ?Function,
   *   onRowMouseOver: ?Function,
   *   onRowMouseOut: ?Function,
   *   rowData: any,
   *   style: any
   * }): PropTypes.node
   */
  rowRenderer: _react.PropTypes.func,

  /** Optional custom inline style to attach to table rows. */
  rowStyle: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]).isRequired,

  /** See Grid#scrollToAlignment */
  scrollToAlignment: _react.PropTypes.oneOf(['auto', 'end', 'start', 'center']).isRequired,

  /** Row index to ensure visible (by forcefully scrolling if necessary) */
  scrollToIndex: _react.PropTypes.number,

  /** Vertical offset. */
  scrollTop: _react.PropTypes.number,

  /**
   * Sort function to be called if a sortable header is clicked.
   * ({ sortBy: string, sortDirection: SortDirection }): void
   */
  sort: _react.PropTypes.func,

  /** Table data is currently sorted by this :dataKey (if it is sorted at all) */
  sortBy: _react.PropTypes.string,

  /** Table data is currently sorted in this direction (if it is sorted at all) */
  sortDirection: _react.PropTypes.oneOf([_SortDirection2.default.ASC, _SortDirection2.default.DESC]),

  /** Optional inline style */
  style: _react.PropTypes.object,

  /** Tab index for focus */
  tabIndex: _react.PropTypes.number,

  /** Width of list */
  width: _react.PropTypes.number.isRequired
} : void 0;