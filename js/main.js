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

function activatePkgTab(target) {
    let matched = false;
    pkgTabs.forEach(t => {
        const active = t.dataset.target === target;
        if (active) matched = true;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    pkgPanels.forEach(p => {
        p.classList.toggle('is-active', p.id === 'panel-' + target);
    });
    if (window.AOS) AOS.refresh();
    return matched;
}

pkgTabs.forEach(tab => {
    tab.addEventListener('click', () => activatePkgTab(tab.dataset.target));
});

// Activate tab from URL hash (e.g. #panel-bodas)
if (pkgTabs.length && window.location.hash.startsWith('#panel-')) {
    const target = window.location.hash.replace('#panel-', '');
    if (activatePkgTab(target)) {
        setTimeout(() => {
            const section = document.getElementById('paquetes');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// Contact form — sends the inquiry to WhatsApp with all the details
const WHATSAPP_NUMBER = '18175699593'; // William Cely — (817) 569-9593
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.textContent;

        const data = new FormData(contactForm);
        const get = (k) => (data.get(k) || '').toString().trim();

        const name = [get('firstName'), get('lastName')].filter(Boolean).join(' ');
        const lines = [
            '*Nueva consulta — William Cely Photography*',
            '',
            'Nombre: ' + (name || '—'),
            'Correo: ' + (get('email') || '—'),
            'Teléfono: ' + (get('phone') || '—'),
            'Tipo de sesión: ' + (get('session') || '—'),
            'Fecha preferida: ' + (get('date') || '—'),
            '',
            'Mensaje:',
            get('message') || '—'
        ];

        const url = 'https://wa.me/' + WHATSAPP_NUMBER +
            '?text=' + encodeURIComponent(lines.join('\n'));

        // Open WhatsApp (app or web) with the inquiry pre-filled
        window.open(url, '_blank', 'noopener');

        if (status) status.textContent = 'Abriendo WhatsApp… toca enviar para completar tu consulta. William se pondrá en contacto en menos de 48 horas.';
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = original;
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

    const items = Array.from(document.querySelectorAll('.cat-grid .g-item img, .gallery-grid .g-item img, .gallery-section .cat-grid .g-item img'));
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
