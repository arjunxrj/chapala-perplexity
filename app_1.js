// Restaurant Menu App with Ordering System

// Global cart state
let cart = [];
let orderNumber = 1000;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Casa Chapala Menu with Ordering: Initializing...');
    initMobileNavigation();
    initSmoothScrolling();
    initSearchFunctionality();
    initActiveNavigation();
    initScrollToTopOnLoad();
    initAccessibility();
    initOrderingSystem();
    console.log('Casa Chapala Menu: All functions initialized');
});

// Initialize Ordering System
function initOrderingSystem() {
    console.log('Initializing ordering system...');
    
    // Add event listeners to all "Add to Order" buttons
    document.querySelectorAll('.btn--add-to-order').forEach(button => {
        button.addEventListener('click', handleAddToOrder);
    });
    
    // Cart toggle functionality
    const cartSummary = document.getElementById('cart-summary');
    const cart = document.getElementById('cart');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    
    if (cartSummary) {
        cartSummary.addEventListener('click', toggleCart);
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    // Finalize order button
    const finalizeBtn = document.getElementById('finalize-order');
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', showOrderSummary);
    }
    
    // Modal functionality
    initModals();
    
    console.log('Ordering system initialized');
}

// Handle Add to Order button clicks
function handleAddToOrder(event) {
    const button = event.target;
    const menuItem = button.closest('.menu-item');
    
    // Get item data from button attributes or menu item
    const itemName = button.getAttribute('data-name') || menuItem.getAttribute('data-name');
    const itemPrice = parseFloat(button.getAttribute('data-price') || menuItem.getAttribute('data-price'));
    const itemCategory = menuItem.getAttribute('data-category') || 'Other';
    
    // Create item object
    const item = {
        id: generateItemId(itemName),
        name: itemName,
        price: itemPrice,
        category: itemCategory,
        quantity: 1,
        notes: ''
    };
    
    // Add visual feedback
    button.classList.add('adding');
    setTimeout(() => {
        button.classList.remove('adding');
        button.classList.add('success');
        setTimeout(() => button.classList.remove('success'), 1000);
    }, 300);
    
    // Add to cart
    addToCart(item);
    
    console.log('Added to cart:', item);
}

// Generate unique item ID
function generateItemId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
}

// Add item to cart
function addToCart(newItem) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.name === newItem.name && item.notes === newItem.notes
    );
    
    if (existingItemIndex > -1) {
        // Increase quantity if item exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push(newItem);
    }
    
    updateCartDisplay();
    showCart();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    
    if (cart.length === 0) {
        hideCart();
    }
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            cart[itemIndex].quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

// Update item notes
function updateNotes(itemId, notes) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        cart[itemIndex].notes = notes;
    }
}

// Calculate cart totals
function calculateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0825; // 8.25% tax
    const total = subtotal + tax;
    
    return {
        subtotal: subtotal,
        tax: tax,
        total: total
    };
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartFinalTotal = document.getElementById('cart-final-total');
    const cartItems = document.getElementById('cart-items');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totals = calculateTotals();
    
    // Update summary
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = totals.total.toFixed(2);
    if (cartSubtotal) cartSubtotal.textContent = totals.subtotal.toFixed(2);
    if (cartTax) cartTax.textContent = totals.tax.toFixed(2);
    if (cartFinalTotal) cartFinalTotal.textContent = totals.total.toFixed(2);
    
    // Update items list
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty__icon">🛒</div>
                    <p>Your cart is empty</p>
                    <p>Add some delicious items to get started!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item__info">
                        <div class="cart-item__name">${item.name}</div>
                        <div class="cart-item__price">$${item.price.toFixed(2)} each</div>
                        <textarea 
                            class="cart-item__notes" 
                            placeholder="Add special instructions..."
                            onchange="updateNotes('${item.id}', this.value)"
                        >${item.notes}</textarea>
                    </div>
                    <div class="cart-item__controls">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Show cart
function showCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.remove('hidden');
    }
}

// Hide cart
function hideCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.add('hidden');
        cartElement.classList.remove('expanded');
    }
}

// Toggle cart expansion
function toggleCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement && cart.length > 0) {
        cartElement.classList.toggle('expanded');
    }
}

// Close cart (collapse)
function closeCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.remove('expanded');
    }
}

// Show order summary modal
function showOrderSummary() {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add some items before finalizing your order.');
        return;
    }
    
    const modal = document.getElementById('order-modal');
    const orderItems = document.getElementById('order-items');
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderTax = document.getElementById('order-tax');
    const orderTotal = document.getElementById('order-total');
    
    const totals = calculateTotals();
    
    // Populate order items
    if (orderItems) {
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item__info">
                    <div class="order-item__name">${item.name}</div>
                    ${item.notes ? `<div class="order-item__notes">Note: ${item.notes}</div>` : ''}
                </div>
                <div class="order-item__quantity">×${item.quantity}</div>
                <div class="order-item__price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    // Update totals
    if (orderSubtotal) orderSubtotal.textContent = totals.subtotal.toFixed(2);
    if (orderTax) orderTax.textContent = totals.tax.toFixed(2);
    if (orderTotal) orderTotal.textContent = totals.total.toFixed(2);
    
    // Show modal
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Initialize modal functionality
function initModals() {
    // Order Modal
    const orderModal = document.getElementById('order-modal');
    const modalClose = document.getElementById('modal-close');
    const backToMenu = document.getElementById('back-to-menu');
    const placeOrder = document.getElementById('place-order');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            orderModal.classList.add('hidden');
        });
    }
    
    if (backToMenu) {
        backToMenu.addEventListener('click', () => {
            orderModal.classList.add('hidden');
        });
    }
    
    if (placeOrder) {
        placeOrder.addEventListener('click', handlePlaceOrder);
    }
    
    // Confirmation Modal
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationClose = document.getElementById('confirmation-close');
    const startNewOrder = document.getElementById('start-new-order');
    
    if (confirmationClose) {
        confirmationClose.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
        });
    }
    
    if (startNewOrder) {
        startNewOrder.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
            resetOrder();
        });
    }
    
    // Close modals when clicking backdrop
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__backdrop') || e.target.classList.contains('modal')) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });
}

// Handle place order
function handlePlaceOrder() {
    const form = document.getElementById('order-form');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const customerEmail = document.getElementById('customer-email');
    const orderType = document.querySelector('input[name="order-type"]:checked');
    
    // Validate required fields
    if (!customerName.value.trim()) {
        customerName.focus();
        alert('Please enter your name.');
        return;
    }
    
    if (!customerPhone.value.trim()) {
        customerPhone.focus();
        alert('Please enter your phone number.');
        return;
    }
    
    // Generate order number
    const currentOrderNumber = orderNumber++;
    const totals = calculateTotals();
    
    // Show confirmation modal
    showOrderConfirmation({
        orderNumber: currentOrderNumber,
        customerName: customerName.value.trim(),
        customerPhone: customerPhone.value.trim(),
        customerEmail: customerEmail.value.trim(),
        orderType: orderType ? orderType.value : 'pickup',
        total: totals.total
    });
    
    // Hide order modal
    document.getElementById('order-modal').classList.add('hidden');
}

// Show order confirmation
function showOrderConfirmation(orderData) {
    const confirmationModal = document.getElementById('confirmation-modal');
    const orderNumberEl = document.getElementById('order-number');
    const confirmationName = document.getElementById('confirmation-name');
    const confirmationPhone = document.getElementById('confirmation-phone');
    const confirmationType = document.getElementById('confirmation-type');
    const confirmationTotal = document.getElementById('confirmation-total');
    
    // Populate confirmation details
    if (orderNumberEl) orderNumberEl.textContent = orderData.orderNumber;
    if (confirmationName) confirmationName.textContent = orderData.customerName;
    if (confirmationPhone) confirmationPhone.textContent = orderData.customerPhone;
    if (confirmationType) confirmationType.textContent = orderData.orderType.charAt(0).toUpperCase() + orderData.orderType.slice(1);
    if (confirmationTotal) confirmationTotal.textContent = orderData.total.toFixed(2);
    
    // Show confirmation modal
    if (confirmationModal) {
        confirmationModal.classList.remove('hidden');
    }
    
    console.log('Order placed:', orderData);
}

// Reset order (clear cart and forms)
function resetOrder() {
    cart = [];
    updateCartDisplay();
    hideCart();
    
    // Clear form fields
    const form = document.getElementById('order-form');
    if (form) {
        form.reset();
    }
    
    // Reset order type to pickup
    const pickupRadio = document.querySelector('input[name="order-type"][value="pickup"]');
    if (pickupRadio) {
        pickupRadio.checked = true;
    }
}

// Mobile Navigation Toggle (existing functionality)
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    console.log('Mobile nav elements:', { navToggle, navMenu });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            console.log('Mobile menu toggled:', !isActive);
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (!isActive) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                // Reset hamburger animation
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    }
}

// Smooth Scrolling Navigation (existing functionality)
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach((link, index) => {
        console.log(`Nav link ${index}:`, link.getAttribute('href'));
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this.getAttribute('href'));
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            console.log('Target section found:', !!targetSection);
            
            if (targetSection) {
                const navElement = document.querySelector('.nav');
                const navHeight = navElement ? navElement.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                console.log('Scrolling to position:', targetPosition);
                
                // Clear any existing search to show all sections
                const searchInput = document.getElementById('search-input');
                if (searchInput && searchInput.value.trim()) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                }
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Update active state immediately
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Search Functionality (existing functionality)
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    console.log('Search input found:', !!searchInput);
    
    if (searchInput) {
        // Add search icon and clear button
        const searchContainer = searchInput.parentElement;
        searchContainer.style.position = 'relative';
        
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = '×';
        clearBtn.type = 'button';
        clearBtn.style.cssText = `
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: var(--color-text-secondary);
            padding: 4px;
            display: none;
            z-index: 10;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            line-height: 1;
        `;
        clearBtn.addEventListener('click', function() {
            console.log('Clear button clicked');
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
        searchContainer.appendChild(clearBtn);
        
        // Real-time search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            console.log('Search term:', searchTerm);
            
            const menuItems = document.querySelectorAll('.menu-item');
            const sections = document.querySelectorAll('.menu-section');
            let hasResults = false;
            let totalVisible = 0;
            
            // Show/hide clear button
            clearBtn.style.display = searchTerm ? 'block' : 'none';
            
            // If search is empty, show everything
            if (searchTerm === '') {
                menuItems.forEach(item => {
                    item.classList.remove('hidden', 'highlight');
                    // Remove highlighting
                    const title = item.querySelector('h4');
                    const desc = item.querySelector('.description');
                    if (title && title.innerHTML.includes('<mark>')) {
                        title.innerHTML = title.textContent;
                    }
                    if (desc && desc.innerHTML.includes('<mark>')) {
                        desc.innerHTML = desc.textContent;
                    }
                });
                
                sections.forEach(section => {
                    section.style.display = 'block';
                });
                
                showNoResultsMessage(false);
                updateSearchResultsCount(0, '');
                return;
            }
            
            // Filter and highlight items
            menuItems.forEach(item => {
                const title = item.querySelector('h4');
                const description = item.querySelector('.description');
                
                // Get original text content
                let titleText = '';
                let descText = '';
                
                if (title) {
                    titleText = title.textContent.toLowerCase();
                }
                if (description) {
                    descText = description.textContent.toLowerCase();
                }
                
                const titleMatches = titleText.includes(searchTerm);
                const descMatches = descText.includes(searchTerm);
                const matches = titleMatches || descMatches;
                
                if (matches) {
                    item.classList.remove('hidden');
                    item.classList.add('highlight');
                    hasResults = true;
                    totalVisible++;
                    
                    // Highlight matching text
                    if (titleMatches && title) {
                        const originalText = title.textContent;
                        title.innerHTML = highlightSearchTerm(originalText, searchTerm);
                    }
                    if (descMatches && description) {
                        const originalText = description.textContent;
                        description.innerHTML = highlightSearchTerm(originalText, searchTerm);
                    }
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('highlight');
                    
                    // Remove highlighting for hidden items
                    if (title && title.innerHTML.includes('<mark>')) {
                        title.innerHTML = title.textContent;
                    }
                    if (description && description.innerHTML.includes('<mark>')) {
                        description.innerHTML = description.textContent;
                    }
                }
            });
            
            console.log(`Search results: ${totalVisible} items found for "${searchTerm}"`);
            
            // Hide sections with no visible items
            sections.forEach(section => {
                const visibleItems = section.querySelectorAll('.menu-item:not(.hidden)');
                if (visibleItems.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });
            
            // Show no results message
            showNoResultsMessage(!hasResults);
            
            // Update search results count
            updateSearchResultsCount(totalVisible, searchTerm);
        });
        
        // Clear search on escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.dispatchEvent(new Event('input'));
                this.blur();
            }
        });
        
        // Handle Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Focus first visible result
                const firstVisible = document.querySelector('.menu-item.highlight');
                if (firstVisible) {
                    firstVisible.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }
        });
        
        // Initial state
        console.log('Search functionality initialized');
    }
}

// Update search results count
function updateSearchResultsCount(count, searchTerm) {
    let countElement = document.getElementById('search-results-count');
    
    if (count > 0 && searchTerm) {
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.id = 'search-results-count';
            countElement.style.cssText = `
                text-align: center;
                padding: var(--space-16);
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
                background: var(--color-bg-3);
                margin: var(--space-16) 0;
                border-radius: var(--radius-base);
                border: 1px solid var(--color-border);
            `;
            const mainContent = document.querySelector('.main .container');
            mainContent.insertBefore(countElement, mainContent.firstChild);
        }
        countElement.textContent = `Found ${count} item${count === 1 ? '' : 's'} matching "${searchTerm}"`;
        countElement.style.display = 'block';
    } else if (countElement) {
        countElement.style.display = 'none';
    }
}

// Show/hide no results message
function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results__content">
                <h3>🔍 No menu items found</h3>
                <p>Try searching for something else or browse our full menu below.</p>
                <button onclick="document.getElementById('search-input').value=''; document.getElementById('search-input').dispatchEvent(new Event('input'));" class="btn btn--secondary btn--sm">Clear Search</button>
            </div>
        `;
        
        const mainContent = document.querySelector('.main .container');
        mainContent.insertBefore(noResultsMsg, mainContent.firstChild);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Active Navigation Highlighting (existing functionality)
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    const sections = document.querySelectorAll('.menu-section');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 120; // Offset for sticky nav
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // If no section is detected, use the first visible section
        if (!currentSection) {
            const visibleSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 120 && rect.bottom > 120;
            });
            if (visibleSection) {
                currentSection = visibleSection.id;
            }
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateActiveNav();
}

// Scroll to top on page load (existing functionality)
function initScrollToTopOnLoad() {
    window.addEventListener('load', function() {
        if (window.location.hash) {
            // Small delay to ensure page is fully loaded
            setTimeout(function() {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    });
}

// Utility function to highlight search terms
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return text;
    
    // Escape special regex characters
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Allow Ctrl+F or Cmd+F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
});

// Add accessibility improvements
function initAccessibility() {
    // Add ARIA labels to interactive elements
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.setAttribute('aria-label', 'Search menu items');
        searchInput.setAttribute('role', 'searchbox');
        searchInput.setAttribute('autocomplete', 'off');
        searchInput.setAttribute('spellcheck', 'false');
        searchInput.setAttribute('placeholder', 'Search menu items...');
    }
    
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', function() {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
        });
    }
    
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only skip-link';
    skipLink.addEventListener('focus', function() {
        this.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', function() {
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ID to main content for skip link
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main-content';
        main.setAttribute('tabindex', '-1');
    }
    
    // Improve focus management
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'article');
        item.setAttribute('aria-labelledby', `menu-item-${index}`);
        
        const title = item.querySelector('h4');
        if (title) {
            title.id = `menu-item-${index}`;
        }
    });
}

// Performance optimization: Add loading state
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('Casa Chapala Menu: Fully loaded');
    
    // Remove loading styles after a short delay
    setTimeout(() => {
        const loadingStyle = document.querySelector('style[data-loading]');
        if (loadingStyle) {
            loadingStyle.remove();
        }
    }, 500);
});

// Add initial loading styles
const loadingStyle = document.createElement('style');
loadingStyle.setAttribute('data-loading', 'true');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Casa Chapala Menu Error: ', e.message);
});

// Initialize service worker for offline functionality (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Only register if we're not in development
        if (location.protocol === 'https:' || location.hostname === 'localhost') {
            navigator.serviceWorker.register('/sw.js').catch(function(error) {
                // Silent fail - service worker is optional
            });
        }
    });
}

// Debug functions for testing
window.testSearch = function(term) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = term;
        searchInput.dispatchEvent(new Event('input'));
        console.log('Test search executed for:', term);
    }
};

window.testNavigation = function(sectionId) {
    const link = document.querySelector(`a[href="#${sectionId}"]`);
    if (link) {
        link.click();
        console.log('Test navigation executed for:', sectionId);
    }
};

// Debug cart functions
window.testAddToCart = function(itemName, price) {
    const item = {
        id: generateItemId(itemName),
        name: itemName,
        price: parseFloat(price),
        category: 'Test',
        quantity: 1,
        notes: ''
    };
    addToCart(item);
    console.log('Test item added to cart:', item);
};

window.clearCart = function() {
    resetOrder();
    console.log('Cart cleared');
};

// Expose cart functions globally for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.updateNotes = updateNotes;