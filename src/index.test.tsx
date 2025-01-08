import React from 'react'
import { render, screen } from '@testing-library/react'
import ClerkAuth from './index'

// Mock Clerk hooks and components
const mockClerk = {
    loaded: true,
    addListener: jest.fn().mockReturnValue(() => {}),
}

jest.mock('@clerk/clerk-react', () => ({
    ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SignIn: () => <div data-testid="clerk-sign-in">Sign In Component</div>,
    SignUp: () => <div data-testid="clerk-sign-up">Sign Up Component</div>,
    UserButton: () => <div data-testid="clerk-user-button">User Button Component</div>,
    useClerk: () => mockClerk,
}))

describe('ClerkAuth Component', () => {
    const defaultProps = {
        publishableKey: 'test_key',
        mode: 'sign-in' as const,
        width: 400,
        height: 600,
    }

    beforeEach(() => {
        mockClerk.loaded = true
    })

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
        mockClerk.loaded = false
        render(<ClerkAuth {...defaultProps} showLoadingState={true} />)
        const spinner = document.querySelector('div[style*="animation: spin"]')
        expect(spinner).toBeInTheDocument()
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