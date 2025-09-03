import { css } from 'lit';

// Shared modal styles using our CSS variables system
// These styles work with Shadow DOM encapsulation

export const modalBackdropStyles = css`
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-4);
  }

  .modal-backdrop.open {
    display: flex;
  }
`;

export const modalContainerStyles = css`
  .modal {
    background: white;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-height: 95vh;
    overflow-y: auto;
    animation: slideIn 0.3s ease-out;
    position: relative;
    padding: var(--spacing-6);
  }

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-var(--spacing-4)) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 640px) {
    .modal {
      max-width: 380px;
      margin: var(--spacing-4);
      padding: var(--spacing-4);
    }
  }
`;

export const modalHeaderStyles = css`
  .modal-header {
    text-align: center;
    margin-bottom: var(--spacing-6);
  }

  .modal-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 var(--spacing-2) 0;
  }

  .modal-subtitle {
    color: var(--color-gray-600);
    margin: 0;
    line-height: 1.5;
  }

  .close-btn {
    position: absolute;
    top: var(--spacing-4);
    right: var(--spacing-4);
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    cursor: pointer;
    color: var(--color-gray-600);
    width: var(--spacing-8);
    height: var(--spacing-8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    background-color: var(--color-gray-100);
    color: var(--color-gray-800);
  }
`;

export const modalFormStyles = css`
  .form-group {
    margin-bottom: var(--spacing-4);
  }

  .form-label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-gray-800);
    margin-bottom: var(--spacing-2);
  }

  .required {
    color: #ef4444;
    margin-left: var(--spacing-1);
  }

  .form-input {
    width: 100%;
    padding: var(--spacing-3) var(--spacing-4);
    border: 1px solid var(--color-gray-400);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: all var(--transition-fast);
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-input.error {
    border-color: #ef4444;
  }

  .form-error {
    color: #ef4444;
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-1);
  }

  .password-input-container {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-gray-600);
    padding: var(--spacing-1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
    width: var(--spacing-6);
    height: var(--spacing-6);
  }

  .password-toggle:hover {
    color: var(--color-gray-800);
    background-color: var(--color-gray-100);
  }

  .password-toggle svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`;

export const modalButtonStyles = css`
  .btn {
    padding: var(--spacing-3) var(--spacing-4);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    border: none;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    width: 100%;
    margin-bottom: var(--spacing-4);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-google {
    background-color: white;
    color: var(--color-gray-800);
    border: 1px solid var(--color-gray-400);
    width: 100%;
    margin-bottom: var(--spacing-2);
  }

  .btn-google:hover {
    background-color: var(--color-gray-50);
    border-color: var(--color-gray-600);
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
  }

  .checkbox {
    width: var(--spacing-4);
    height: var(--spacing-4);
    accent-color: var(--color-primary);
  }

  .checkbox-label {
    font-size: var(--font-size-sm);
    color: var(--color-gray-600);
    cursor: pointer;
  }
`;

export const modalFooterStyles = css`
  .links {
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--color-gray-600);
  }

  .link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-fast);
  }

  .link:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }

  .success-message {
    text-align: center;
    padding: var(--spacing-4) 0;
  }

  .success-icon {
    width: var(--spacing-12);
    height: var(--spacing-12);
    margin: 0 auto var(--spacing-4);
    color: #10b981;
  }

  .success-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-2);
  }

  .success-text {
    color: var(--color-gray-600);
    font-size: var(--font-size-sm);
    line-height: 1.5;
    margin-bottom: var(--spacing-6);
  }
`;

// Combined styles for easy importing
export const allModalStyles = [
  modalBackdropStyles,
  modalContainerStyles,
  modalHeaderStyles,
  modalFormStyles,
  modalButtonStyles,
  modalFooterStyles
];