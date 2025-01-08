# Clerk Authentication Plugin for Framer

A powerful authentication plugin that integrates Clerk.com into your Framer projects. This plugin provides a seamless authentication experience with customizable UI components and event handling.

## Features

- 🔐 Complete authentication flow (Sign In, Sign Up, User Management)
- 🎨 Customizable appearance and themes
- 🔄 Loading states and error handling
- 📱 Responsive design
- 🎯 Event callbacks for authentication actions
- 🌈 Social authentication support

## Installation

1. Open your Framer project
2. Go to Insert > Get More Plugins
3. Search for "Clerk Authentication"
4. Click Install

## Usage

### 1. Get Your Clerk API Key

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your Publishable Key

### 2. Add the Component

1. Drag the Clerk Authentication component onto your canvas
2. Paste your Publishable Key in the properties panel

### 3. Configure the Component

Choose from three modes:
- **Sign In**: Display the sign-in form
- **Sign Up**: Display the sign-up form
- **User Button**: Show the user profile button

## Properties

### Authentication
- `publishableKey`: Your Clerk publishable key
- `mode`: Component display mode (sign-in/sign-up/user-button)
- `allowSignUp`: Enable/disable sign-up option
- `redirectUrl`: URL to redirect after authentication

### Appearance
- `appearance`: Light or dark theme
- `primaryColor`: Main color for buttons and accents
- `borderRadius`: Corner roundness (0-24px)
- `showLoadingState`: Show/hide loading spinner
- `socialButtonsVariant`: Style of social login buttons

### Events
- `onSignInSuccess`: Triggered after successful sign-in
- `onSignUpSuccess`: Triggered after successful sign-up
- `onSignOutSuccess`: Triggered after sign-out

## Examples

### Basic Sign-In Form
```typescript
<ClerkAuth
    publishableKey="your_key_here"
    mode="sign-in"
    appearance="light"
/>
```

### Customized User Button
```typescript
<ClerkAuth
    publishableKey="your_key_here"
    mode="user-button"
    primaryColor="#0066FF"
    borderRadius={12}
/>
```

### Complete Auth Flow
```typescript
<ClerkAuth
    publishableKey="your_key_here"
    mode="sign-in"
    allowSignUp={true}
    redirectUrl="/dashboard"
    onSignInSuccess={() => console.log("Signed in!")}
/>
```

## Best Practices

1. **Security**
   - Always keep your Publishable Key secure
   - Use environment variables when possible
   - Never expose sensitive credentials

2. **User Experience**
   - Customize the appearance to match your brand
   - Enable loading states for better feedback
   - Provide clear error messages

3. **Integration**
   - Set up proper redirect URLs
   - Handle authentication events
   - Test all authentication flows

## Troubleshooting

### Common Issues

1. **Component Not Loading**
   - Verify your Publishable Key
   - Check internet connection
   - Ensure Clerk account is active

2. **Styling Issues**
   - Reset any conflicting CSS
   - Check theme settings
   - Verify custom color formats

3. **Authentication Errors**
   - Validate redirect URLs
   - Check Clerk dashboard settings
   - Verify API key permissions

## Support

For issues and feature requests, please visit:
- [GitHub Repository](https://github.com/your-repo/clerk-framer-plugin)
- [Clerk Documentation](https://clerk.com/docs)

## License

MIT License - see LICENSE file for details 