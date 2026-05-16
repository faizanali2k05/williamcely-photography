// Animate on Scroll
if (window.AOS) {
    AOS.init({
        duration: 900,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });
}

// Smooth scrolling for same-page anchors, close mobile menu on click
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length < 2) {
            // Bare "#" — treat as scroll-to-top (back-to-top button on inner pages)
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
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

// Close mobile menu when any nav link clicked
document.querySelectorAll('.site-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
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
        btn.textContent = 'Enviando…';

        setTimeout(() => {
            if (status) status.textContent = 'Gracias — tu consulta fue enviada. William se pondrá en contacto en menos de 48 horas.';
            contactForm.reset();
            btn.disabled = false;
            btn.textContent = original;
        }, 700);
    });
}

// Lightbox for gallery/category pages
(function () {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lbImg = lightbox.querySelector('img');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');

    const items = Array.from(document.querySelectorAll('.cat-grid .g-item img, .gallery-grid .g-item img'));
    if (!items.length) return;

    let current = 0;

    function open(idx) {
        current = idx;
        lbImg.src = items[idx].src;
        lbImg.alt = items[idx].alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    function show(delta) {
        current = (current + delta + items.length) % items.length;
        lbImg.src = items[current].src;
        lbImg.alt = items[current].alt || '';
    }

    items.forEach((img, i) => {
        img.parentElement.addEventListener('click', () => open(i));
    });
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => show(-1));
    btnNext.addEventListener('click', () => show(1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(-1);
        else if (e.key === 'ArrowRight') show(1);
    });
})();
