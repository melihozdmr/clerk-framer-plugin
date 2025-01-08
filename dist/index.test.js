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
import React from 'react';
import { render, screen } from '@testing-library/react';
import ClerkAuth from './index';
// Mock Clerk hooks and components
jest.mock('@clerk/clerk-react', function () { return ({
    ClerkProvider: function (_a) {
        var children = _a.children;
        return React.createElement("div", null, children);
    },
    SignIn: function () { return React.createElement("div", { "data-testid": "clerk-sign-in" }, "Sign In Component"); },
    SignUp: function () { return React.createElement("div", { "data-testid": "clerk-sign-up" }, "Sign Up Component"); },
    UserButton: function () { return React.createElement("div", { "data-testid": "clerk-user-button" }, "User Button Component"); },
    useClerk: function () { return ({
        loaded: true,
        addListener: jest.fn().mockReturnValue(function () { }),
    }); },
}); });
describe('ClerkAuth Component', function () {
    var defaultProps = {
        publishableKey: 'test_key',
        mode: 'sign-in',
        width: 400,
        height: 600,
    };
    it('shows error message when publishableKey is missing', function () {
        render(React.createElement(ClerkAuth, __assign({}, defaultProps, { publishableKey: "" })));
        expect(screen.getByText(/please provide your clerk publishable key/i)).toBeInTheDocument();
    });
    it('renders SignIn component in sign-in mode', function () {
        render(React.createElement(ClerkAuth, __assign({}, defaultProps)));
        expect(screen.getByTestId('clerk-sign-in')).toBeInTheDocument();
    });
    it('renders SignUp component in sign-up mode', function () {
        render(React.createElement(ClerkAuth, __assign({}, defaultProps, { mode: "sign-up" })));
        expect(screen.getByTestId('clerk-sign-up')).toBeInTheDocument();
    });
    it('renders UserButton component in user-button mode', function () {
        render(React.createElement(ClerkAuth, __assign({}, defaultProps, { mode: "user-button" })));
        expect(screen.getByTestId('clerk-user-button')).toBeInTheDocument();
    });
    it('applies custom styles based on props', function () {
        var container = render(React.createElement(ClerkAuth, __assign({}, defaultProps, { primaryColor: "#FF0000", borderRadius: 16, appearance: "dark" }))).container;
        var mainDiv = container.firstChild;
        expect(mainDiv).toHaveStyle({ width: '400px', height: '600px' });
    });
});
