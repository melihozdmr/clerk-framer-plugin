var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import '@testing-library/jest-dom';
// Mock createPortal for React components that use it
var mockCreatePortal = jest.fn(function (element, container) {
    return element;
});
jest.mock('react-dom', function () { return (__assign(__assign({}, jest.requireActual('react-dom')), { createPortal: mockCreatePortal })); });
// Mock ResizeObserver
var ResizeObserverMock = /** @class */ (function () {
    function ResizeObserverMock() {
    }
    ResizeObserverMock.prototype.observe = function () { };
    ResizeObserverMock.prototype.unobserve = function () { };
    ResizeObserverMock.prototype.disconnect = function () { };
    return ResizeObserverMock;
}());
window.ResizeObserver = ResizeObserverMock;
// Suppress console errors during tests
console.error = jest.fn();
