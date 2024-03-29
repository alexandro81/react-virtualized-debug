import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Object$entries from 'babel-runtime/core-js/object/entries';
import _Number$parseInt from 'babel-runtime/core-js/number/parse-int';
import _Array$from from 'babel-runtime/core-js/array/from';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import { Simulate } from 'react-addons-test-utils';
import Immutable from 'immutable';
import Column from './Column';
import Table from './Table';
import SortDirection from './SortDirection';

describe('Table', function () {
  var array = [];
  for (var i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: 'Name ' + i,
      email: 'user-' + i + '@treasure-data.com'
    });
  }
  var list = Immutable.fromJS(array);

  // Works with an Immutable List of Maps
  function immutableRowGetter(_ref) {
    var index = _ref.index;

    return list.get(index);
  }

  // Works with an Array of Objects
  function vanillaRowGetter(_ref2) {
    var index = _ref2.index;

    return array[index];
  }

  function getMarkup() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var cellDataGetter = _ref3.cellDataGetter,
        cellRenderer = _ref3.cellRenderer,
        _ref3$columnData = _ref3.columnData,
        columnData = _ref3$columnData === undefined ? { data: 123 } : _ref3$columnData,
        columnStyle = _ref3.columnStyle,
        _ref3$disableSort = _ref3.disableSort,
        disableSort = _ref3$disableSort === undefined ? false : _ref3$disableSort,
        headerRenderer = _ref3.headerRenderer,
        maxWidth = _ref3.maxWidth,
        minWidth = _ref3.minWidth,
        flexTableProps = _objectWithoutProperties(_ref3, ['cellDataGetter', 'cellRenderer', 'columnData', 'columnStyle', 'disableSort', 'headerRenderer', 'maxWidth', 'minWidth']);

    return React.createElement(
      Table,
      _extends({
        headerHeight: 20,
        height: 100,
        overscanRowCount: 0,
        rowCount: list.size,
        rowGetter: immutableRowGetter,
        rowHeight: 10,
        width: 100
      }, flexTableProps),
      React.createElement(Column, {
        label: 'Name',
        dataKey: 'name',
        columnData: columnData,
        width: 50,
        cellRenderer: cellRenderer,
        cellDataGetter: cellDataGetter,
        headerRenderer: headerRenderer,
        disableSort: disableSort,
        style: columnStyle
      }),
      React.createElement(Column, {
        label: 'Email',
        dataKey: 'email',
        maxWidth: maxWidth,
        minWidth: minWidth,
        width: 50
      }),
      false,
      true,
      null,
      undefined
    );
  }

  describe('children', function () {
    it('should accept Column children', function () {
      var children = [React.createElement(Column, {
        dataKey: 'foo',
        width: 100
      })];
      var result = Table.propTypes.children({ children: children }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });

    it('should not accept non-Column children', function () {
      var children = [React.createElement('div', null)];
      var result = Table.propTypes.children({ children: children }, 'children', 'Table');
      expect(result instanceof Error).toEqual(true);
    });

    it('should accept falsy children to allow easier dynamic showing/hiding of columns', function () {
      var children = [false, React.createElement(Column, {
        dataKey: 'foo',
        width: 100
      }), null];
      var result = Table.propTypes.children({ children: children }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });
  });

  describe('height', function () {
    it('should subtract header row height from the inner Grid height if headers are enabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        headerHeight: 10,
        overscanRowCount: 0,
        rowHeight: 20,
        height: 50
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(2);
    });

    it('should not subtract header row height from the inner Grid height if headers are disabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableHeader: true,
        headerHeight: 10,
        overscanRowCount: 0,
        rowHeight: 20,
        height: 50
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(3);
    });
  });

  describe('initial rendering', function () {
    // Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
    var useImmutable = [true, false];
    useImmutable.forEach(function (useImmutable) {
      it('should render the correct number of rows', function () {
        var rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })));
        // 100px height should fit 1 header (20px) and 8 rows (10px each) -
        expect(rendered.querySelectorAll('.ReactVirtualized__Table__headerRow').length).toEqual(1);
        expect(rendered.querySelectorAll('.ReactVirtualized__Table__row').length).toEqual(8);
      });

      it('should render the expected headers', function () {
        var rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })));
        var columns = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn');
        expect(columns.length).toEqual(2);
        expect(columns[0].textContent).toEqual('Name');
        expect(columns[1].textContent).toEqual('Email');
      });

      it('should render the expected rows and columns', function () {
        var rendered = findDOMNode(render(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
          headerHeight: 10,
          rowHeight: 20,
          height: 50
        })));
        var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
        expect(rows.length).toEqual(2);
        _Array$from(rows).forEach(function (row, index) {
          var rowData = list.get(index);
          var columns = row.querySelectorAll('.ReactVirtualized__Table__rowColumn');
          expect(columns.length).toEqual(2);
          expect(columns[0].textContent).toEqual(rowData.get('name'));
          expect(columns[1].textContent).toEqual(rowData.get('email'));
        });
      });
    });

    it('should support a :rowHeight function', function () {
      var rowHeight = function rowHeight(_ref4) {
        var index = _ref4.index;
        return 10 + index * 10;
      };
      var rendered = findDOMNode(render(getMarkup({
        rowHeight: rowHeight,
        rowCount: 3
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      _Array$from(rows).forEach(function (row, index) {
        expect(_Number$parseInt(row.style.height, 10)).toEqual(rowHeight({ index: index }));
      });
    });

    it('should support :minWidth and :maxWidth values for a column', function () {
      var rendered = findDOMNode(render(getMarkup({
        maxWidth: 75,
        minWidth: 25,
        rowCount: 1
      })));
      var columns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn');
      var emailColumn = columns[1];
      expect(_Number$parseInt(emailColumn.style.maxWidth, 10)).toEqual(75);
      expect(_Number$parseInt(emailColumn.style.minWidth, 10)).toEqual(25);
    });
  });

  describe('measureAllRows', function () {
    it('should measure any unmeasured rows', function () {
      var rendered = render(getMarkup({
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: function rowHeight() {
          return 20;
        },
        width: 0
      }));
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(150);
      rendered.measureAllRows();
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(200);
    });
  });

  describe('recomputeRowHeights', function () {
    it('should recompute row heights and other values when called', function () {
      var indices = [];
      var rowHeight = function rowHeight(_ref5) {
        var index = _ref5.index;

        indices.push(index);
        return 10;
      };
      var component = render(getMarkup({
        rowHeight: rowHeight,
        rowCount: 50
      }));

      indices.splice(0);
      component.recomputeRowHeights();

      // Only the rows required to fill the current viewport will be rendered
      expect(indices[0]).toEqual(0);
      expect(indices[indices.length - 1]).toEqual(7);

      indices.splice(0);
      component.recomputeRowHeights(4);

      expect(indices[0]).toEqual(4);
      expect(indices[indices.length - 1]).toEqual(7);
    });
  });

  describe('forceUpdateGrid', function () {
    it('should refresh inner Grid content when called', function () {
      var marker = 'a';
      function cellRenderer(_ref6) {
        var cellData = _ref6.cellData,
            columnData = _ref6.columnData,
            dataKey = _ref6.dataKey,
            rowData = _ref6.rowData,
            rowIndex = _ref6.rowIndex;

        return '' + rowIndex + marker;
      }
      var component = render(getMarkup({ cellRenderer: cellRenderer }));
      var node = findDOMNode(component);
      expect(node.textContent).toContain('1a');
      marker = 'b';
      component.forceUpdateGrid();
      expect(node.textContent).toContain('1b');
    });
  });

  describe('custom getter functions', function () {
    it('should use a custom cellDataGetter if specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellDataGetter: function cellDataGetter(_ref7) {
          var columnData = _ref7.columnData,
              dataKey = _ref7.dataKey,
              rowData = _ref7.rowData;
          return 'Custom ' + dataKey + ' for row ' + rowData.get('id');
        }
      })));
      var nameColumns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn:first-of-type');
      _Array$from(nameColumns).forEach(function (nameColumn, index) {
        expect(nameColumn.textContent).toEqual('Custom name for row ' + index);
      });
    });

    it('should use a custom cellRenderer if specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellRenderer: function cellRenderer(_ref8) {
          var cellData = _ref8.cellData,
              columnData = _ref8.columnData,
              dataKey = _ref8.dataKey,
              rowData = _ref8.rowData,
              rowIndex = _ref8.rowIndex;
          return 'Custom ' + cellData;
        }
      })));
      var nameColumns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn:first-of-type');
      _Array$from(nameColumns).forEach(function (nameColumn, index) {
        var rowData = list.get(index);
        expect(nameColumn.textContent).toEqual('Custom ' + rowData.get('name'));
      });
    });

    it('should set the rendered cell content as the cell :title if it is a string', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellRenderer: function cellRenderer(_ref9) {
          var cellData = _ref9.cellData,
              columnData = _ref9.columnData,
              dataKey = _ref9.dataKey,
              rowData = _ref9.rowData,
              rowIndex = _ref9.rowIndex;
          return 'Custom';
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__rowColumn:first-of-type');
      expect(nameColumn.getAttribute('title')).toContain('Custom');
    });

    it('should not set a cell :title if the rendered cell content is not a string', function () {
      var rendered = findDOMNode(render(getMarkup({
        cellRenderer: function cellRenderer(_ref10) {
          var cellData = _ref10.cellData,
              columnData = _ref10.columnData,
              dataKey = _ref10.dataKey,
              rowData = _ref10.rowData,
              rowIndex = _ref10.rowIndex;
          return React.createElement(
            'div',
            null,
            'Custom'
          );
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__rowColumn:first-of-type');
      expect(nameColumn.getAttribute('title')).toEqual(null);
    });
  });

  describe('sorting', function () {
    it('should not render sort indicators if no sort function is provided', function () {
      var rendered = findDOMNode(render(getMarkup()));
      var nameColumn = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.className || '').not.toContain('ReactVirtualized__Table__sortableHeaderColumn');
    });

    it('should not render sort indicators for non-sortable columns', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        sort: function sort() {}
      })));
      var nameColumn = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.className || '').not.toContain('ReactVirtualized__Table__sortableHeaderColumn');
      expect(rendered.querySelectorAll('.ReactVirtualized__Table__sortableHeaderColumn').length).toEqual(1); // Email only
    });

    it('should render sortable column headers as sortable', function () {
      var rendered = findDOMNode(render(getMarkup({
        sort: function sort() {}
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.className).toContain('ReactVirtualized__Table__sortableHeaderColumn');
      expect(rendered.querySelectorAll('.ReactVirtualized__Table__sortableHeaderColumn').length).toEqual(2); // Email and Name
    });

    it('should render the correct sort indicator by the current sort-by column', function () {
      var sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(function (sortDirection) {
        var rendered = findDOMNode(render(getMarkup({
          sort: function sort() {},
          sortBy: 'name',
          sortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

        expect(nameColumn.querySelector('.ReactVirtualized__Table__sortableHeaderIcon')).not.toEqual(null);
        expect(nameColumn.querySelector('.ReactVirtualized__Table__sortableHeaderIcon--' + sortDirection)).not.toEqual(null);
      });
    });

    it('should call sort with the correct arguments when the current sort-by column header is clicked', function () {
      var sortDirections = [SortDirection.ASC, SortDirection.DESC];
      sortDirections.forEach(function (sortDirection) {
        var sortCalls = [];
        var rendered = findDOMNode(render(getMarkup({
          sort: function sort(_ref11) {
            var sortBy = _ref11.sortBy,
                sortDirection = _ref11.sortDirection;
            return sortCalls.push({ sortBy: sortBy, sortDirection: sortDirection });
          },
          sortBy: 'name',
          sortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

        Simulate.click(nameColumn);
        expect(sortCalls.length).toEqual(1);

        var _sortCalls$ = sortCalls[0],
            sortBy = _sortCalls$.sortBy,
            newSortDirection = _sortCalls$.sortDirection;

        var expectedSortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
        expect(sortBy).toEqual('name');
        expect(newSortDirection).toEqual(expectedSortDirection);
      });
    });

    it('should call sort with the correct arguments when a new sort-by column header is clicked', function () {
      var sortCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        sort: function sort(_ref12) {
          var sortBy = _ref12.sortBy,
              sortDirection = _ref12.sortDirection;
          return sortCalls.push({ sortBy: sortBy, sortDirection: sortDirection });
        },
        sortBy: 'email',
        sortDirection: SortDirection.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      Simulate.click(nameColumn);
      expect(sortCalls.length).toEqual(1);

      var _sortCalls$2 = sortCalls[0],
          sortBy = _sortCalls$2.sortBy,
          sortDirection = _sortCalls$2.sortDirection;

      expect(sortBy).toEqual('name');
      expect(sortDirection).toEqual(SortDirection.ASC);
    });

    it('should call sort when a column header is activated via ENTER or SPACE key', function () {
      var sortCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        sort: function sort(_ref13) {
          var sortBy = _ref13.sortBy,
              sortDirection = _ref13.sortDirection;
          return sortCalls.push({ sortBy: sortBy, sortDirection: sortDirection });
        },
        sortBy: 'name'
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      expect(sortCalls.length).toEqual(0);
      Simulate.keyDown(nameColumn, { key: ' ' });
      expect(sortCalls.length).toEqual(1);
      Simulate.keyDown(nameColumn, { key: 'Enter' });
      expect(sortCalls.length).toEqual(2);
      Simulate.keyDown(nameColumn, { key: 'F' });
      expect(sortCalls.length).toEqual(2);
    });
  });

  describe('headerRenderer', function () {
    it('should render a custom header if one is provided', function () {
      var columnData = { foo: 'foo', bar: 'bar' };
      var headerRendererCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        columnData: columnData,
        headerRenderer: function headerRenderer(params) {
          headerRendererCalls.push(params);
          return 'custom header';
        },
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.textContent).toContain('custom header');
      expect(headerRendererCalls.length).toBeTruthy();

      var headerRendererCall = headerRendererCalls[0];
      expect(headerRendererCall.columnData).toEqual(columnData);
      expect(headerRendererCall.dataKey).toEqual('name');
      expect(headerRendererCall.disableSort).toEqual(false);
      expect(headerRendererCall.label).toEqual('Name');
      expect(headerRendererCall.sortBy).toEqual('name');
      expect(headerRendererCall.sortDirection).toEqual(SortDirection.ASC);
    });

    it('should honor sort for custom headers', function () {
      var sortCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        headerRenderer: function headerRenderer(params) {
          return 'custom header';
        },
        sort: function sort(_ref14) {
          var sortBy = _ref14.sortBy,
              sortDirection = _ref14.sortDirection;
          return sortCalls.push([sortBy, sortDirection]);
        },
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      Simulate.click(nameColumn);

      expect(sortCalls.length).toEqual(1);
      var sortCall = sortCalls[0];
      expect(sortCall[0]).toEqual('name');
      expect(sortCall[1]).toEqual(SortDirection.DESC);
    });

    it('should honor :onHeaderClick for custom header', function () {
      var columnData = { foo: 'foo', bar: 'bar' };
      var onHeaderClickCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        columnData: columnData,
        headerRenderer: function headerRenderer(params) {
          return 'custom header';
        },
        onHeaderClick: function onHeaderClick(_ref15) {
          var columnData = _ref15.columnData,
              dataKey = _ref15.dataKey;
          return onHeaderClickCalls.push([dataKey, columnData]);
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      Simulate.click(nameColumn);

      expect(onHeaderClickCalls.length).toEqual(1);
      var onHeaderClickCall = onHeaderClickCalls[0];
      expect(onHeaderClickCall[0]).toEqual('name');
      expect(onHeaderClickCall[1]).toEqual(columnData);
    });
  });

  describe('noRowsRenderer', function () {
    it('should call :noRowsRenderer if :rowCount is 0', function () {
      var rendered = render(getMarkup({
        noRowsRenderer: function noRowsRenderer() {
          return React.createElement(
            'div',
            null,
            'No rows!'
          );
        },
        rowCount: 0
      }));
      var bodyDOMNode = findDOMNode(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('No rows!');
    });

    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', function () {
      var rendered = render(getMarkup({
        rowCount: 0
      }));
      var bodyDOMNode = findDOMNode(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('');
    });
  });

  describe('onHeaderClick', function () {
    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled', function () {
      var onHeaderClickCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        disableSort: true,
        onHeaderClick: function onHeaderClick(_ref16) {
          var columnData = _ref16.columnData,
              dataKey = _ref16.dataKey;
          return onHeaderClickCalls.push({ dataKey: dataKey, columnData: columnData });
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      Simulate.click(nameColumn);
      expect(onHeaderClickCalls.length).toEqual(1);
      expect(onHeaderClickCalls[0].dataKey).toEqual('name');
      expect(onHeaderClickCalls[0].columnData.data).toEqual(123);
    });

    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is enabled', function () {
      var onHeaderClickCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        disableSort: false,
        onHeaderClick: function onHeaderClick(_ref17) {
          var columnData = _ref17.columnData,
              dataKey = _ref17.dataKey;
          return onHeaderClickCalls.push({ dataKey: dataKey, columnData: columnData });
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      Simulate.click(nameColumn);
      expect(onHeaderClickCalls.length).toEqual(1);
      expect(onHeaderClickCalls[0].dataKey).toEqual('name');
      expect(onHeaderClickCalls[0].columnData.data).toEqual(123);
    });
  });

  describe('onRowClick', function () {
    it('should call :onRowClick with the correct :rowIndex when a row is clicked', function () {
      var onRowClickCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        onRowClick: function onRowClick(_ref18) {
          var index = _ref18.index;
          return onRowClickCalls.push(index);
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.click(rows[0]);
      Simulate.click(rows[3]);
      expect(onRowClickCalls).toEqual([0, 3]);
    });
  });

  describe('onRowDoubleClick', function () {
    it('should call :onRowDoubleClick with the correct :rowIndex when a row is clicked', function () {
      var onRowDoubleClickCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        onRowDoubleClick: function onRowDoubleClick(_ref19) {
          var index = _ref19.index;
          return onRowDoubleClickCalls.push(index);
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Simulate.doubleClick(rows[0]);
      Simulate.doubleClick(rows[3]);
      expect(onRowDoubleClickCalls).toEqual([0, 3]);
    });
  });

  describe('onRowMouseOver/Out', function () {
    it('should call :onRowMouseOver and :onRowMouseOut with the correct :rowIndex when the mouse is moved over rows', function () {
      var onRowMouseOverCalls = [];
      var onRowMouseOutCalls = [];
      var rendered = findDOMNode(render(getMarkup({
        onRowMouseOver: function onRowMouseOver(_ref20) {
          var index = _ref20.index;
          return onRowMouseOverCalls.push(index);
        },
        onRowMouseOut: function onRowMouseOut(_ref21) {
          var index = _ref21.index;
          return onRowMouseOutCalls.push(index);
        }
      })));

      var simulateMouseOver = function simulateMouseOver(from, to) {
        Simulate.mouseOut(from, { relatedTarget: to });
        Simulate.mouseOver(to, { relatedTarget: from });
      };

      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      simulateMouseOver(rows[0], rows[1]);
      simulateMouseOver(rows[1], rows[2]);
      simulateMouseOver(rows[2], rows[3]);
      expect(onRowMouseOverCalls).toEqual([1, 2, 3]);
      expect(onRowMouseOutCalls).toEqual([0, 1, 2]);
    });
  });

  describe('rowClassName', function () {
    it('should render a static classname given :rowClassName as a string', function () {
      var staticClassName = 'staticClass';
      var rendered = findDOMNode(render(getMarkup({
        rowClassName: staticClassName
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      _Array$from(rows).forEach(function (row, index) {
        expect(row.className).toContain(staticClassName);
      });
    });

    it('should render dynamic classname given :rowClassName as a function', function () {
      var rendered = findDOMNode(render(getMarkup({
        rowClassName: function rowClassName(_ref22) {
          var index = _ref22.index;
          return index % 2 === 0 ? 'even' : 'odd';
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      _Array$from(rows).forEach(function (row, index) {
        if (index % 2 === 0) {
          expect(row.className).toContain('even');
          expect(row.className).not.toContain('odd');
        } else {
          expect(row.className).toContain('odd');
          expect(row.className).not.toContain('even');
        }
      });
    });
  });

  describe('onRowsRendered', function () {
    it('should call :onRowsRendered at least one row is rendered', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params;

          return _params = params, startIndex = _params.startIndex, stopIndex = _params.stopIndex, _params;
        }
      }));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it('should not call :onRowsRendered unless the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex = void 0;
      var stopIndex = void 0;
      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      render(getMarkup({ onRowsRendered: onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(getMarkup({ onRowsRendered: onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it('should call :onRowsRendered if the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex = void 0;
      var stopIndex = void 0;
      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      render(getMarkup({ onRowsRendered: onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      render(getMarkup({
        height: 50,
        onRowsRendered: onRowsRendered
      }));
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(2);
    });

    it('should not call :onRowsRendered if no rows are rendered', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        height: 0,
        onRowsRendered: function onRowsRendered(params) {
          var _params2;

          return _params2 = params, startIndex = _params2.startIndex, stopIndex = _params2.stopIndex, _params2;
        }
      }));
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
    });
  });

  describe(':scrollTop property', function () {
    it('should render correctly when an initial :scrollTop property is specified', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params3;

          return _params3 = params, startIndex = _params3.startIndex, stopIndex = _params3.stopIndex, _params3;
        },
        scrollTop: 80
      }));
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });

    it('should render correctly when :scrollTop property is updated', function () {
      var startIndex = void 0,
          stopIndex = void 0;

      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params4;

          return _params4 = params, startIndex = _params4.startIndex, stopIndex = _params4.stopIndex, _params4;
        }
      }));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);

      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params5;

          return _params5 = params, startIndex = _params5.startIndex, stopIndex = _params5.stopIndex, _params5;
        },
        scrollTop: 80
      }));
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });
  });

  describe('styles, classNames, and ids', function () {
    it('should use the expected global CSS classNames', function () {
      var node = findDOMNode(render(getMarkup({
        sort: function sort() {},
        sortBy: 'name',
        sortDirection: SortDirection.ASC
      })));
      expect(node.className).toEqual('ReactVirtualized__Table');
      expect(node.querySelector('.ReactVirtualized__Table__headerRow')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__rowColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__headerColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__row')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__sortableHeaderColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__sortableHeaderIcon')).toBeTruthy();
    });

    it('should use a custom :className if specified', function () {
      var node = findDOMNode(render(getMarkup({
        className: 'foo',
        headerClassName: 'bar',
        rowClassName: 'baz'
      })));
      expect(node.className).toContain('foo');
      expect(node.querySelectorAll('.bar').length).toEqual(2);
      expect(node.querySelectorAll('.baz').length).toEqual(9);
    });

    it('should use a custom :id if specified', function () {
      var node = findDOMNode(render(getMarkup({ id: 'bar' })));
      expect(node.getAttribute('id')).toEqual('bar');
    });

    it('should not set :id on the inner Grid', function () {
      var node = findDOMNode(render(getMarkup({ id: 'bar' })));
      var grid = node.querySelector('.ReactVirtualized__Grid');
      expect(grid.getAttribute('id')).not.toEqual('bar');
    });

    it('should use custom :styles if specified', function () {
      var columnStyle = { backgroundColor: 'red' };
      var headerStyle = { backgroundColor: 'blue' };
      var rowStyle = { backgroundColor: 'green' };
      var style = { backgroundColor: 'orange' };
      var node = findDOMNode(render(getMarkup({
        columnStyle: columnStyle,
        headerStyle: headerStyle,
        rowStyle: rowStyle,
        style: style
      })));
      expect(node.querySelector('.ReactVirtualized__Table__rowColumn').style.backgroundColor).toEqual('red');
      expect(node.querySelector('.ReactVirtualized__Table__headerColumn').style.backgroundColor).toEqual('blue');
      expect(node.querySelector('.ReactVirtualized__Table__row').style.backgroundColor).toEqual('green');
      expect(node.style.backgroundColor).toEqual('orange');
    });

    it('should render dynamic style given :rowStyle as a function', function () {
      var rendered = findDOMNode(render(getMarkup({
        rowStyle: function rowStyle(_ref23) {
          var index = _ref23.index;
          return index % 2 === 0 ? { backgroundColor: 'red' } : { backgroundColor: 'green' };
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      _Array$from(rows).forEach(function (row, index) {
        if (index % 2 === 0) {
          expect(row.style.backgroundColor).toEqual('red');
        } else {
          expect(row.style.backgroundColor).toEqual('green');
        }
      });
    });

    it('should pass :gridClassName and :gridStyle to the inner Grid', function () {
      var rendered = findDOMNode(render(getMarkup({
        gridClassName: 'foo',
        gridStyle: { backgroundColor: 'red' }
      })));
      var grid = rendered.querySelector('.ReactVirtualized__Grid');
      expect(grid.className).toContain('foo');
      expect(grid.style.backgroundColor).toEqual('red');
    });
  });

  describe('overscanRowCount', function () {
    it('should not overscan by default', function () {
      var overscanStartIndex = void 0,
          overscanStopIndex = void 0,
          startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params6;

          return _params6 = params, overscanStartIndex = _params6.overscanStartIndex, overscanStopIndex = _params6.overscanStopIndex, startIndex = _params6.startIndex, stopIndex = _params6.stopIndex, _params6;
        }
      }));
      expect(overscanStartIndex).toEqual(startIndex);
      expect(overscanStopIndex).toEqual(stopIndex);
    });

    it('should overscan the specified amount', function () {
      var overscanStartIndex = void 0,
          overscanStopIndex = void 0,
          startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params7;

          return _params7 = params, overscanStartIndex = _params7.overscanStartIndex, overscanStopIndex = _params7.overscanStopIndex, startIndex = _params7.startIndex, stopIndex = _params7.stopIndex, _params7;
        },
        overscanRowCount: 10,
        scrollToIndex: 30
      }));
      expect(overscanStartIndex).toEqual(23);
      expect(startIndex).toEqual(23);
      expect(stopIndex).toEqual(30);
      expect(overscanStopIndex).toEqual(40);
    });

    it('should not overscan beyond the start of the list', function () {
      var overscanStartIndex = void 0,
          overscanStopIndex = void 0,
          startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params8;

          return _params8 = params, overscanStartIndex = _params8.overscanStartIndex, overscanStopIndex = _params8.overscanStopIndex, startIndex = _params8.startIndex, stopIndex = _params8.stopIndex, _params8;
        },
        overscanRowCount: 10
      }));
      expect(overscanStartIndex).toEqual(0);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      expect(overscanStopIndex).toEqual(17);
    });

    it('should not overscan beyond the end of the list', function () {
      var overscanStartIndex = void 0,
          overscanStopIndex = void 0,
          startIndex = void 0,
          stopIndex = void 0;
      render(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params9;

          return _params9 = params, overscanStartIndex = _params9.overscanStartIndex, overscanStopIndex = _params9.overscanStopIndex, startIndex = _params9.startIndex, stopIndex = _params9.stopIndex, _params9;
        },
        overscanRowCount: 10,
        rowCount: 15
      }));
      expect(overscanStartIndex).toEqual(0);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      expect(overscanStopIndex).toEqual(14);
    });
  });

  describe('onScroll', function () {
    it('should trigger callback when component initially mounts', function () {
      var onScrollCalls = [];
      render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      expect(onScrollCalls).toEqual([{
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 0
      }]);
    });

    it('should trigger callback when component scrolls', function () {
      var onScrollCalls = [];
      var rendered = render(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      var target = {
        scrollLeft: 0,
        scrollTop: 100
      };
      rendered.Grid._scrollingContainer = target; // HACK to work around _onScroll target check
      Simulate.scroll(findDOMNode(rendered.Grid), { target: target });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 100
      });
    });
  });

  describe('a11y properties', function () {
    it('should attach a11y properties to a row if :onRowClick is specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        onRowClick: function onRowClick() {}
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual('row');
      expect(row.getAttribute('role')).toEqual('row');
      expect(row.tabIndex).toEqual(0);
    });

    it('should not attach a11y properties to a row if no :onRowClick is specified', function () {
      var rendered = findDOMNode(render(getMarkup({
        onRowClick: null
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.getAttribute('role')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });

    it('should attach a11y properties to a header column if sort is enabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableSort: false,
        sort: function sort() {}
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(row.getAttribute('aria-label')).toEqual('Name');
      expect(row.getAttribute('role')).toEqual('rowheader');
      expect(row.tabIndex).toEqual(0);
    });

    it('should not attach a11y properties to a header column if sort is not enabled', function () {
      var rendered = findDOMNode(render(getMarkup({
        disableSort: true
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.getAttribute('role')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });
  });

  describe('tabIndex', function () {
    it('should be focusable by default', function () {
      var rendered = findDOMNode(render(getMarkup()));
      expect(rendered.querySelector('.ReactVirtualized__Grid').tabIndex).toEqual(0);
    });

    it('should allow tabIndex to be overridden', function () {
      var rendered = findDOMNode(render(getMarkup({
        tabIndex: -1
      })));
      expect(rendered.querySelector('.ReactVirtualized__Grid').tabIndex).toEqual(-1);
    });
  });

  describe('pure', function () {
    it('should not re-render unless props have changed', function () {
      var headerRendererCalled = false;
      var cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }
      var markup = getMarkup({
        headerRenderer: headerRenderer,
        cellRenderer: cellRenderer
      });
      render(markup);
      expect(headerRendererCalled).toEqual(true);
      expect(cellRendererCalled).toEqual(true);
      headerRendererCalled = false;
      cellRendererCalled = false;
      render(markup);
      expect(headerRendererCalled).toEqual(false);
      expect(cellRendererCalled).toEqual(false);
    });

    it('should re-render both the Table and the inner Grid whenever an external property changes', function () {
      var headerRendererCalled = false;
      var cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }
      var initialProperties = {
        autoHeight: false,
        cellRenderer: cellRenderer,
        estimatedRowSize: 15,
        headerRenderer: headerRenderer,
        overscanRowCount: 1,
        rowHeight: 15,
        rowCount: 20,
        scrollToAlignment: 'auto',
        scrollTop: 0,
        sortBy: 'name',
        sortDirection: SortDirection.ASC,
        tabIndex: null
      };
      var changedProperties = {
        autoHeight: true,
        estimatedRowSize: 10,
        overscanRowCount: 0,
        rowHeight: 10,
        rowCount: 10,
        scrollToAlignment: 'center',
        scrollTop: 1,
        sortBy: 'email',
        sortDirection: SortDirection.DESC,
        tabIndex: 1
      };
      _Object$entries(changedProperties).forEach(function (_ref24) {
        var _ref25 = _slicedToArray(_ref24, 2),
            key = _ref25[0],
            value = _ref25[1];

        render.unmount(); // Reset
        render(getMarkup(initialProperties));
        headerRendererCalled = true;
        cellRendererCalled = false;
        render(getMarkup(_extends({}, initialProperties, _defineProperty({}, key, value))));
        expect(headerRendererCalled).toEqual(true);
        expect(cellRendererCalled).toEqual(true);
      });
    });
  });

  it('should set the width of the single-column inner Grid to auto', function () {
    var rendered = findDOMNode(render(getMarkup()));
    expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('auto');
  });

  it('should relay the Grid :parent param to the Column :cellRenderer', function () {
    var cellRenderer = jest.fn().mockReturnValue(null);
    findDOMNode(render(getMarkup({ cellRenderer: cellRenderer })));
    expect(cellRenderer.mock.calls[0][0].parent).not.toBeUndefined();
  });
});