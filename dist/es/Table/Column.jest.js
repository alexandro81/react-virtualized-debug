import Immutable from 'immutable';
import defaultCellDataGetter from './defaultCellDataGetter';
import defaultCellRenderer from './defaultCellRenderer';

describe('Column', function () {
  var rowData = Immutable.Map({
    foo: 'Foo',
    bar: 1
  });

  describe('defaultCellDataGetter', function () {
    it('should return a value for specified attributes', function () {
      expect(defaultCellDataGetter({
        dataKey: 'foo',
        rowData: rowData
      })).toEqual('Foo');
      expect(defaultCellDataGetter({
        dataKey: 'bar',
        rowData: rowData
      })).toEqual(1);
    });

    it('should return undefined for missing attributes', function () {
      expect(defaultCellDataGetter({
        dataKey: 'baz',
        rowData: rowData
      })).toEqual(undefined);
    });
  });

  describe('defaultCellRenderer', function () {
    it('should render a value for specified attributes', function () {
      expect(defaultCellRenderer({
        cellData: 'Foo',
        dataKey: 'foo',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('Foo');
      expect(defaultCellRenderer({
        cellData: 1,
        dataKey: 'bar',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('1');
    });

    it('should render empty string for null or missing attributes', function () {
      expect(defaultCellRenderer({
        cellData: null,
        dataKey: 'baz',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('');
      expect(defaultCellRenderer({
        cellData: undefined,
        dataKey: 'baz',
        rowData: rowData,
        rowIndex: 0
      })).toEqual('');
    });
  });
});