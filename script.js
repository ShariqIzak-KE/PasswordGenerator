const passwordInput = document.getElementById('password');
const copyBtn = document.getElementById('copy-btn');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const strengthText = document.getElementById('strength-text');

// Update displayed length
lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
});

// Generate password using crypto (secure)
function generatePassword() {
    const length = parseInt(lengthInput.value);
    let charset = '';
    let password = '';

    if (lowercaseCheck.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercaseCheck.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbersCheck.checked) charset += '0123456789';
    if (symbolsCheck.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        alert('Please select at least one character type!');
        return;
    }

    // Use cryptographically secure random values
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    // Ensure at least one character from each selected type
    if (lowercaseCheck.checked) password = guaranteeChar(password, 'abcdefghijklmnopqrstuvwxyz');
    if (uppercaseCheck.checked) password = guaranteeChar(password, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (numbersCheck.checked) password = guaranteeChar(password, '0123456789');
    if (symbolsCheck.checked) password = guaranteeChar(password, '!@#$%^&*()_+-=[]{}|;:,.<>?');

    return password;
}

function guaranteeChar(password, chars) {
    if (password.split('').some(c => chars.includes(c))) return password;
    const pos = Math.floor(Math.random() * password.length);
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    return password.slice(0, pos) + randomChar + password.slice(pos + 1);
}

// Update strength indicator
function updateStrength(length, hasUpper, hasLower, hasNum, hasSym) {
    let strength = 'Weak';
    let count = (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasNum ? 1 : 0) + (hasSym ? 1 : 0);

    if (length >= 16 && count >= 3) strength = 'Very Strong';
    else if (length >= 12 && count >= 3) strength = 'Strong';
    else if (length >= 8 && count >= 2) strength = 'Medium';
    
    strengthText.textContent = strength;
    strengthText.style.color = strength.includes('Strong') ? '#48bb78' : strength === 'Medium' ? '#ed8936' : '#f56565';
}

// Generate on button click
generateBtn.addEventListener('click', () => {
    const password = generatePassword();
    passwordInput.value = password;

    updateStrength(
        lengthInput.value,
        uppercaseCheck.checked,
        lowercaseCheck.checked,
        numbersCheck.checked,
        symbolsCheck.checked
    );
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    passwordInput.select();
    document.execCommand('copy');
    copyBtn.textContent = '✓';
    setTimeout(() => copyBtn.textContent = '📋', 2000);
});

// Generate one on page load
window.onload = () => {
    generateBtn.click();
};
