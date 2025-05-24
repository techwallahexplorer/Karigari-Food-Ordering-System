// Main JavaScript for Karigari Website

// Cart state
let cartItems = [];

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
}

// Cart functions
function addToCart(item) {
    const existingItem = cartItems.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity = item.quantity;
    } else {
        cartItems.push(item);
    }
    updateCartModal();
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateCartModal();
}

function calculateTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartModal() {
    const modalBody = document.querySelector('#cart-modal .modal-body');
    const modalFooter = document.querySelector('#cart-modal .modal-footer');

    if (cartItems.length === 0) {
        modalBody.innerHTML = '<p>Your cart is empty</p>';
        modalFooter.innerHTML = `
            <button id="back-to-menu" class="back-btn">Back to Menu</button>
        `;
        return;
    }

    let total = 0;
    let cartContent = '<div class="cart-items">';

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartContent += `
            <div class="cart-item">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
                <div class="item-total">
                    <p>₹${itemTotal}</p>
                    <button onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `;
    });

    cartContent += '</div>';
    cartContent += `
        <div class="cart-total">
            <h3>Total: ₹${total}</h3>
        </div>
    `;

    modalBody.innerHTML = cartContent;
    modalFooter.innerHTML = `
        <button id="back-to-menu" class="back-btn">Back to Menu</button>
        <button id="checkout-btn" class="checkout-btn">Checkout</button>
    `;

    // Add event listeners
    document.getElementById('back-to-menu').addEventListener('click', () => closeModal('cart-modal'));
    document.getElementById('checkout-btn')?.addEventListener('click', openPaymentModal);
}

function openPaymentModal() {
    closeModal('cart-modal');
    const modal = document.getElementById('payment-modal');
    const total = calculateTotal();
    document.getElementById('qr-total').textContent = total.toFixed(2);
    openModal('payment-modal');
}

function handlePaymentConfirmation(e) {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('delivery-address').value;

    if (!name || !phone || !address) {
        alert('Please fill in all required fields');
        return;
    }

    if (!phone.match(/^[0-9]{10}$/)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Create order object
    const order = {
        customer: {
            name,
            phone,
            address
        },
        items: cartItems,
        total: calculateTotal(),
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    // Send order to server
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        alert('Order placed successfully! Your order ID is: ' + data.orderId);
        cartItems = [];
        closeModal('payment-modal');
        updateCartModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to place order. Please try again.');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners for payment modal
    document.getElementById('back-to-cart')?.addEventListener('click', () => {
        closeModal('payment-modal');
        openModal('cart-modal');
    });

    document.getElementById('confirm-payment')?.addEventListener('click', handlePaymentConfirmation);

    // Cart icon functionality
    document.getElementById('cart-icon')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('cart-modal');
    });

    // Mobile Menu Toggle Functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Initialize Tiny Slider for Popular Items
    const slider = tns({
        container: '.my-slider',
        items: 3,
        slideBy: 1,
        autoplay: false,
        controls: true,
        nav: false,
        loop: true,
        speed: 400,
        gutter: 20,
        responsive: {
            320: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Modal Functionality
    const cartModal = document.getElementById('cart-modal');
    const requestDishModal = document.getElementById('request-dish-modal');
    const cartIcon = document.getElementById('cart-icon');
    const requestDishBtn = document.getElementById('request-dish-btn');
    const backToMenuBtn = document.getElementById('back-to-menu');
    const cancelRequestBtn = document.getElementById('cancel-request');
    const submitRequestBtn = document.getElementById('submit-request');

    // Function to open a modal
    function openModal(modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }

    // Function to close a modal
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }

    // Event Listeners for opening modals
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(cartModal);
    });

    requestDishBtn.addEventListener('click', function() {
        openModal(requestDishModal);
    });

    // Event Listeners for closing modals
    backToMenuBtn.addEventListener('click', function() {
        closeModal(cartModal);
    });

    cancelRequestBtn.addEventListener('click', function() {
        closeModal(requestDishModal);
    });

    submitRequestBtn.addEventListener('click', function() {
        closeModal(requestDishModal);
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeModal(cartModal);
        }
        if (e.target === requestDishModal) {
            closeModal(requestDishModal);
        }
    });

    // Video Player Functionality
    const video = document.getElementById('promo-video');
    const playBtn = document.getElementById('play-btn');

    // Toggle play/pause on video click
    video.addEventListener('click', toggleVideo);
    playBtn.addEventListener('click', toggleVideo);

    function toggleVideo() {
        if (video.paused) {
            video.play();
            playBtn.style.display = 'none';
        } else {
            video.pause();
            playBtn.style.display = 'flex';
        }
    }

    // Show play button when video is paused
    video.addEventListener('pause', function() {
        playBtn.style.display = 'flex';
    });

    // Hide play button when video is playing
    video.addEventListener('play', function() {
        playBtn.style.display = 'none';
    });

    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const requestForm = document.getElementById('request-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactForm.reset();
            alert('Thank you for your message! We will get back to you soon.');
        });
    }


    // Hover effects for food cards
    const foodCards = document.querySelectorAll('.food-card');
    
    foodCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });

    // for counter 
    const counterContainers = document.querySelectorAll('.counter-container');

    counterContainers.forEach(container => {
        const minusBtn = container.querySelector('.minus-btn');
        const plusBtn = container.querySelector('.plus-btn');
        const countDisplay = container.querySelector('.count-display');
        const foodCard = container.closest('.food-card');
        const itemName = foodCard.querySelector('.food-name-price h3').textContent;
        const itemPrice = parseFloat(foodCard.querySelector('.food-name-price .price').textContent.replace('₹', ''));
        const itemId = foodCard.dataset.id || Math.random().toString(36).substr(2, 9);
        
        if (!foodCard.dataset.id) {
            foodCard.dataset.id = itemId;
        }

        let count = 0;

        plusBtn?.addEventListener('click', function() {
            count++;
            countDisplay.style.display = 'inline-block';
            minusBtn.style.display = 'inline-flex';
            countDisplay.textContent = count;
            container.classList.add('active');

            addToCart({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: count
            });
        });

        minusBtn?.addEventListener('click', function() {
            if (count > 0) {
                count--;
                countDisplay.textContent = count;

                if (count === 0) {
                    countDisplay.style.display = 'none';
                    minusBtn.style.display = 'none';
                    container.classList.remove('active');
                    removeFromCart(itemId);
                } else {
                    addToCart({
                        id: itemId,
                        name: itemName,
                        price: itemPrice,
                        quantity: count
                    });
                }
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
});
