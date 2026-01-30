document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        alert(`Welcome, ${username}! Mission control activated.`);
        
        window.location.href = '/index.html';
    } else {
        alert('Please enter both username and password.');
    }
});

window.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (isLoggedIn && username) {
        const loginBtn = document.querySelector('[href="/login.html"]');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="bi bi-person-check"></i> ${username}`;
            loginBtn.href = '#';
            loginBtn.onclick = () => {
                if (confirm('Log out?')) {
                    localStorage.clear();
                    location.reload();
                }
            };
        }
    }
});