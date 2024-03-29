'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TestUtils = require('../TestUtils');

var _CellMeasurer = require('./CellMeasurer');

var _CellMeasurer2 = _interopRequireDefault(_CellMeasurer);

var _CellMeasurerCache = require('./CellMeasurerCache');

var _CellMeasurerCache2 = _interopRequireDefault(_CellMeasurerCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Accounts for the fact that JSDom doesn't support measurements.
/* global Element */

function mockClientWidthAndHeight(_ref) {
  var height = _ref.height,
      width = _ref.width;

  Object.defineProperty(Element.prototype, 'offsetHeight', {
    configurable: true,
    get: jest.fn().mockReturnValue(height)
  });

  Object.defineProperty(Element.prototype, 'offsetWidth', {
    configurable: true,
    get: jest.fn().mockReturnValue(width)
  });
}

function createParent() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      cache = _ref2.cache,
      _ref2$invalidateCellS = _ref2.invalidateCellSizeAfterRender,
      invalidateCellSizeAfterRender = _ref2$invalidateCellS === undefined ? jest.fn() : _ref2$invalidateCellS;

  return {
    invalidateCellSizeAfterRender: invalidateCellSizeAfterRender,
    props: {
      deferredMeasurementCache: cache
    }
  };
}

function renderHelper() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$cache = _ref3.cache,
      cache = _ref3$cache === undefined ? new _CellMeasurerCache2.default({
    fixedWidth: true
  }) : _ref3$cache,
      _ref3$children = _ref3.children,
      children = _ref3$children === undefined ? _react2.default.createElement('div', null) : _ref3$children,
      parent = _ref3.parent;

  (0, _TestUtils.render)(_react2.default.createElement(
    _CellMeasurer2.default,
    {
      cache: cache,
      columnIndex: 0,
      parent: parent,
      rowIndex: 0,
      style: {}
    },
    children
  ));
}

describe('CellMeasurer', function () {
  it('componentDidMount() should measure content that is not already in the cache', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedWidth: true
    });
    var parent = createParent({ cache: cache });

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    var offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get;
    var offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get;

    expect(offsetHeightMock.mock.calls).toHaveLength(0);
    expect(offsetWidthMock.mock.calls).toHaveLength(0);
    expect(cache.has(0, 0)).toBe(false);

    renderHelper({ cache: cache, parent: parent });

    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(1);
    expect(offsetWidthMock.mock.calls).toHaveLength(1);
    expect(cache.has(0, 0)).toBe(true);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });

  it('componentDidMount() should not measure content that is already in the cache', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);

    var parent = createParent({ cache: cache });

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    expect(cache.has(0, 0)).toBe(true);

    renderHelper({ cache: cache, parent: parent });

    var offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get;
    var offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get;

    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(0);
    expect(offsetWidthMock.mock.calls).toHaveLength(0);
  });

  it('componentDidUpdate() should measure content that is not already in the cache', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedWidth: true
    });
    var parent = createParent({ cache: cache });

    renderHelper({ cache: cache, parent: parent });

    cache.clear(0, 0);
    parent.invalidateCellSizeAfterRender.mockReset();

    expect(cache.has(0, 0)).toBe(false);
    expect(cache.getWidth(0, 0)).toBe(_CellMeasurerCache.DEFAULT_WIDTH);
    expect(cache.getHeight(0, 0)).toBe(_CellMeasurerCache.DEFAULT_HEIGHT);

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    var offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get;
    var offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get;

    renderHelper({ cache: cache, parent: parent });

    expect(cache.has(0, 0)).toBe(true);

    expect(parent.invalidateCellSizeAfterRender).toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(1);
    expect(offsetWidthMock.mock.calls).toHaveLength(1);
    expect(cache.getWidth(0, 0)).toBe(100);
    expect(cache.getHeight(0, 0)).toBe(20);
  });

  it('componentDidUpdate() should not measure content that is already in the cache', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedWidth: true
    });
    cache.set(0, 0, 100, 20);

    var parent = createParent({ cache: cache });

    expect(cache.has(0, 0)).toBe(true);

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    renderHelper({ cache: cache, parent: parent });
    renderHelper({ cache: cache, parent: parent });

    var offsetHeightMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight').get;
    var offsetWidthMock = Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth').get;

    expect(parent.invalidateCellSizeAfterRender).not.toHaveBeenCalled();
    expect(offsetHeightMock.mock.calls).toHaveLength(0);
    expect(offsetWidthMock.mock.calls).toHaveLength(0);
  });

  it('componentDidUpdate() should pass a :measure param to a function child', function () {
    var cache = new _CellMeasurerCache2.default({
      fixedWidth: true
    });

    var children = jest.fn();
    children.mockReturnValue(_react2.default.createElement('div', null));

    renderHelper({ cache: cache, children: children });

    expect(children).toHaveBeenCalled();

    var params = children.mock.calls[0][0];

    expect(typeof params.measure === 'function').toBe(true);
  });

  it('should still update cache without a parent Grid', function () {
    spyOn(console, 'warn');

    mockClientWidthAndHeight({
      height: 20,
      width: 100
    });

    var cache = new _CellMeasurerCache2.default({
      fixedWidth: true
    });

    renderHelper({ cache: cache }); // No parent Grid

    expect(cache.has(0, 0)).toBe(true);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should warn if parent Grid does not specify a :deferredMeasurementCache prop', function () {
    spyOn(console, 'warn');

    var parent = createParent(); // Parent Grid with no deferredMeasurementCache prop

    renderHelper({ parent: parent });

    expect(console.warn).toHaveBeenCalledWith('CellMeasurer should be rendered within a Grid that has a deferredMeasurementCache prop.');

    renderHelper({ parent: parent });

    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});