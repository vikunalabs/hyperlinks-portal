# UI Development Plan - Production-Ready Components with Customization Hooks

This document outlines the component architecture for building production-ready, highly customizable components with Vite + TypeScript + Lit.

## Component Development Philosophy

### Core Principles

1. **Production-Ready with Override Points**
   - Components ship with professional default styling for immediate use
   - Extensive customization via CSS custom properties and class overrides
   - Multiple layout variants and themes built-in
   - Framework-agnostic theming system for project-specific branding

2. **Semantic HTML Foundation**
   - Use proper HTML elements for accessibility
   - ARIA attributes for screen reader support
   - Keyboard navigation built-in
   - Progressive enhancement approach

3. **Flexible Composition Strategy**
   - **Foundation Components**: Small, focused components (ui-button, ui-input)
   - **Feature Components**: Mid-level business logic (auth-login-form)
   - **Page Components**: Complete, ready-to-use pages (auth-login-page)
   - Event-driven communication between all levels
   - Progressive complexity: use atomic components OR complete pages

4. **Reactive Properties**
   - Use Lit's `@property()` for external configuration
   - Use `@state()` for internal component state
   - Immutable data patterns for predictable updates
   - Automatic re-rendering on property changes

## Component Architecture

### Foundation Layer (Build First)

#### 1. Form Components
- **`ui-button`** - Configurable button with loading/disabled states
- **`ui-input`** - Text input with validation and error states
- **`ui-textarea`** - Multi-line text input
- **`ui-select`** - Dropdown selection with keyboard navigation
- **`ui-checkbox`** - Checkbox with indeterminate state
- **`ui-radio`** - Radio button groups

#### 2. Layout Components
- **`ui-modal`** - Accessible dialog with backdrop
- **`ui-card`** - Content container with slots
- **`ui-table`** - Data table with sorting capabilities
- **`ui-tabs`** - Tab interface with keyboard navigation
- **`ui-accordion`** - Collapsible content sections
- **`ui-breadcrumb`** - Navigation breadcrumbs
- **`ui-pagination`** - Page navigation with customizable controls
- **`ui-dropdown`** - Generic dropdown menu with positioning

#### 3. Feedback Components
- **`ui-notification`** - Toast/banner messages
- **`ui-loading-spinner`** - Loading indicator
- **`ui-progress`** - Progress bar with percentage
- **`ui-tooltip`** - Hover/focus tooltips
- **`ui-alert`** - Status messages with icons
- **`ui-badge`** - Status indicators and counters

### Business Logic Layer (Build Second)

#### 4. Authentication Components
- **`auth-login-form`** - Email/password form
- **`auth-register-form`** - User registration form
- **`auth-oauth-button`** - OAuth provider button
- **`auth-password-strength`** - Password validation indicator
- **`auth-email-verification`** - Email confirmation UI

#### 5. URL Management Components
- **`url-shorten-form`** - Create short URL form
- **`url-card`** - Display URL with metadata
- **`url-list`** - Paginated URL collection
- **`url-edit-form`** - Modify URL settings
- **`url-filter-search`** - Search and filter URLs

#### 6. Analytics Components
- **`analytics-stats-card`** - Metric display card
- **`analytics-chart`** - Data visualization
- **`qr-generator`** - QR code creation and display

### Page Layer (Build Third)

#### 7. Complete Page Components (NEW!)
- **`auth-login-page`** - Complete login page with OAuth and styling ✅
- **`auth-register-page`** - Complete registration with validation ✅
- **`auth-forgot-password-page`** - Complete password reset flow ✅
- **`auth-reset-password-page`** - Password reset completion (Phase 2)
- **`auth-email-verification-page`** - Email confirmation handling (Phase 2)
- **`page-home`** - Landing page with URL shortening
- **`page-dashboard`** - User dashboard overview
- **`page-urls`** - URL management interface
- **`page-analytics`** - Statistics and reporting
- **`page-settings`** - User preferences

#### 8. Layout Pages
- **`app-shell`** - Main application container
- **`app-header`** - Navigation header
- **`app-sidebar`** - Dashboard navigation
- **`page-container`** - Standard page wrapper

## Component Structure Patterns

### Two Development Approaches

#### A. Foundation Components (Unstyled/Minimal Styling)
For maximum flexibility and framework-agnostic use:

### Basic Foundation Component Template

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('ui-button')
export class UiButton extends LitElement {
  // Styling properties
  @property() classes = '';
  @property() disabledClasses = '';
  @property() loadingClasses = '';
  
  // Functional properties
  @property() type: 'button' | 'submit' | 'reset' = 'button';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;
  
  // Internal state
  @state() private isPressed = false;
  
  // Minimal styling for structure only
  static styles = css`
    :host {
      display: inline-block;
    }
    
    button {
      border: none;
      background: none;
      padding: 0;
      margin: 0;
      font: inherit;
      cursor: pointer;
      outline: none;
    }
    
    button:disabled {
      cursor: not-allowed;
    }
  `;
  
  render() {
    return html`
      <button 
        type="${this.type}"
        class="${this.getButtonClasses()}"
        ?disabled=${this.disabled || this.loading}
        @click=${this.handleClick}
        @keydown=${this.handleKeydown}
      >
        ${this.loading ? html`<slot name="loading">Loading...</slot>` : ''}
        <slot></slot>
      </button>
    `;
  }
  
  private getButtonClasses(): string {
    let classes = this.classes;
    
    if (this.disabled) {
      classes += ` ${this.disabledClasses}`;
    }
    
    if (this.loading) {
      classes += ` ${this.loadingClasses}`;
    }
    
    return classes.trim();
  }
  
  private handleClick(e: Event) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }
    
    this.dispatchEvent(new CustomEvent('ui-click', { 
      detail: { originalEvent: e },
      bubbles: true 
    }));
  }
  
  private handleKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      this.isPressed = true;
    }
  }
}
```

### Usage with Styling Framework

```html
<!-- Tailwind CSS classes applied externally -->
<ui-button 
  classes="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  disabled-classes="opacity-50 cursor-not-allowed"
  loading-classes="opacity-75"
>
  Click me
</ui-button>

<!-- Bootstrap classes -->
<ui-button classes="btn btn-primary">
  Bootstrap Button
</ui-button>

<!-- Custom CSS classes -->
<ui-button classes="my-custom-button primary-variant">
  Custom Button
</ui-button>
```

#### B. Complete Page Components (Production-Ready Styling)
For rapid development with built-in professional styling:

### Page Component Template (NEW!)

```typescript
import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AuthPageBase } from './shared/auth-page-base';
import { AUTH_EVENTS } from './shared/auth-page-types';

@customElement('auth-login-page')
export class AuthLoginPage extends AuthPageBase {
  // OAuth configuration
  @property({ type: Boolean, attribute: 'show-google-oauth' }) showGoogleOAuth = false;
  
  // Form configuration
  @property({ attribute: 'email-label' }) emailLabel = 'Email Address';
  @property({ attribute: 'submit-label' }) submitLabel = 'Sign In';
  
  // Built-in professional styling with override points
  static styles = [
    ...AuthPageBase.styles, // Includes responsive design, accessibility
    // Additional component-specific styles
  ];

  protected renderContent(): TemplateResult {
    return html`
      ${this.showGoogleOAuth ? html`
        <auth-oauth-button
          provider="google"
          @auth-oauth-click=${this.handleOAuthClick}
        >
          Continue with Google
        </auth-oauth-button>
        ${this.renderDivider('Or continue with email')}
      ` : ''}
      
      <auth-login-form
        email-label="${this.emailLabel}"
        submit-label="${this.submitLabel}"
        @auth-login-submit=${this.handleLoginSubmit}
      ></auth-login-form>
    `;
  }

  private handleLoginSubmit(event: Event) {
    const customEvent = event as CustomEvent;
    // Dispatch standardized event for integration
    this.dispatchAuthEvent(AUTH_EVENTS.LOGIN_SUCCESS, customEvent.detail);
  }
}
```

### Page Component Usage (Minimal Setup)

```html
<!-- Minimal configuration - production ready -->
<auth-login-page
  title="Sign in to your account"
  show-google-oauth="true"
  logo-src="/logo.png"
></auth-login-page>

<!-- Full customization -->
<auth-login-page
  title="Welcome Back"
  subtitle="Sign in to continue to your dashboard"
  show-google-oauth="true"
  logo-src="/logo.png"
  company-name="Your Company"
  layout="split-screen"
  background-variant="gradient"
  primary-color="#your-brand"
  font-family="Your Font"
  card-classes="your-custom-card-styles"
  auto-focus="true"
></auth-login-page>
```

### CSS Customization System

```css
/* Global theming via CSS custom properties */
:host {
  --auth-primary-color: #3b82f6;
  --auth-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --auth-card-background: white;
  --auth-card-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --auth-font-family: 'Inter', sans-serif;
  --auth-border-radius: 12px;
}

/* Project-specific overrides */
auth-login-page::part(card) {
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
```

## TypeScript Definitions

### Shared Component Interfaces

```typescript
// Base styling properties for all components
export interface ComponentStyleProps {
  classes?: string;
  hoverClasses?: string;
  activeClasses?: string;
  disabledClasses?: string;
  errorClasses?: string;
  focusClasses?: string;
}

// Form component interfaces
export interface FormFieldProps extends ComponentStyleProps {
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

// Event detail interfaces
export interface ComponentChangeEvent<T = any> {
  value: T;
  name?: string;
  originalEvent?: Event;
}

export interface ComponentClickEvent {
  originalEvent: MouseEvent;
  target: EventTarget | null;
}

// Validation interfaces
export interface ValidationRule {
  message: string;
  validator: (value: any) => boolean;
}

export interface ValidationState {
  isValid: boolean;
  errors: string[];
}
```

## Component Naming Conventions

### File Structure
```
src/
├── components/
│   ├── ui/                 # Foundation UI components
│   │   ├── button/
│   │   │   ├── ui-button.ts
│   │   │   ├── ui-button.stories.ts
│   │   │   └── index.ts
│   │   └── index.ts        # Export all UI components
│   ├── auth/              # Authentication components
│   ├── url/               # URL management components
│   ├── analytics/         # Analytics components
│   └── pages/             # Page-level components
├── types/
│   ├── components.ts      # Component type definitions
│   └── events.ts          # Custom event types
└── styles/
    ├── tokens.css         # Design tokens
    └── reset.css          # Base styles
```

### Naming Strategy
- **UI Components**: `ui-{component}` (e.g., `ui-button`, `ui-input`)
- **Feature Components**: `{feature}-{component}` (e.g., `auth-login`, `url-card`)
- **Page Components**: `page-{name}` (e.g., `page-dashboard`, `page-settings`)
- **Layout Components**: `app-{component}` (e.g., `app-shell`, `app-header`)

### Export Patterns
```typescript
// Individual component export
export { UiButton } from './ui-button';

// Grouped exports
export * from './ui';
export * from './auth';
export * from './url';

// Default exports for pages
export { default as PageDashboard } from './page-dashboard';
```

## Development Setup Requirements

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ui: resolve(__dirname, 'src/components/ui/index.ts'),
        auth: resolve(__dirname, 'src/components/auth/index.ts'),
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['lit'],
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Required Dependencies
```json
{
  "dependencies": {
    "lit": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@web/test-runner": "^0.18.0",
    "@open-wc/testing": "^4.0.0",
    "@storybook/web-components": "^7.0.0"
  }
}
```

### Development Tools
- **Lit Analyzer**: TypeScript plugin for Lit templates
- **Web Test Runner**: Testing framework for web components
- **Storybook**: Component development environment
- **Custom Elements Manifest**: Documentation generation

## Component API Design Patterns

### 1. Styling Properties
```typescript
@property() classes = '';              // Base classes
@property() hoverClasses = '';         // Hover state
@property() activeClasses = '';        // Active state
@property() disabledClasses = '';      // Disabled state
@property() errorClasses = '';         // Error state
```

### 2. Content Slots
```typescript
render() {
  return html`
    <div class="${this.classes}">
      <slot name="icon"></slot>
      <slot name="title"></slot>
      <slot></slot>
      <slot name="actions"></slot>
    </div>
  `;
}
```

### 3. Event Communication
```typescript
// Dispatch custom events with consistent naming
this.dispatchEvent(new CustomEvent('ui-change', {
  detail: { value: this.value, originalEvent: e },
  bubbles: true
}));
```

### 4. CSS Custom Properties
```css
/* Provide hooks for theming */
:host {
  --ui-primary-color: var(--primary-color, #000);
  --ui-spacing: var(--spacing, 1rem);
  --ui-border-radius: var(--border-radius, 4px);
}
```

## Development Priorities (UPDATED)

### Phase 1: Foundation Components (Week 1) ✅
1. **ui-button** - All button variants ✅
2. **ui-input** - Text inputs with validation ✅
3. **ui-modal** - Accessible dialog ✅
4. **ui-notification** - User feedback ✅
5. **ui-loading-spinner** - Loading states ✅

### Phase 2: Form Components (Week 2) ✅
1. **ui-select** - Dropdown selection ✅
2. **ui-textarea** - Multi-line input ✅
3. **ui-checkbox** - Checkbox groups ✅
4. **ui-radio** - Radio button groups ✅
5. **auth-login-form** - Authentication form ✅

### Phase 3: Complete Auth Pages (Week 3) ✅ NEW!
**🚀 Complete production-ready authentication pages:**
1. **auth-login-page** - Complete login with OAuth ✅
2. **auth-register-page** - Complete registration with validation ✅
3. **auth-forgot-password-page** - Complete password reset flow ✅
4. **auth-reset-password-page** - Password reset completion (Phase 2)
5. **auth-email-verification-page** - Email confirmation (Phase 2)

**Benefits Achieved:**
- ⚡ **95% faster development** - 400+ lines → 20 lines per page
- 🎨 **Professional styling** built-in with customization hooks
- 📱 **Responsive & accessible** out of the box
- 🔧 **Easy theming** via CSS custom properties

### Phase 4: Layout Components (Week 4)
1. **ui-card** - Content containers ✅
2. **ui-table** - Data tables ✅
3. **ui-tabs** - Tab interfaces
4. **ui-breadcrumb** - Navigation breadcrumbs
5. **ui-pagination** - Page navigation
6. **ui-dropdown** - Generic dropdown
7. **ui-badge** - Status indicators ✅
8. **app-shell** - Application layout ✅

### Phase 5: Feature Components (Week 5)
1. **url-shorten-form** - URL creation ✅
2. **url-card** - URL display ✅
3. **url-list** - URL management ✅
4. **analytics-stats-card** - Metrics ✅
5. **qr-generator** - QR codes ✅

### Phase 6: Business Pages (Week 6) - PLANNED
**Following the new complete page pattern:**
1. **business-home-page** - Landing page with URL shortening
2. **business-dashboard-page** - User dashboard overview
3. **business-urls-page** - URL management interface
4. **business-analytics-page** - Statistics and reporting
5. **business-settings-page** - User preferences

## Testing Strategy

### Component Testing
- Test component functionality without styling concerns
- Verify accessibility features work correctly
- Test event dispatching and handling
- Validate property reactivity

### Integration Testing
- Test component composition
- Verify slot content projection
- Test form validation and submission
- Check navigation and routing

## Documentation Requirements

### Component Documentation
- Property definitions and types
- Event specifications
- Slot descriptions
- Usage examples with different CSS frameworks
- Accessibility features

### Storybook Integration
- Component showcase without styling
- Examples with different CSS frameworks
- Accessibility testing integration
- Interactive property controls

## Bundle Strategy

### Component Distribution
```typescript
// Individual component imports (tree-shakable)
import { UiButton } from '@/components/ui/button';
import { UiInput } from '@/components/ui/input';

// Grouped imports for convenience
import { UiButton, UiInput, UiModal } from '@/components/ui';

// Feature-specific bundles
import { AuthLogin, AuthRegister } from '@/components/auth';
import { UrlCard, UrlList } from '@/components/url';
```

### Build Optimization
- **Tree Shaking**: Each component as separate module
- **Code Splitting**: Route-based page component loading
- **Bundle Analysis**: Monitor component bundle sizes
- **Lazy Loading**: Dynamic imports for heavy components

### Library Export Strategy
```typescript
// Main entry point
export * from './components/ui';
export * from './components/auth';
export * from './components/url';
export * from './components/analytics';
export * from './types';

// Selective exports for smaller bundles
export { UiButton, UiInput, UiModal } from './components/ui';
```

## Testing Framework Integration

### Component Testing Setup
```typescript
// Web Test Runner configuration
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'src/**/*.test.ts',
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  coverage: true,
  coverageConfig: {
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
```

### Testing Patterns
```typescript
// Component test example
import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import './ui-button';

describe('UiButton', () => {
  it('renders with default properties', async () => {
    const el = await fixture(html`<ui-button>Click me</ui-button>`);
    expect(el.shadowRoot?.textContent?.trim()).to.equal('Click me');
  });

  it('dispatches ui-click event', async () => {
    const el = await fixture(html`<ui-button>Click me</ui-button>`);
    let eventFired = false;
    
    el.addEventListener('ui-click', () => {
      eventFired = true;
    });
    
    const button = el.shadowRoot?.querySelector('button');
    button?.click();
    
    expect(eventFired).to.be.true;
  });
});
```

## Accessibility Standards

### WCAG 2.1 Compliance
- **Level AA** conformance for all components
- **Keyboard Navigation** support
- **Screen Reader** compatibility
- **Color Contrast** requirements
- **Focus Management** patterns

### Testing Tools Integration
```typescript
// Accessibility testing
import { fixture, expect } from '@open-wc/testing';
import { axeConfig, toHaveNoViolations } from '@open-wc/testing-helpers';

expect.extend({ toHaveNoViolations });

it('should be accessible', async () => {
  const el = await fixture(html`<ui-button>Accessible Button</ui-button>`);
  await expect(el).toHaveNoViolations(axeConfig);
});
```

## Migration Benefits

### Two-Tier Architecture Advantages

#### Foundation Components (Unstyled)
- **Maximum Flexibility**: Work with any CSS framework or design system
- **Lightweight**: No included styling reduces bundle size
- **Framework Agnostic**: Easy to port between projects and tech stacks
- **Developer Control**: Complete styling control for unique designs

#### Page Components (Production-Ready)
- **Rapid Development**: 95% reduction in boilerplate code
- **Professional Quality**: Built-in responsive design and accessibility
- **Consistency**: Uniform UX across all authentication flows
- **Customizable**: Extensive theming via CSS custom properties and attributes

### Business Impact

#### Development Velocity
- **Authentication Pages**: Reduced from weeks to hours of implementation
- **Project Setup**: New projects get professional auth UI immediately  
- **Team Efficiency**: Designers focus on unique features, not common patterns
- **Maintenance**: Single source of truth for authentication UX

#### Quality Assurance
- **Accessibility**: WCAG 2.1 AA compliance built-in
- **Mobile-First**: Responsive design tested across devices
- **Security**: Built-in form validation and CSRF protection
- **Browser Support**: Consistent behavior across modern browsers

#### Cost Benefits
- **Reduced QA Time**: Pre-tested components reduce bug discovery cycles
- **Designer Freedom**: Save time on auth flows, focus on unique features
- **Developer Onboarding**: New team members productive immediately
- **Multi-Project ROI**: Single library investment benefits all projects

### Technical Excellence

#### Architecture Quality
- **Event-Driven**: Clean integration without tight coupling
- **Composable**: Mix foundation and page components as needed
- **Type Safe**: Full TypeScript support with comprehensive interfaces
- **Framework Ready**: Easy integration with React, Vue, Angular, or Vanilla

#### Performance Optimized
- **Tree Shakable**: Import only components you use
- **Lazy Loadable**: Page components support dynamic imports  
- **CSS Efficient**: Custom properties avoid style duplication
- **Bundle Analyzed**: Optimized for minimal impact on application bundles

### Real-World Results

Based on our Hyperlinks Management Platform implementation:

#### Before (Custom Implementation)
```
Login Page:     ~400 lines (HTML + CSS + JS + validation)
Register Page:  ~450 lines (HTML + CSS + JS + validation)  
Forgot Page:    ~350 lines (HTML + CSS + JS + validation)
Total:          ~1,200 lines + extensive testing + maintenance
```

#### After (UI Library Page Components)  
```
Login Page:     ~20 lines (configuration + event handling)
Register Page:  ~25 lines (configuration + event handling)
Forgot Page:    ~20 lines (configuration + event handling)  
Total:          ~65 lines + zero styling + zero validation code
```

**Result: 95% reduction in authentication code while improving quality and consistency.**

This approach transforms authentication development from a major undertaking to a simple configuration task, allowing teams to focus on unique business features while maintaining professional, accessible user experiences.