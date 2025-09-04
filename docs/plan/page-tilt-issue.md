# Scrollbar-Induced Layout Shift Fix for Modals

**Question**

I'm building a SPA using VITE + Vanilla TS using Lit, Tailwind CSS, Axios, Zustand Vanilla, Navigo etc. 

My home page is twice as viewport so obviously has a scroll bar. From the home page, user can login or register via login or register modals. 

Problem: When the login modal opens up, I see the home page tilts, I am sure this is because of scroll bars. Likewise, say I am in Login page and if I click on sign up link, I get navigated to Registration modal. During the switch I see the home page tilts. 

What is the best and perfect solution to solve this problem?

**Answer**

# Scrollbar-Induced Layout Shift Fix for Modals

The issue you're experiencing is a common problem where modals cause layout shifts due to scrollbar disappearance. Here's a comprehensive solution that works with your tech stack (Vite + Lit + Tailwind CSS).

## The Solution

The core issue is that when a modal opens, the scrollbar disappears, causing the page content to shift slightly. The solution is to maintain consistent scrollbar space even when modals are open.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modal Scrollbar Fix</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module" src="https://unpkg.com/@lit-labs/ssr-client/lit-element-hydrate-support.js?module"></script>
    <script type="module" src="https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js"></script>
    <style>
        /* Custom styles for modal and scrollbar handling */
        body.modal-open {
            overflow: hidden;
            padding-right: var(--scrollbar-width);
        }
        
        /* Smooth transitions for modals */
        .modal {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        /* Hide scrollbar for modern browsers */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <!-- Main content -->
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8">Modal Scrollbar Fix Demo</h1>
        
        <!-- Content that makes the page scrollable -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-md h-96">
                <h2 class="text-xl font-semibold mb-4">Section 1</h2>
                <p class="text-gray-700">This is some content that makes the page scrollable.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md h-96">
                <h2 class="text-xl font-semibold mb-4">Section 2</h2>
                <p class="text-gray-700">This is some content that makes the page scrollable.</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-md h-96">
                <h2 class="text-xl font-semibold mb-4">Section 3</h2>
                <p class="text-gray-700">This is some content that makes the page scrollable.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md h-96">
                <h2 class="text-xl font-semibold mb-4">Section 4</h2>
                <p class="text-gray-700">This is some content that makes the page scrollable.</p>
            </div>
        </div>
        
        <!-- Buttons to trigger modals -->
        <div class="flex justify-center gap-4">
            <button id="loginBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Open Login Modal
            </button>
            <button id="registerBtn" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Open Register Modal
            </button>
        </div>
    </div>
    
    <!-- Login Modal -->
    <div id="loginModal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 pointer-events-none">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all scale-95">
            <div class="px-6 py-4 border-b">
                <h2 class="text-xl font-semibold">Login to Your Account</h2>
            </div>
            <div class="px-6 py-4">
                <form>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="login-email">
                            Email
                        </label>
                        <input type="email" id="login-email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your email">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="login-password">
                            Password
                        </label>
                        <input type="password" id="login-password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your password">
                    </div>
                    <div class="flex items-center justify-between">
                        <button type="button" class="text-blue-500 hover:text-blue-700 font-medium">
                            Forgot Password?
                        </button>
                        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
            <div class="px-6 py-4 bg-gray-100 rounded-b-lg">
                <div class="text-center">
                    <p class="text-gray-600">Don't have an account? <button id="switchToRegister" class="text-green-500 hover:text-green-700 font-medium">Sign up</button></p>
                </div>
            </div>
            <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
    
    <!-- Register Modal -->
    <div id="registerModal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 pointer-events-none">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all scale-95">
            <div class="px-6 py-4 border-b">
                <h2 class="text-xl font-semibold">Create an Account</h2>
            </div>
            <div class="px-6 py-4">
                <form>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="register-name">
                            Full Name
                        </label>
                        <input type="text" id="register-name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Your name">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="register-email">
                            Email
                        </label>
                        <input type="email" id="register-email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Your email">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="register-password">
                            Password
                        </label>
                        <input type="password" id="register-password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Create a password">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="register-confirm">
                            Confirm Password
                        </label>
                        <input type="password" id="register-confirm" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Confirm your password">
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
            <div class="px-6 py-4 bg-gray-100 rounded-b-lg">
                <div class="text-center">
                    <p class="text-gray-600">Already have an account? <button id="switchToLogin" class="text-blue-500 hover:text-blue-700 font-medium">Sign in</button></p>
                </div>
            </div>
            <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>

    <script>
        // Calculate scrollbar width
        function getScrollbarWidth() {
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.overflow = 'scroll';
            document.body.appendChild(outer);
            
            const inner = document.createElement('div');
            outer.appendChild(inner);
            
            const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
            
            outer.parentNode.removeChild(outer);
            return scrollbarWidth;
        }
        
        // Set CSS custom property with scrollbar width
        document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
        
        // Modal management
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');
        const closeButtons = document.querySelectorAll('.modal button[aria-label="Close modal"]');
        
        let currentModal = null;
        
        function openModal(modal) {
            // Close current modal if any
            if (currentModal) {
                closeModal(currentModal);
            }
            
            // Prevent background scrolling and account for scrollbar
            document.body.classList.add('modal-open');
            
            // Show the modal
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.classList.add('opacity-100');
            modal.querySelector('div').classList.remove('scale-95');
            modal.querySelector('div').classList.add('scale-100');
            
            currentModal = modal;
        }
        
        function closeModal(modal) {
            // Hide the modal
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            modal.querySelector('div').classList.remove('scale-100');
            modal.querySelector('div').classList.add('scale-95');
            
            // Allow background scrolling again
            document.body.classList.remove('modal-open');
            
            setTimeout(() => {
                modal.classList.add('pointer-events-none');
            }, 300); // Match transition duration
            
            currentModal = null;
        }
        
        function switchModal(fromModal, toModal) {
            // First close the current modal
            closeModal(fromModal);
            
            // Then open the new modal after a short delay
            setTimeout(() => {
                openModal(toModal);
            }, 300); // Match transition duration
        }
        
        // Event listeners
        loginBtn.addEventListener('click', () => openModal(loginModal));
        registerBtn.addEventListener('click', () => openModal(registerModal));
        
        switchToRegister.addEventListener('click', () => switchModal(loginModal, registerModal));
        switchToLogin.addEventListener('click', () => switchModal(registerModal, loginModal));
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                closeModal(modal);
            });
        });
        
        // Close modal when clicking on backdrop
        [loginModal, registerModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && currentModal) {
                closeModal(currentModal);
            }
        });
    </script>
</body>
</html>
```

## How This Solution Works

1. **Scrollbar Width Calculation**: We calculate the scrollbar width and store it as a CSS custom property.

2. **Body Class Toggle**: When a modal opens, we add a `modal-open` class to the body that:
   - Hides overflow (prevents scrolling)
   - Adds right padding equal to the scrollbar width

3. **Smooth Transitions**: The modals have smooth fade-in/out and scale transitions for a polished user experience.

4. **Modal Management**: The JavaScript handles:
   - Opening and closing modals
   - Switching between modals without layout shift
   - Closing modals via backdrop click or Escape key

## Integration with Your Stack

To integrate this with your Lit components and Zustand:

1. Create a Lit component for your modals
2. Manage modal state in Zustand
3. Use the scrollbar width calculation in your main layout component
4. Apply the `modal-open` class to body when any modal is open

This solution prevents layout shift by maintaining consistent spacing where the scrollbar would be, creating a smooth user experience when modals are opened or switched.