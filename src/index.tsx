import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { ClerkProvider, SignIn, SignUp, UserButton, useClerk } from "@clerk/clerk-react"
import type { Appearance } from "@clerk/types"

interface Props {
    publishableKey: string
    mode: "sign-in" | "sign-up" | "user-button"
    width: number
    height: number
    appearance?: "light" | "dark"
    primaryColor?: string
    borderRadius?: number
    showLoadingState?: boolean
    buttonText?: string
    redirectUrl?: string
    allowSignUp?: boolean
    socialButtonsVariant?: "iconButton" | "blockButton"
    onSignInSuccess?: () => void
    onSignUpSuccess?: () => void
    onSignOutSuccess?: () => void
}

const defaultStyles = {
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
}

const LoadingSpinner = () => (
    <div style={defaultStyles.loadingSpinner} />
)

const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [hasError, setHasError] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)

    React.useEffect(() => {
        const handleError = (error: ErrorEvent) => {
            setHasError(true)
            setError(error.error)
        }

        window.addEventListener('error', handleError)
        return () => window.removeEventListener('error', handleError)
    }, [])

    if (hasError) {
        return (
            <div style={defaultStyles.errorMessage}>
                An error occurred: {error?.message || 'Unknown error'}
            </div>
        )
    }

    return <>{children}</>
}

const ClerkComponent: React.FC<Props> = (props) => {
    const clerk = useClerk()
    const { 
        mode, 
        showLoadingState,
        buttonText,
        redirectUrl,
        allowSignUp,
        socialButtonsVariant,
        onSignInSuccess,
        onSignUpSuccess,
        onSignOutSuccess
    } = props

    React.useEffect(() => {
        if (!clerk.loaded) return

        // Setup event listeners
        const signInListener = clerk.addListener((event: any) => {
            if (event.user && onSignInSuccess) {
                onSignInSuccess()
            }
        })

        const signUpListener = clerk.addListener((event: any) => {
            if (event.user && onSignUpSuccess) {
                onSignUpSuccess()
            }
        })

        return () => {
            signInListener()
            signUpListener()
        }
    }, [clerk.loaded, onSignInSuccess, onSignUpSuccess])

    if (!clerk.loaded && showLoadingState) {
        return <LoadingSpinner />
    }

    const commonProps = {
        routing: "path" as const,
        redirectUrl: redirectUrl || "/",
        appearance: props.appearance as any,
    }

    return (
        <>
            {mode === "sign-in" && (
                <SignIn 
                    {...commonProps}
                    path="/sign-in"
                    signUpUrl={allowSignUp ? "/sign-up" : undefined}
                />
            )}
            {mode === "sign-up" && (
                <SignUp 
                    {...commonProps}
                    path="/sign-up"
                />
            )}
            {mode === "user-button" && (
                <UserButton 
                    afterSignOutUrl={redirectUrl || "/sign-in"}
                    appearance={props.appearance as any}
                    showName={true}
                />
            )}
        </>
    )
}

export default function ClerkAuth(props: Props) {
    const { 
        publishableKey, 
        width, 
        height, 
        appearance = "light",
        primaryColor = "#3B82F6",
        borderRadius = 8,
        buttonText,
    } = props

    if (!publishableKey) {
        return (
            <div style={{ ...defaultStyles.container, width, height }}>
                <div style={defaultStyles.errorMessage}>
                    Please provide your Clerk publishable key
                </div>
            </div>
        )
    }

    const clerkAppearance: Appearance = {
        baseTheme: (appearance as any),
        elements: {
            card: {
                borderRadius: `${borderRadius}px`,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
            formButtonPrimary: {
                backgroundColor: primaryColor,
                borderRadius: `${borderRadius}px`,
            },
            formFieldInput: {
                borderRadius: `${borderRadius}px`,
            },
            footerActionLink: {
                color: primaryColor,
            },
            socialButtonsBlockButton: {
                borderRadius: `${borderRadius}px`,
            },
            socialButtonsIconButton: {
                borderRadius: `${borderRadius}px`,
            },
            userButtonBox: {
                borderRadius: `${borderRadius}px`,
            },
        },
        variables: {
            colorPrimary: primaryColor,
        },
    }

    return (
        <ErrorBoundary>
            <ClerkProvider 
                publishableKey={publishableKey}
                appearance={clerkAppearance}
            >
                <div style={{ ...defaultStyles.container, width, height }}>
                    <ClerkComponent {...props} />
                </div>
            </ClerkProvider>
        </ErrorBoundary>
    )
}

// Add keyframes for the loading spinner animation
const style = document.createElement('style')
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`
document.head.appendChild(style)

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
}) 