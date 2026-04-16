/**
 * Navegação responsiva (mobile).
 */
export function initMenuNav() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('header__nav--open');
            menuToggle.classList.toggle('header__hamburger--active');
        });
        
        // Ensure menu closes when clicking a link
        const navLinks = mainNav.querySelectorAll('.header__nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('header__nav--open');
                menuToggle.classList.remove('header__hamburger--active');
            });
        });
    }
}
