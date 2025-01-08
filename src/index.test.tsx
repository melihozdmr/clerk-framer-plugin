import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClerkAuth from './index'

// Mock Clerk hooks and components
jest.mock('@clerk/clerk-react', () => ({
    ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SignIn: () => <div data-testid="clerk-sign-in">Sign In Component</div>,
    SignUp: () => <div data-testid="clerk-sign-up">Sign Up Component</div>,
    UserButton: () => <div data-testid="clerk-user-button">User Button Component</div>,
    useClerk: () => ({
        loaded: true,
        addListener: jest.fn().mockReturnValue(() => {}),
    }),
}))

describe('ClerkAuth Component', () => {
    const defaultProps = {
        publishableKey: 'test_key',
        mode: 'sign-in' as const,
        width: 400,
        height: 600,
    }

    it('shows error message when publishableKey is missing', () => {
        render(<ClerkAuth {...defaultProps} publishableKey="" />)
        expect(screen.getByText(/please provide your clerk publishable key/i)).toBeInTheDocument()
    })

    it('renders SignIn component in sign-in mode', () => {
        render(<ClerkAuth {...defaultProps} />)
        expect(screen.getByTestId('clerk-sign-in')).toBeInTheDocument()
    })

    it('renders SignUp component in sign-up mode', () => {
        render(<ClerkAuth {...defaultProps} mode="sign-up" />)
        expect(screen.getByTestId('clerk-sign-up')).toBeInTheDocument()
    })

    it('renders UserButton component in user-button mode', () => {
        render(<ClerkAuth {...defaultProps} mode="user-button" />)
        expect(screen.getByTestId('clerk-user-button')).toBeInTheDocument()
    })

    it('shows loading spinner when clerk is not loaded', () => {
        jest.spyOn(require('@clerk/clerk-react'), 'useClerk').mockImplementation(() => ({
            loaded: false,
            addListener: jest.fn().mockReturnValue(() => {}),
        }))

        render(<ClerkAuth {...defaultProps} showLoadingState={true} />)
        expect(document.querySelector('[style*="animation: spin"]')).toBeInTheDocument()
    })

    it('handles sign-in success callback', () => {
        const onSignInSuccess = jest.fn()
        const mockAddListener = jest.fn().mockReturnValue(() => {})
        
        jest.spyOn(require('@clerk/clerk-react'), 'useClerk').mockImplementation(() => ({
            loaded: true,
            addListener: mockAddListener,
        }))

        render(<ClerkAuth {...defaultProps} onSignInSuccess={onSignInSuccess} />)
        
        const [[callback]] = mockAddListener.mock.calls
        act(() => {
            callback({ user: { id: 'test' } })
        })

        expect(onSignInSuccess).toHaveBeenCalled()
    })

    it('handles error boundary', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const ErrorComponent = () => {
            React.useEffect(() => {
                throw new Error('Test error')
            }, [])
            return null
        }

        render(
            <ClerkAuth {...defaultProps}>
                <ErrorComponent />
            </ClerkAuth>
        )

        // Wait for error to be caught
        setTimeout(() => {
            expect(screen.getByText(/test error/i)).toBeInTheDocument()
            errorSpy.mockRestore()
        }, 0)
    })
}) 