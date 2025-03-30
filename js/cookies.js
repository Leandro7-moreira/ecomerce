// Código para Cookies (scripts/cookies.js)
document.addEventListener('DOMContentLoaded', function() {
    const cookiesMsg = document.getElementById('cookies-msg');
    const acceptCookiesButton = document.getElementById('accept-cookies');
    
    if (acceptCookiesButton) {
        acceptCookiesButton.addEventListener('click', function() {
            cookiesMsg.style.display = 'none';
        });
    }
});