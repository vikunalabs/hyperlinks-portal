# UI Development Plan - Unstyled Components for Maximum Reusability

This document outlines the component architecture for building unstyled, reusable components with Vite + TypeScript + Lit.

## Component Development Philosophy

### Core Principles

1. **Unstyled by Default**
   - Components provide structure and functionality only
   - Styling applied via CSS classes passed as properties
   - CSS custom properties for themeable design hooks
   - Framework-agnostic and project-portable

2. **Semantic HTML Foundation**
   - Use proper HTML elements for accessibility
   - ARIA attributes for screen reader support
   - Keyboard navigation built-in
   - Progressive enhancement approach

3. **Composition Over Configuration**
   - Small, focused components with single responsibilities
   - Slot-based content projection for flexibility
   - Event-driven communication between components
   - Minimal component APIs

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

#### 7. Application Pages
- **`page-home`** - Landing page with URL shortening
- **`page-dashboard`** - User dashboard overview
- **`page-urls`** - URL management interface
- **`page-analytics`** - Statistics and reporting
- **`page-settings`** - User preferences
- **`page-not-found`** - 404 error page

#### 8. Layout Pages
- **`app-shell`** - Main application container
- **`app-header`** - Navigation header
- **`app-sidebar`** - Dashboard navigation
- **`page-container`** - Standard page wrapper

## Unstyled Component Structure

### Basic Component Template

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

## Development Priorities

### Phase 1: Foundation Components (Week 1)
1. **ui-button** - All button variants
2. **ui-input** - Text inputs with validation
3. **ui-modal** - Accessible dialog
4. **ui-notification** - User feedback
5. **ui-loading-spinner** - Loading states

### Phase 2: Form Components (Week 2)
1. **ui-select** - Dropdown selection
2. **ui-textarea** - Multi-line input
3. **ui-checkbox** - Checkbox groups
4. **ui-radio** - Radio button groups
5. **auth-login-form** - Authentication form

### Phase 3: Layout Components (Week 3)
1. **ui-card** - Content containers
2. **ui-table** - Data tables
3. **ui-tabs** - Tab interfaces
4. **ui-breadcrumb** - Navigation breadcrumbs
5. **ui-pagination** - Page navigation
6. **ui-dropdown** - Generic dropdown
7. **ui-badge** - Status indicators
8. **app-shell** - Application layout

### Phase 4: Feature Components (Week 4)
1. **url-shorten-form** - URL creation
2. **url-card** - URL display
3. **url-list** - URL management
4. **analytics-stats-card** - Metrics
5. **qr-generator** - QR codes

### Phase 5: Pages (Week 5)
1. **page-home** - Landing page
2. **page-dashboard** - User dashboard
3. **page-urls** - URL management
4. **page-analytics** - Statistics
5. **page-settings** - User preferences

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

### Reusability
- Components work with any CSS framework
- Easy to port between projects
- Consistent behavior across applications
- Minimal external dependencies

### Maintainability
- Clear separation of concerns
- Easier to test and debug
- Framework-independent updates
- Simplified component APIs

### Performance
- Smaller bundle sizes (no included CSS)
- Better tree-shaking
- Faster development cycles
- Reduced CSS conflicts