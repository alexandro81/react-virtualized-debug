import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { PropTypes, PureComponent } from 'react';

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */

var ArrowKeyStepper = function (_PureComponent) {
  _inherits(ArrowKeyStepper, _PureComponent);

  function ArrowKeyStepper(props, context) {
    _classCallCheck(this, ArrowKeyStepper);

    var _this = _possibleConstructorReturn(this, (ArrowKeyStepper.__proto__ || _Object$getPrototypeOf(ArrowKeyStepper)).call(this, props, context));

    _this.state = {
      scrollToColumn: props.scrollToColumn,
      scrollToRow: props.scrollToRow
    };

    _this._columnStartIndex = 0;
    _this._columnStopIndex = 0;
    _this._rowStartIndex = 0;
    _this._rowStopIndex = 0;

    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._onSectionRendered = _this._onSectionRendered.bind(_this);
    return _this;
  }

  _createClass(ArrowKeyStepper, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var scrollToColumn = nextProps.scrollToColumn,
          scrollToRow = nextProps.scrollToRow;
      var _state = this.state,
          prevScrollToColumn = _state.scrollToColumn,
          prevScrollToRow = _state.scrollToRow;


      if (prevScrollToColumn !== scrollToColumn && prevScrollToRow !== scrollToRow) {
        this.setState({
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        });
      } else if (prevScrollToColumn !== scrollToColumn) {
        this.setState({ scrollToColumn: scrollToColumn });
      } else if (prevScrollToRow !== scrollToRow) {
        this.setState({ scrollToRow: scrollToRow });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          children = _props.children;
      var _state2 = this.state,
          scrollToColumn = _state2.scrollToColumn,
          scrollToRow = _state2.scrollToRow;


      return React.createElement(
        'div',
        {
          className: className,
          onKeyDown: this._onKeyDown
        },
        children({
          onSectionRendered: this._onSectionRendered,
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        })
      );
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(event) {
      var _props2 = this.props,
          columnCount = _props2.columnCount,
          disabled = _props2.disabled,
          mode = _props2.mode,
          rowCount = _props2.rowCount;


      if (disabled) {
        return;
      }

      var _state3 = this.state,
          scrollToColumnPrevious = _state3.scrollToColumn,
          scrollToRowPrevious = _state3.scrollToRow;
      var _state4 = this.state,
          scrollToColumn = _state4.scrollToColumn,
          scrollToRow = _state4.scrollToRow;

      // The above cases all prevent default event event behavior.
      // This is to keep the grid from scrolling after the snap-to update.

      switch (event.key) {
        case 'ArrowDown':
          scrollToRow = mode === 'cells' ? Math.min(scrollToRow + 1, rowCount - 1) : Math.min(this._rowStopIndex + 1, rowCount - 1);
          break;
        case 'ArrowLeft':
          scrollToColumn = mode === 'cells' ? Math.max(scrollToColumn - 1, 0) : Math.max(this._columnStartIndex - 1, 0);
          break;
        case 'ArrowRight':
          scrollToColumn = mode === 'cells' ? Math.min(scrollToColumn + 1, columnCount - 1) : Math.min(this._columnStopIndex + 1, columnCount - 1);
          break;
        case 'ArrowUp':
          scrollToRow = mode === 'cells' ? Math.max(scrollToRow - 1, 0) : Math.max(this._rowStartIndex - 1, 0);
          break;
      }

      if (scrollToColumn !== scrollToColumnPrevious || scrollToRow !== scrollToRowPrevious) {
        event.preventDefault();

        this.setState({ scrollToColumn: scrollToColumn, scrollToRow: scrollToRow });
      }
    }
  }, {
    key: '_onSectionRendered',
    value: function _onSectionRendered(_ref) {
      var columnStartIndex = _ref.columnStartIndex,
          columnStopIndex = _ref.columnStopIndex,
          rowStartIndex = _ref.rowStartIndex,
          rowStopIndex = _ref.rowStopIndex;

      this._columnStartIndex = columnStartIndex;
      this._columnStopIndex = columnStopIndex;
      this._rowStartIndex = rowStartIndex;
      this._rowStopIndex = rowStopIndex;
    }
  }]);

  return ArrowKeyStepper;
}(PureComponent);

ArrowKeyStepper.defaultProps = {
  disabled: false,
  mode: 'edges',
  scrollToColumn: 0,
  scrollToRow: 0
};
export default ArrowKeyStepper;
process.env.NODE_ENV !== "production" ? ArrowKeyStepper.propTypes = {
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  columnCount: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['cells', 'edges']),
  rowCount: PropTypes.number.isRequired,
  scrollToColumn: PropTypes.number.isRequired,
  scrollToRow: PropTypes.number.isRequired
} : void 0;