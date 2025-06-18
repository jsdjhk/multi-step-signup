document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables to track form state
    const formData = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    };
    
    // Current step tracking
    let currentStep = 1;
    const totalSteps = 3;
    
    // DOM elements
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const progressBar = document.querySelector('.progress');
    
    // Navigation buttons
    const toStep2Btn = document.getElementById('toStep2');
    const backToStep1Btn = document.getElementById('backToStep1');
    const toStep3Btn = document.getElementById('toStep3');
    const backToStep2Btn = document.getElementById('backToStep2');
    const submitFormBtn = document.getElementById('submitForm');
    const loginBtn = document.getElementById('loginBtn');
    
    // Form inputs
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    
    // Validation message elements
    const fullNameValidation = document.getElementById('fullNameValidation');
    const emailValidation = document.getElementById('emailValidation');
    const passwordValidation = document.getElementById('passwordValidation');
    const confirmPasswordValidation = document.getElementById('confirmPasswordValidation');
    const termsValidation = document.getElementById('termsValidation');
    
    // Password strength elements
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const lengthRequirement = document.getElementById('length');
    const uppercaseRequirement = document.getElementById('uppercase');
    const lowercaseRequirement = document.getElementById('lowercase');
    const numberRequirement = document.getElementById('number');
    const specialRequirement = document.getElementById('special');
    
    // Initialize the form
    function initializeForm() {
        // Set up event listeners for form navigation
        toStep2Btn.addEventListener('click', () => validateAndGoToStep(2));
        backToStep1Btn.addEventListener('click', () => goToStep(1));
        toStep3Btn.addEventListener('click', () => validateAndGoToStep(3));
        backToStep2Btn.addEventListener('click', () => goToStep(2));
        submitFormBtn.addEventListener('click', submitForm);
        loginBtn.addEventListener('click', redirectToLogin);
        
        // Set up input validation events
        fullNameInput.addEventListener('input', validateFullName);
        emailInput.addEventListener('input', validateEmail);
        passwordInput.addEventListener('input', validatePassword);
        confirmPasswordInput.addEventListener('input', validateConfirmPassword);
        agreeTermsCheckbox.addEventListener('change', validateTerms);
        
        // Password toggle visibility
        const togglePasswordBtns = document.querySelectorAll('.toggle-password');
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', togglePasswordVisibility);
        });
        
        // Restore form data if available
        restoreFormData();
        
        // Set initial progress bar state
        updateProgressBar();
        
        // Add keyboard navigation support
        setupKeyboardNavigation();
    }
    
    // Set up keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Enter key to proceed to next step
            if (e.key === 'Enter') {
                if (currentStep === 1) {
                    validateAndGoToStep(2);
                } else if (currentStep === 2) {
                    validateAndGoToStep(3);
                } else if (currentStep === 3) {
                    submitForm();
                }
            }
            
            // ESC key to go back
            if (e.key === 'Escape') {
                if (currentStep === 2) {
                    goToStep(1);
                } else if (currentStep === 3) {
                    goToStep(2);
                }
            }
        });
    }
    
    // Validate full name
    function validateFullName() {
        const fullName = fullNameInput.value.trim();
        
        if (fullName === '') {
            showError(fullNameInput, fullNameValidation, 'Full name is required');
            return false;
        } else if (fullName.length < 2) {
            showError(fullNameInput, fullNameValidation, 'Name must be at least 2 characters');
            return false;
        } else {
            clearError(fullNameInput, fullNameValidation);
            formData.fullName = fullName;
            return true;
        }
    }
    
    // Validate email
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showError(emailInput, emailValidation, 'Email address is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailValidation, 'Please enter a valid email address');
            return false;
        } else {
            clearError(emailInput, emailValidation);
            formData.email = email;
            return true;
        }
    }
    
    // Validate password and update strength meter
    function validatePassword() {
        const password = passwordInput.value;
        formData.password = password;
        
        // Password requirements
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        // Update requirements list
        updateRequirement(lengthRequirement, hasMinLength);
        updateRequirement(uppercaseRequirement, hasUppercase);
        updateRequirement(lowercaseRequirement, hasLowercase);
        updateRequirement(numberRequirement, hasNumber);
        updateRequirement(specialRequirement, hasSpecial);
        
        // Calculate password strength
        let strength = 0;
        let strengthMessage = '';
        
        if (password.length > 0) {
            if (hasMinLength) strength += 1;
            if (hasUppercase) strength += 1;
            if (hasLowercase) strength += 1;
            if (hasNumber) strength += 1;
            if (hasSpecial) strength += 1;
            
            switch(strength) {
                case 1:
                    strengthBar.style.width = '20%';
                    strengthBar.style.backgroundColor = '#ef4444';
                    strengthMessage = 'Very weak';
                    break;
                case 2:
                    strengthBar.style.width = '40%';
                    strengthBar.style.backgroundColor = '#f59e0b';
                    strengthMessage = 'Weak';
                    break;
                case 3:
                    strengthBar.style.width = '60%';
                    strengthBar.style.backgroundColor = '#f59e0b';
                    strengthMessage = 'Moderate';
                    break;
                case 4:
                    strengthBar.style.width = '80%';
                    strengthBar.style.backgroundColor = '#84cc16';
                    strengthMessage = 'Strong';
                    break;
                case 5:
                    strengthBar.style.width = '100%';
                    strengthBar.style.backgroundColor = '#10b981';
                    strengthMessage = 'Very strong';
                    break;
                default:
                    strengthBar.style.width = '0%';
                    strengthMessage = 'Password strength';
            }
            
            strengthText.textContent = strengthMessage;
        } else {
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Password strength';
        }
        
        // Check if password meets all requirements
        const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
        
        if (password === '') {
            showError(passwordInput, passwordValidation, 'Password is required');
            return false;
        } else if (!isValid) {
            showError(passwordInput, passwordValidation, 'Please meet all password requirements');
            return false;
        } else {
            clearError(passwordInput, passwordValidation);
            return true;
        }
    }
    
    // Validate confirm password
    function validateConfirmPassword() {
        const confirmPassword = confirmPasswordInput.value;
        formData.confirmPassword = confirmPassword;
        
        if (confirmPassword === '') {
            showError(confirmPasswordInput, confirmPasswordValidation, 'Please confirm your password');
            return false;
        } else if (confirmPassword !== formData.password) {
            showError(confirmPasswordInput, confirmPasswordValidation, 'Passwords do not match');
            return false;
        } else {
            clearError(confirmPasswordInput, confirmPasswordValidation);
            return true;
        }
    }
    
    // Validate terms and conditions
    function validateTerms() {
        formData.agreeTerms = agreeTermsCheckbox.checked;
        
        if (!agreeTermsCheckbox.checked) {
            termsValidation.textContent = 'You must agree to the terms and conditions';
            return false;
        } else {
            termsValidation.textContent = '';
            return true;
        }
    }
    
    // Update password requirement display
    function updateRequirement(element, isValid) {
        if (isValid) {
            element.querySelector('i').className = 'fas fa-check-circle';
            element.style.color = 'var(--success-color)';
        } else {
            element.querySelector('i').className = 'fas fa-times-circle';
            element.style.color = 'var(--light-text)';
        }
    }
    
    // Show error message and highlight input
    function showError(inputElement, validationElement, message) {
        inputElement.classList.add('error');
        validationElement.textContent = message;
    }
    
    // Clear error message and remove highlight
    function clearError(inputElement, validationElement) {
        inputElement.classList.remove('error');
        validationElement.textContent = '';
    }
    
    // Toggle password visibility
    function togglePasswordVisibility(e) {
        const passwordField = e.currentTarget.closest('.input-group').querySelector('input');
        const icon = e.currentTarget.querySelector('i');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.className = 'fas fa-eye';
        } else {
            passwordField.type = 'password';
            icon.className = 'fas fa-eye-slash';
        }
    }
    
    // Validate current step and proceed if valid
    function validateAndGoToStep(step) {
        let isValid = false;
        
        // Validate based on current step
        if (currentStep === 1) {
            isValid = validateFullName() && validateEmail();
        } else if (currentStep === 2) {
            isValid = validatePassword() && validateConfirmPassword();
        } else if (currentStep === 3) {
            isValid = validateTerms();
        }
        
        // Proceed if validation passes
        if (isValid) {
            goToStep(step);
        }
    }
    
    // Navigate to specified step
    function goToStep(step) {
        // Hide current step
        steps.forEach(stepElement => {
            stepElement.classList.remove('active');
        });
        
        // Show new step
        document.getElementById(`step${step}`).classList.add('active');
        
        // Update progress and indicators
        currentStep = step;
        updateStepIndicators();
        updateProgressBar();
        
        // Save form data to preserve state
        saveFormData();
        
        // Scroll to top of form for mobile
        document.querySelector('.signup-container').scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    // Update step indicators (circles)
    function updateStepIndicators() {
        stepIndicators.forEach((indicator, index) => {
            const stepNumber = index + 1;
            
            // Reset classes
            indicator.classList.remove('active', 'completed');
            
            // Set appropriate class
            if (stepNumber === currentStep) {
                indicator.classList.add('active');
            } else if (stepNumber < currentStep) {
                indicator.classList.add('completed');
                // Replace number with check icon for completed steps
                const numberSpan = indicator.querySelector('.step-number');
                if (numberSpan.innerHTML !== '<i class="fas fa-check"></i>') {
                    numberSpan.innerHTML = '<i class="fas fa-check"></i>';
                }
            } else {
                // Restore number for future steps
                const numberSpan = indicator.querySelector('.step-number');
                numberSpan.textContent = stepNumber;
            }
        });
    }
    
    // Update progress bar
    function updateProgressBar() {
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Save form data to preserve state
    function saveFormData() {
        // Update form data from inputs
        formData.fullName = fullNameInput.value.trim();
        formData.email = emailInput.value.trim();
        formData.password = passwordInput.value;
        formData.confirmPassword = confirmPasswordInput.value;
        formData.agreeTerms = agreeTermsCheckbox.checked;
        
        // Store in a JavaScript variable - NOT using localStorage/sessionStorage
        // This is just for demonstration - in a real app with backend we'd use a more robust solution
        window.signupFormState = JSON.stringify({
            currentStep: currentStep,
            data: {
                fullName: formData.fullName,
                email: formData.email,
                // We don't store passwords, even for demo purposes
                agreeTerms: formData.agreeTerms
            }
        });
    }
    
    // Restore form data if available
    function restoreFormData() {
        if (window.signupFormState) {
            try {
                const savedState = JSON.parse(window.signupFormState);
                
                // Restore saved data
                if (savedState.data) {
                    fullNameInput.value = savedState.data.fullName || '';
                    emailInput.value = savedState.data.email || '';
                    agreeTermsCheckbox.checked = savedState.data.agreeTerms || false;
                }
                
                // Go to saved step
                if (savedState.currentStep && savedState.currentStep > 1) {
                    goToStep(savedState.currentStep);
                }
                
                // Validate restored fields
                validateFullName();
                validateEmail();
                validateTerms();
            } catch (error) {
                console.error('Error restoring form data:', error);
            }
        }
    }
    
    // Submit the form
    function submitForm() {
        // Validate the current step first
        if (!validateTerms()) {
            return;
        }
        
        // Show loading state
        submitFormBtn.disabled = true;
        submitFormBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Reset button state
            submitFormBtn.disabled = false;
            submitFormBtn.innerHTML = 'Create Account <i class="fas fa-check"></i>';
            
            // Show success screen
            steps.forEach(step => step.classList.remove('active'));
            document.getElementById('success').classList.add('active');
            
            // Clear saved form data
            window.signupFormState = null;
            
            // Log form data (in a real app, this would be sent to a server)
            console.log('Form submitted successfully:', {
                fullName: formData.fullName,
                email: formData.email,
                // Note: In a real app, we'd never log passwords, even hashed ones
                passwordLength: formData.password.length,
                termsAccepted: formData.agreeTerms
            });
        }, 1500);
    }
    
    // Redirect to login page
    function redirectToLogin() {
        // In a real app, this would redirect to a login page
        alert('In a real application, this would redirect to the login page.');
    }
    
    // Initialize the form when the DOM is loaded
    initializeForm();
});
