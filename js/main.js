// Animate on Scroll
if (window.AOS) {
    AOS.init({
        duration: 900,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });
}

// Smooth scrolling with offset for sticky nav, close mobile menu on click
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();

        const nav = document.querySelector('.site-nav');
        const offset = (nav ? nav.offsetHeight : 0) + 8;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top, behavior: 'smooth' });

        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show') && window.bootstrap) {
            bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
        }
    });
});

// Navbar shrink on scroll + back-to-top visibility
const navEl = document.querySelector('.site-nav');
const toTop = document.querySelector('.back-to-top');

function onScroll() {
    const y = window.scrollY;
    if (navEl) navEl.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Package tabs
const pkgTabs = document.querySelectorAll('.pkg-tab');
const pkgPanels = document.querySelectorAll('.pkg-panel');
pkgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        pkgTabs.forEach(t => {
            const active = t === tab;
            t.classList.toggle('is-active', active);
            t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        pkgPanels.forEach(p => {
            p.classList.toggle('is-active', p.id === 'panel-' + target);
        });
        if (window.AOS) AOS.refresh();
    });
});

// Contact form (demo — replace with real endpoint)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.textContent;

        btn.disabled = true;
        btn.textContent = 'Sending…';

        setTimeout(() => {
            if (status) status.textContent = 'Thank you — your inquiry has been sent. William will be in touch within 48 hours.';
            contactForm.reset();
            btn.disabled = false;
            btn.textContent = original;
        }, 700);
    });
}
