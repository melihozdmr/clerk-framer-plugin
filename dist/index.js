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
import * as React from "react";
import { addPropertyControls, ControlType } from "framer";
import { ClerkProvider, SignIn, SignUp, UserButton, useClerk } from "@clerk/clerk-react";
var defaultStyles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    errorMessage: {
        color: "#ff4444",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#fff4f4",
        border: "1px solid #ffdddd",
    },
    loadingSpinner: {
        width: "24px",
        height: "24px",
        border: "3px solid rgba(0, 0, 0, 0.1)",
        borderTopColor: "#3B82F6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
};
var LoadingSpinner = function () { return (React.createElement("div", { style: defaultStyles.loadingSpinner })); };
var ErrorBoundary = function (_a) {
    var children = _a.children;
    var _b = React.useState(false), hasError = _b[0], setHasError = _b[1];
    var _c = React.useState(null), error = _c[0], setError = _c[1];
    React.useEffect(function () {
        var handleError = function (error) {
            setHasError(true);
            setError(error.error);
        };
        window.addEventListener('error', handleError);
        return function () { return window.removeEventListener('error', handleError); };
    }, []);
    if (hasError) {
        return (React.createElement("div", { style: defaultStyles.errorMessage },
            "An error occurred: ",
            (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'));
    }
    return React.createElement(React.Fragment, null, children);
};
var ClerkComponent = function (props) {
    var clerk = useClerk();
    var mode = props.mode, showLoadingState = props.showLoadingState, buttonText = props.buttonText, redirectUrl = props.redirectUrl, allowSignUp = props.allowSignUp, socialButtonsVariant = props.socialButtonsVariant, onSignInSuccess = props.onSignInSuccess, onSignUpSuccess = props.onSignUpSuccess, onSignOutSuccess = props.onSignOutSuccess;
    React.useEffect(function () {
        if (!clerk.loaded)
            return;
        // Setup event listeners
        var signInListener = clerk.addListener(function (event) {
            if (event.user && onSignInSuccess) {
                onSignInSuccess();
            }
        });
        var signUpListener = clerk.addListener(function (event) {
            if (event.user && onSignUpSuccess) {
                onSignUpSuccess();
            }
        });
        return function () {
            signInListener();
            signUpListener();
        };
    }, [clerk.loaded, onSignInSuccess, onSignUpSuccess]);
    if (!clerk.loaded && showLoadingState) {
        return React.createElement(LoadingSpinner, null);
    }
    var commonProps = {
        routing: "path",
        redirectUrl: redirectUrl || "/",
        appearance: props.appearance,
    };
    return (React.createElement(React.Fragment, null,
        mode === "sign-in" && (React.createElement(SignIn, __assign({}, commonProps, { path: "/sign-in", signUpUrl: allowSignUp ? "/sign-up" : undefined }))),
        mode === "sign-up" && (React.createElement(SignUp, __assign({}, commonProps, { path: "/sign-up" }))),
        mode === "user-button" && (React.createElement(UserButton, { afterSignOutUrl: redirectUrl || "/sign-in", appearance: props.appearance, showName: true }))));
};
export default function ClerkAuth(props) {
    var publishableKey = props.publishableKey, width = props.width, height = props.height, _a = props.appearance, appearance = _a === void 0 ? "light" : _a, _b = props.primaryColor, primaryColor = _b === void 0 ? "#3B82F6" : _b, _c = props.borderRadius, borderRadius = _c === void 0 ? 8 : _c, buttonText = props.buttonText;
    if (!publishableKey) {
        return (React.createElement("div", { style: __assign(__assign({}, defaultStyles.container), { width: width, height: height }) },
            React.createElement("div", { style: defaultStyles.errorMessage }, "Please provide your Clerk publishable key")));
    }
    var clerkAppearance = {
        baseTheme: appearance,
        elements: {
            card: {
                borderRadius: "".concat(borderRadius, "px"),
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
            formButtonPrimary: {
                backgroundColor: primaryColor,
                borderRadius: "".concat(borderRadius, "px"),
            },
            formFieldInput: {
                borderRadius: "".concat(borderRadius, "px"),
            },
            footerActionLink: {
                color: primaryColor,
            },
            socialButtonsBlockButton: {
                borderRadius: "".concat(borderRadius, "px"),
            },
            socialButtonsIconButton: {
                borderRadius: "".concat(borderRadius, "px"),
            },
            userButtonBox: {
                borderRadius: "".concat(borderRadius, "px"),
            },
        },
        variables: {
            colorPrimary: primaryColor,
        },
    };
    return (React.createElement(ErrorBoundary, null,
        React.createElement(ClerkProvider, { publishableKey: publishableKey, appearance: clerkAppearance },
            React.createElement("div", { style: __assign(__assign({}, defaultStyles.container), { width: width, height: height }) },
                React.createElement(ClerkComponent, __assign({}, props))))));
}
// Add keyframes for the loading spinner animation
var style = document.createElement('style');
style.textContent = "\n    @keyframes spin {\n        to { transform: rotate(360deg); }\n    }\n";
document.head.appendChild(style);
addPropertyControls(ClerkAuth, {
    publishableKey: {
        type: ControlType.String,
        title: "Clerk Key",
        defaultValue: "",
    },
    mode: {
        type: ControlType.Enum,
        title: "Mode",
        options: ["sign-in", "sign-up", "user-button"],
        defaultValue: "sign-in",
    },
    appearance: {
        type: ControlType.Enum,
        title: "Theme",
        options: ["light", "dark"],
        defaultValue: "light",
    },
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#3B82F6",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 8,
        min: 0,
        max: 24,
        step: 1,
    },
    showLoadingState: {
        type: ControlType.Boolean,
        title: "Show Loading",
        defaultValue: true,
    },
    buttonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "",
    },
    redirectUrl: {
        type: ControlType.String,
        title: "Redirect URL",
        defaultValue: "/",
    },
    allowSignUp: {
        type: ControlType.Boolean,
        title: "Allow Sign Up",
        defaultValue: true,
    },
    socialButtonsVariant: {
        type: ControlType.Enum,
        title: "Social Buttons",
        options: ["iconButton", "blockButton"],
        defaultValue: "iconButton",
    },
    onSignInSuccess: {
        type: ControlType.EventHandler,
    },
    onSignUpSuccess: {
        type: ControlType.EventHandler,
    },
    onSignOutSuccess: {
        type: ControlType.EventHandler,
    },
});
