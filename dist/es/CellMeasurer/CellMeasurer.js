import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';

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

    var _this = _possibleConstructorReturn(this, (CellMeasurer.__proto__ || _Object$getPrototypeOf(CellMeasurer)).call(this, props, context));

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
        var node = findDOMNode(this);
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


      var node = findDOMNode(this);
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
}(PureComponent);

CellMeasurer.defaultProps = {
  style: EMPTY_OBJECT
};
export default CellMeasurer;