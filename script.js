// Modern Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavigation();
    initAnimations();
    setupScrollEffects();
    initTypingEffect();
    initContactForm();
    initAdminSystem();
});

let currentTheme = localStorage.getItem('theme') || 'light';

function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    const themeToggle = document.getElementById('theme-toggle-btn');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add animation to theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            themeBtn.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    }
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .contact-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header && window.scrollY > 100) {
            header.style.boxShadow = 'var(--shadow-medium)';
        } else if (header) {
            header.style.boxShadow = 'none';
        }
    });
}

function initTypingEffect() {
    const typingElement = document.querySelector('.hero-subtitle');
    if (!typingElement) return;

    const texts = [
        'Full Stack Developer',
        'Cloud Enthusiast',
        'CSE Student @ SRM',
        'Problem Solver',
        'Tech Innovator'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);

    const fields = contactForm.querySelectorAll('input, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.name === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
    } else if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    const errorId = field.name + '-error';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#e74c3c';
    }
    field.style.borderColor = '#e74c3c';
}

function clearFieldError(field) {
    const errorId = field.name + '-error';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    field.style.borderColor = '#ddd';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('#submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('form-success');

    const fields = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) return;

    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    try {
        // Get form data
        const formData = new FormData(form);
        const contactData = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            dateString: new Date().toLocaleString()
        };

        // Store in localStorage
        let existingContacts = JSON.parse(localStorage.getItem('contactResponses')) || [];
        existingContacts.unshift(contactData); // Add to beginning of array
        localStorage.setItem('contactResponses', JSON.stringify(existingContacts));

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
        
        form.reset();
        console.log('Contact saved to localStorage:', contactData);

        // Update responses section if it exists
        updateResponsesSection();

    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error sending your message. Please try again.');
    } finally {
        // Reset button state
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Responses Section Management
function updateResponsesSection() {
    const responsesGrid = document.getElementById('responses-grid');
    const noResponses = document.getElementById('no-responses');
    
    if (!responsesGrid) return;

    const contacts = JSON.parse(localStorage.getItem('contactResponses')) || [];
    
    if (contacts.length === 0) {
        if (noResponses) noResponses.style.display = 'block';
        // Clear any existing responses
        const existingResponses = responsesGrid.querySelectorAll('.response-card');
        existingResponses.forEach(card => card.remove());
        return;
    }

    if (noResponses) noResponses.style.display = 'none';
    
    // Clear existing responses
    const existingResponses = responsesGrid.querySelectorAll('.response-card');
    existingResponses.forEach(card => card.remove());

    // Add new responses
    contacts.forEach(contact => {
        const responseCard = createResponseCard(contact);
        responsesGrid.appendChild(responseCard);
    });
}

function createResponseCard(contact) {
    const card = document.createElement('div');
    card.className = 'response-card';
    card.innerHTML = `
        <div class="response-header">
            <div class="response-info">
                <h3 class="response-name">${escapeHtml(contact.name)}</h3>
                <span class="response-email">${escapeHtml(contact.email)}</span>
            </div>
            <div class="response-meta">
                <span class="response-date">${contact.dateString}</span>
                <button class="delete-response-btn" onclick="deleteResponse(${contact.id})" title="Delete this response">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
        <div class="response-message">
            <p>${escapeHtml(contact.message)}</p>
        </div>
        <div class="response-id">ID: ${contact.id}</div>
    `;
    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function deleteResponse(id) {
    if (!confirm('Are you sure you want to delete this response?')) return;
    
    let contacts = JSON.parse(localStorage.getItem('contactResponses')) || [];
    contacts = contacts.filter(contact => contact.id !== id);
    localStorage.setItem('contactResponses', JSON.stringify(contacts));
    updateResponsesSection();
}

function clearAllResponses() {
    if (!confirm('Are you sure you want to delete all responses? This action cannot be undone.')) return;
    
    localStorage.removeItem('contactResponses');
    updateResponsesSection();
}

function exportResponses() {
    const contacts = JSON.parse(localStorage.getItem('contactResponses')) || [];
    if (contacts.length === 0) {
        alert('No responses to export.');
        return;
    }
    
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact-responses-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Admin System Management
function initAdminSystem() {
    // Check if admin is already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }

    // Add event listeners
    const adminLoginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('admin-logout-btn');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }

    // Initialize response controls (but they won't be visible until logged in)
    setTimeout(() => {
        const clearBtn = document.getElementById('clear-responses-btn');
        const exportBtn = document.getElementById('export-responses-btn');
        
        if (clearBtn) clearBtn.addEventListener('click', clearAllResponses);
        if (exportBtn) exportBtn.addEventListener('click', exportResponses);
    }, 100);
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const passwordInput = document.getElementById('admin-password');
    const loginBtn = document.getElementById('admin-login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    const errorElement = document.getElementById('admin-password-error');
    
    const password = passwordInput.value.trim();
    const ADMIN_PASSWORD = 'admin123'; // You can change this password
    
    // Clear previous errors
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }
    passwordInput.style.borderColor = '#ddd';
    
    // Validate password
    if (!password) {
        showAdminError('Password is required');
        return;
    }
    
    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    loginBtn.disabled = true;
    
    try {
        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (password === ADMIN_PASSWORD) {
            // Successful login
            sessionStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
            form.reset();
        } else {
            // Invalid password
            showAdminError('Invalid admin password. Please try again.');
        }
    } catch (error) {
        showAdminError('Authentication failed. Please try again.');
    } finally {
        // Reset button state
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        loginBtn.disabled = false;
    }
}

function showAdminError(message) {
    const errorElement = document.getElementById('admin-password-error');
    const passwordInput = document.getElementById('admin-password');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#ef4444';
    }
    
    if (passwordInput) {
        passwordInput.style.borderColor = '#ef4444';
        passwordInput.focus();
    }
}

function showAdminPanel() {
    const loginSection = document.getElementById('admin-login-section');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginSection) {
        loginSection.style.display = 'none';
    }
    
    if (adminPanel) {
        adminPanel.style.display = 'block';
        // Add animation class after a brief delay
        setTimeout(() => {
            adminPanel.classList.add('show');
        }, 50);
        
        // Load and display responses
        updateResponsesSection();
    }
}

function handleAdminLogout() {
    if (!confirm('Are you sure you want to logout from the admin panel?')) return;
    
    // Clear session
    sessionStorage.removeItem('adminLoggedIn');
    
    // Hide admin panel and show login form
    const loginSection = document.getElementById('admin-login-section');
    const adminPanel = document.getElementById('admin-panel');
    
    if (adminPanel) {
        adminPanel.classList.remove('show');
        setTimeout(() => {
            adminPanel.style.display = 'none';
        }, 300);
    }
    
    if (loginSection) {
        setTimeout(() => {
            loginSection.style.display = 'block';
        }, 300);
    }
    
    // Clear any form data
    const adminForm = document.getElementById('admin-login-form');
    if (adminForm) {
        adminForm.reset();
    }
}
