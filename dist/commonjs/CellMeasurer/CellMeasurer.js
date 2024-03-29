'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _reactDom = require('react-dom');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function warnAboutImproperUse(parent) {
  if (process.env.NODE_ENV !== 'production') {
    if (parent && parent.props.deferredMeasurementCache === undefined && parent.__warnedAboutImproperUse !== true) {
      parent.__warnedAboutImproperUse = true;
      console.warn('CellMeasurer should be rendered within a Grid that has a deferredMeasurementCache prop.');
    }
  }
}

// Prevent Grid from warning about missing :style prop on CellMeasurer.
// It's understood that style will often be passed to the child instead.
var EMPTY_OBJECT = {};

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */

var CellMeasurer = function (_PureComponent) {
  _inherits(CellMeasurer, _PureComponent);

  function CellMeasurer(props, context) {
    _classCallCheck(this, CellMeasurer);

    var _this = _possibleConstructorReturn(this, (CellMeasurer.__proto__ || Object.getPrototypeOf(CellMeasurer)).call(this, props, context));

    _this._measure = _this._measure.bind(_this);
    return _this;
  }

  _createClass(CellMeasurer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._maybeMeasureCell();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this._maybeMeasureCell();
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;


      if (process.env.NODE_ENV !== 'production') {
        var _parent = this.props.parent;


        warnAboutImproperUse(_parent);
      }

      return typeof children === 'function' ? children({ measure: this._measure }) : children;
    }
  }, {
    key: '_maybeMeasureCell',
    value: function _maybeMeasureCell() {
      var _props = this.props,
          cache = _props.cache,
          columnIndex = _props.columnIndex,
          parent = _props.parent,
          rowIndex = _props.rowIndex;


      if (!cache.has(rowIndex, columnIndex)) {
        var node = (0, _reactDom.findDOMNode)(this);
        var height = node.offsetHeight;
        var width = node.offsetWidth;

        cache.set(rowIndex, columnIndex, width, height);

        // If size has changed, let Grid know to re-render.
        if (parent !== undefined) {
          parent.invalidateCellSizeAfterRender({
            columnIndex: columnIndex,
            rowIndex: rowIndex
          });
        }
      }
    }
  }, {
    key: '_measure',
    value: function _measure() {
      var _props2 = this.props,
          cache = _props2.cache,
          columnIndex = _props2.columnIndex,
          parent = _props2.parent,
          rowIndex = _props2.rowIndex;


      var node = (0, _reactDom.findDOMNode)(this);
      var height = node.offsetHeight;
      var width = node.offsetWidth;

      if (height !== cache.getHeight(rowIndex, columnIndex) || width !== cache.getWidth(rowIndex, columnIndex)) {
        cache.set(rowIndex, columnIndex, width, height);

        parent.recomputeGridSize({
          columnIndex: columnIndex,
          rowIndex: rowIndex
        });
      }
    }
  }]);

  return CellMeasurer;
}(_react.PureComponent);

CellMeasurer.defaultProps = {
  style: EMPTY_OBJECT
};
exports.default = CellMeasurer;