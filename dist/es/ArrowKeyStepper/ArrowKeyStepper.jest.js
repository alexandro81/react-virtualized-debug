import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { render } from '../TestUtils';
import ArrowKeyStepper from './ArrowKeyStepper';
import { Simulate } from 'react-addons-test-utils';

function renderTextContent(scrollToColumn, scrollToRow) {
  return 'scrollToColumn:' + scrollToColumn + ', scrollToRow:' + scrollToRow;
}

function ChildComponent(_ref) {
  var scrollToColumn = _ref.scrollToColumn,
      scrollToRow = _ref.scrollToRow;

  return React.createElement(
    'div',
    null,
    renderTextContent(scrollToColumn, scrollToRow)
  );
}

describe('ArrowKeyStepper', function () {
  function renderHelper() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var onSectionRenderedCallback = void 0;

    var node = findDOMNode(render(React.createElement(
      ArrowKeyStepper,
      _extends({
        columnCount: 10,
        mode: 'edges',
        rowCount: 10
      }, props),
      function (_ref2) {
        var onSectionRendered = _ref2.onSectionRendered,
            scrollToColumn = _ref2.scrollToColumn,
            scrollToRow = _ref2.scrollToRow;

        onSectionRenderedCallback = onSectionRendered;

        return React.createElement(ChildComponent, {
          scrollToColumn: scrollToColumn,
          scrollToRow: scrollToRow
        });
      }
    )));

    return {
      node: node,
      onSectionRendered: onSectionRenderedCallback
    };
  }

  function assertCurrentScrollTo(node, scrollToColumn, scrollToRow) {
    expect(node.textContent).toEqual(renderTextContent(scrollToColumn, scrollToRow));
  }

  it('should use a custom :className if one is specified', function () {
    var _renderHelper = renderHelper({ className: 'foo' }),
        node = _renderHelper.node;

    expect(node.className).toEqual('foo');
  });

  it('should update :scrollToColumn and :scrollToRow in response to arrow keys', function () {
    var _renderHelper2 = renderHelper(),
        node = _renderHelper2.node;

    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, { key: 'ArrowDown' });
    assertCurrentScrollTo(node, 0, 1);
    Simulate.keyDown(node, { key: 'ArrowRight' });
    assertCurrentScrollTo(node, 1, 1);
    Simulate.keyDown(node, { key: 'ArrowUp' });
    assertCurrentScrollTo(node, 1, 0);
    Simulate.keyDown(node, { key: 'ArrowLeft' });
    assertCurrentScrollTo(node, 0, 0);
  });

  it('should not scroll past the row and column boundaries provided', function () {
    var _renderHelper3 = renderHelper({
      columnCount: 2,
      rowCount: 2
    }),
        node = _renderHelper3.node;

    Simulate.keyDown(node, { key: 'ArrowDown' });
    Simulate.keyDown(node, { key: 'ArrowDown' });
    Simulate.keyDown(node, { key: 'ArrowDown' });
    assertCurrentScrollTo(node, 0, 1);
    Simulate.keyDown(node, { key: 'ArrowUp' });
    Simulate.keyDown(node, { key: 'ArrowUp' });
    Simulate.keyDown(node, { key: 'ArrowUp' });
    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, { key: 'ArrowRight' });
    Simulate.keyDown(node, { key: 'ArrowRight' });
    Simulate.keyDown(node, { key: 'ArrowRight' });
    assertCurrentScrollTo(node, 1, 0);
    Simulate.keyDown(node, { key: 'ArrowLeft' });
    Simulate.keyDown(node, { key: 'ArrowLeft' });
    Simulate.keyDown(node, { key: 'ArrowLeft' });
    assertCurrentScrollTo(node, 0, 0);
  });

  it('should accept initial :scrollToColumn and :scrollToRow values via props', function () {
    var _renderHelper4 = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4
    }),
        node = _renderHelper4.node;

    assertCurrentScrollTo(node, 2, 4);
    Simulate.keyDown(node, { key: 'ArrowDown' });
    assertCurrentScrollTo(node, 2, 5);
    Simulate.keyDown(node, { key: 'ArrowRight' });
    assertCurrentScrollTo(node, 3, 5);
  });

  it('should accept updated :scrollToColumn and :scrollToRow values via props', function () {
    var _renderHelper5 = renderHelper({
      mode: 'cells',
      scrollToColumn: 2,
      scrollToRow: 4
    }),
        node = _renderHelper5.node;

    Simulate.keyDown(node, { key: 'ArrowDown' });
    assertCurrentScrollTo(node, 2, 5);
    renderHelper({
      mode: 'cells',
      scrollToColumn: 1,
      scrollToRow: 1
    });
    Simulate.keyDown(node, { key: 'ArrowRight' });
    assertCurrentScrollTo(node, 2, 1);
  });

  it('should not update :scrollToColumn or :scrollToRow when :disabled', function () {
    var _renderHelper6 = renderHelper({
      disabled: true
    }),
        node = _renderHelper6.node;

    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, { key: 'ArrowDown' });
    assertCurrentScrollTo(node, 0, 0);
    Simulate.keyDown(node, { key: 'ArrowRight' });
    assertCurrentScrollTo(node, 0, 0);
  });

  describe('mode === "edges"', function () {
    it('should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event', function () {
      var _renderHelper7 = renderHelper(),
          node = _renderHelper7.node,
          onSectionRendered = _renderHelper7.onSectionRendered;

      onSectionRendered({ // Simulate a scroll
        columnStartIndex: 0,
        columnStopIndex: 4,
        rowStartIndex: 4,
        rowStopIndex: 6
      });
      Simulate.keyDown(node, { key: 'ArrowDown' });
      assertCurrentScrollTo(node, 0, 7);

      onSectionRendered({ // Simulate a scroll
        columnStartIndex: 5,
        columnStopIndex: 10,
        rowStartIndex: 2,
        rowStopIndex: 4
      });
      Simulate.keyDown(node, { key: 'ArrowUp' });
      assertCurrentScrollTo(node, 0, 1);

      onSectionRendered({ // Simulate a scroll
        columnStartIndex: 4,
        columnStopIndex: 8,
        rowStartIndex: 5,
        rowStopIndex: 10
      });
      Simulate.keyDown(node, { key: 'ArrowRight' });
      assertCurrentScrollTo(node, 9, 1);

      onSectionRendered({ // Simulate a scroll
        columnStartIndex: 2,
        columnStopIndex: 4,
        rowStartIndex: 2,
        rowStopIndex: 4
      });
      Simulate.keyDown(node, { key: 'ArrowLeft' });
      assertCurrentScrollTo(node, 1, 1);
    });
  });

  describe('mode === "cells"', function () {
    it('should update :scrollToColumn and :scrollToRow relative to the most recent :onSectionRendered event', function () {
      var _renderHelper8 = renderHelper({
        mode: 'cells',
        scrollToColumn: 5,
        scrollToRow: 5
      }),
          node = _renderHelper8.node,
          onSectionRendered = _renderHelper8.onSectionRendered;

      onSectionRendered({ // Simulate a scroll
        columnStartIndex: 10,
        columnStopIndex: 10,
        rowStartIndex: 15,
        rowStopIndex: 15
      });
      Simulate.keyDown(node, { key: 'ArrowUp' });
      assertCurrentScrollTo(node, 5, 4);
      Simulate.keyDown(node, { key: 'ArrowDown' });
      assertCurrentScrollTo(node, 5, 5);

      onSectionRendered({ // Simulate a scroll
        columnStartIndex: 10,
        columnStopIndex: 10,
        rowStartIndex: 15,
        rowStopIndex: 15
      });
      Simulate.keyDown(node, { key: 'ArrowRight' });
      assertCurrentScrollTo(node, 6, 5);
      Simulate.keyDown(node, { key: 'ArrowLeft' });
      assertCurrentScrollTo(node, 5, 5);
    });
  });
});