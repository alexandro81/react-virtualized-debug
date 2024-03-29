'use strict';

var _CellMeasurerCache = require('./CellMeasurerCache');

var _CellMeasurerCache2 = _interopRequireDefault(_CellMeasurerCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CellMeasurerCache', function () {
  it('should override defaultHeight/defaultWidth if minHeight/minWidth are greater', function () {
    var cache = new _CellMeasurerCache2.default({
      defaultHeight: 20,
      defaultWidth: 100,
      fixedHeight: true,
      fixedWidth: true,
      minHeight: 30,
      minWidth: 150
    });
    cache.set(0, 0, 50, 10);
    expect(cache.getHeight(0, 0)).toBe(30);
    expect(cache.getWidth(0, 0)).toBe(150);
    expect(cache.rowHeight({ index: 0 })).toBe(30);
    expect(cache.columnWidth({ index: 0 })).toBe(150);
  });

  it('should correctly report cache status', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.has(0, 0)).toBe(false);
  });

  it('should cache cells', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);
  });

  it('should return the correct default sizes for uncached cells if specified', function () {
    var cache = new _CellMeasurerCache2.default({
      defaultHeight: 20,
      defaultWidth: 100,
      fixedHeight: true,
      fixedWidth: true,
      minHeight: 15,
      minWidth: 80
    });
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
    cache.set(0, 0, 70, 10);
    expect(cache.getWidth(0, 0)).toBe(80);
    expect(cache.getHeight(0, 0)).toBe(15);
  });

  it('should clear a single cached cell', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    cache.set(1, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.has(1, 0)).toBe(true);
    cache.clear(0, 0);
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.has(1, 0)).toBe(true);
  });

  it('should clear all cached cells', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedHeight: true,
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);
    cache.set(1, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.has(1, 0)).toBe(true);
    cache.clearAll();
    expect(cache.has(0, 0)).toBe(false);
    expect(cache.has(1, 0)).toBe(false);
  });

  it('should support a custom :keyMapper', function () {
    var keyMapper = jest.fn();
    keyMapper.mockReturnValue('a');

    var cache = new _CellMeasurerCache2.default({
      fixedHeight: true,
      fixedWidth: true,
      keyMapper: keyMapper
    });
    cache.set(0, 0, 100, 20);
    expect(cache.has(0, 0)).toBe(true);

    keyMapper.mock.calls.splice(0);
    keyMapper.mockReturnValue('b');
    expect(cache.has(0, 0)).toBe(false);
    expect(keyMapper.mock.calls).toHaveLength(1);
  });

  it('should provide a Grid-compatible :columnWidth method', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.columnWidth({ index: 0 })).toBe(_CellMeasurerCache.DEFAULT_WIDTH);
    cache.set(0, 0, 100, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(100);
    expect(cache.columnWidth({ index: 1 })).toBe(_CellMeasurerCache.DEFAULT_WIDTH);
    cache.set(1, 0, 75, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(100);
    cache.set(2, 0, 125, 50);
    expect(cache.columnWidth({ index: 0 })).toBe(125);
  });

  it('should provide a Grid-compatible :rowHeight method', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.rowHeight({ index: 0 })).toBe(_CellMeasurerCache.DEFAULT_HEIGHT);
    cache.set(0, 0, 100, 50);
    expect(cache.rowHeight({ index: 0 })).toBe(50);
    expect(cache.rowHeight({ index: 1 })).toBe(_CellMeasurerCache.DEFAULT_HEIGHT);
    cache.set(0, 1, 100, 25);
    expect(cache.rowHeight({ index: 0 })).toBe(50);
    cache.set(0, 2, 100, 75);
    expect(cache.rowHeight({ index: 0 })).toBe(75);
  });

  it('should return the :defaultWidth for :columnWidth if not measured', function () {
    var cache = new _CellMeasurerCache2.default({
      defaultWidth: 25,
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.columnWidth({ index: 0 })).toBe(25);
  });

  it('should return the :defaultHeight for :rowHeight if not measured', function () {
    var cache = new _CellMeasurerCache2.default({
      defaultHeight: 25,
      fixedHeight: true,
      fixedWidth: true
    });
    expect(cache.rowHeight({ index: 0 })).toBe(25);
  });

  describe('DEV mode', function () {
    it('should warn about dynamic width and height configurations', function () {
      spyOn(console, 'warn');

      var cache = new _CellMeasurerCache2.default({
        fixedHeight: false,
        fixedWidth: false
      });

      expect(cache.hasFixedHeight()).toBe(false);
      expect(cache.hasFixedWidth()).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('CellMeasurerCache should only measure a cell\'s width or height. ' + 'You have configured CellMeasurerCache to measure both. ' + 'This will result in poor performance.');
    });

    it('should warn about dynamic width with a defaultWidth of 0', function () {
      spyOn(console, 'warn');

      var cache = new _CellMeasurerCache2.default({
        defaultWidth: 0,
        fixedHeight: true
      });

      expect(cache.getWidth(0, 0)).toBe(0);
      expect(console.warn).toHaveBeenCalledWith('Fixed width CellMeasurerCache should specify a :defaultWidth greater than 0. ' + 'Failing to do so will lead to unnecessary layout and poor performance.');
    });

    it('should warn about dynamic height with a defaultHeight of 0', function () {
      spyOn(console, 'warn');

      var cache = new _CellMeasurerCache2.default({
        defaultHeight: 0,
        fixedWidth: true
      });

      expect(cache.getHeight(0, 0)).toBe(0);
      expect(console.warn).toHaveBeenCalledWith('Fixed height CellMeasurerCache should specify a :defaultHeight greater than 0. ' + 'Failing to do so will lead to unnecessary layout and poor performance.');
    });
  });
});