const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const passwordMismatch = document.getElementById('password-mismatch');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('submitButton');

function checkPasswords() {
  if (passwordInput.value !== password2Input.value) {
    password2Input.setCustomValidity('Passwords do not match');
    passwordMismatch.classList.add('d-block');
    submitButton.disabled = true; // Send 버튼 비활성화
  } else {
    password2Input.setCustomValidity('');
    passwordMismatch.classList.remove('d-block');
    checkEmail(); // 이메일 유효성 검사 함수 호출
  }
}

function checkEmail() {
    const email = emailInput.value.trim();
    const regex = /^\S+@\S+\.\S+$/;
    const isValid = regex.test(email);
    emailInput.setCustomValidity(isValid ? '' : 'Invalid email address');
    if (isValid) {
        submitButton.disabled = false;
        emailInput.classList.remove('is-invalid');
    } else {
        submitButton.disabled = true;
        emailInput.classList.add('is-invalid');
        const feedbackElem = emailInput.parentElement.querySelector('[data-sb-feedback="email:email"]');
        feedbackElem.classList.add('d-block');
    }
}

passwordInput.addEventListener('change', checkPasswords);
password2Input.addEventListener('keyup', checkPasswords);
emailInput.addEventListener('keyup', checkEmail);