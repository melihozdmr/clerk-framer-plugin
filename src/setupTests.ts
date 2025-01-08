import '@testing-library/jest-dom'

// Mock createPortal for React components that use it
const mockCreatePortal = jest.fn((element, container) => {
    return element
})

jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: mockCreatePortal,
}))

// Mock ResizeObserver
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserverMock

// Suppress console errors during tests
console.error = jest.fn() 