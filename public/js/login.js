// public/js/login.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { showMessage } from './utils.js';

export function initLoginPage() {
    const content = document.getElementById('main-content');
    if (content) {
        fetch('html/login.html')
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
                setupLoginListeners();
            })
            .catch(error => {
                console.error('Eroare la încărcarea login.html:', error);
                showMessage('Eroare la încărcarea paginii de autentificare.', 'error');
            });
    }
}

export function showLoginModal() {
    return new Promise((resolve) => {
        const loginModal = document.getElementById('login-modal');
        if (!loginModal) {
            console.error("Elementul #login-modal nu a fost găsit.");
            resolve();
            return;
        }
        loginModal.style.display = 'flex';
        setupLoginListeners();
        const handleLogin = () => {
            loginModal.style.display = 'none';
            resolve();
        };
        auth.onAuthStateChanged(user => {
            if (user) handleLogin();
        });
    });
}

function setupLoginListeners() {
    const loginButton = document.getElementById('login-button');
    const googleLoginButton = document.getElementById('google-login-button');
    const registerButton = document.getElementById('register-button');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorElement = document.getElementById('login-error');

    if (!loginButton || !googleLoginButton || !registerButton || !emailInput || !passwordInput || !errorElement) {
        console.error('Unul sau mai multe elemente ale formularului de login nu au fost găsite.');
        return;
    }

    loginButton.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        if (!email || !password) {
            errorElement.textContent = 'Te rugăm să completezi toate câmpurile.';
            errorElement.style.display = 'block';
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showMessage('Autentificare reușită!', 'success');
            errorElement.style.display = 'none';
        } catch (error) {
            errorElement.textContent = getErrorMessage(error.code);
            errorElement.style.display = 'block';
        }
    });

    googleLoginButton.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            showMessage('Autentificare cu Google reușită!', 'success');
            errorElement.style.display = 'none';
        } catch (error) {
            errorElement.textContent = getErrorMessage(error.code);
            errorElement.style.display = 'block';
        }
    });

    registerButton.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        if (!email || !password) {
            errorElement.textContent = 'Te rugăm să completezi toate câmpurile.';
            errorElement.style.display = 'block';
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            showMessage('Cont creat cu succes! Te-ai autentificat.', 'success');
            errorElement.style.display = 'none';
        } catch (error) {
            errorElement.textContent = getErrorMessage(error.code);
            errorElement.style.display = 'block';
        }
    });
}

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Acest email este deja folosit.';
        case 'auth/invalid-email':
            return 'Email invalid.';
        case 'auth/weak-password':
            return 'Parola trebuie să aibă cel puțin 6 caractere.';
        case 'auth/wrong-password':
            return 'Parolă incorectă.';
        case 'auth/user-not-found':
            return 'Utilizatorul nu a fost găsit.';
        default:
            return 'Eroare la autentificare: ' + errorCode;
    }
}
