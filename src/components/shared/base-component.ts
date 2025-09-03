import { LitElement, css, unsafeCSS } from 'lit';
import { baseStyles, utilityStyles } from '../../styles/base';
import tailwindStyles from '@/styles/main.css?inline';
import { themeStyles } from '@/styles/themes';

/**
 * Base component that all components should extend
 * Provides common styles and utilities
 */
export abstract class BaseComponent extends LitElement {
  static styles = [
    unsafeCSS(tailwindStyles),
    themeStyles,
    baseStyles,
    utilityStyles,
    css`
      /* Component-specific overrides can be added here */
    `
  ];
}