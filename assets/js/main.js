/**
 * Urologie im Haus Hochherz – Interaktive Funktionen (2026 Relaunch)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Live Praxis-Status (Telefonische Erreichbarkeit / Öffnungszeiten)
  const statusTextEl = document.getElementById('liveStatusText');
  const statusDotEl = document.getElementById('liveStatusDot');

  function updatePracticeStatus() {
    if (!statusTextEl || !statusDotEl) return;
    const now = new Date();
    const day = now.getDay(); // 0=So, 1=Mo, ..., 6=Sa
    const minutes = now.getHours() * 60 + now.getMinutes();

    let isPhoneOpen = false;
    let isReceptionOpen = false;

    // Mo (1), Di (2), Do (4): Tel 08:00-12:00 & 15:00-18:00 | Anmeldung 08:00-13:00 & 15:00-18:00
    if (day === 1 || day === 2 || day === 4) {
      if ((minutes >= 8 * 60 && minutes < 12 * 60) || (minutes >= 15 * 60 && minutes < 18 * 60)) {
        isPhoneOpen = true;
      }
      if ((minutes >= 8 * 60 && minutes < 13 * 60) || (minutes >= 15 * 60 && minutes < 18 * 60)) {
        isReceptionOpen = true;
      }
    }
    // Mi (3), Fr (5): Tel 08:00-12:00 | Anmeldung 08:00-13:00
    else if (day === 3 || day === 5) {
      if (minutes >= 8 * 60 && minutes < 12 * 60) {
        isPhoneOpen = true;
      }
      if (minutes >= 8 * 60 && minutes < 13 * 60) {
        isReceptionOpen = true;
      }
    }

    if (isPhoneOpen) {
      statusDotEl.style.background = '#35d07f';
      statusTextEl.textContent = 'Telefonisch jetzt erreichbar (0251 / 28 468 - 0)';
    } else if (isReceptionOpen) {
      statusDotEl.style.background = '#f5b041';
      statusTextEl.textContent = 'Praxis geöffnet (Anmeldung bis 13:00 Uhr · Online-Termin 24/7)';
    } else {
      statusDotEl.style.background = '#38C6D9';
      statusTextEl.textContent = 'Online-Terminbuchung rund um die Uhr via Doctolib';
    }
  }

  updatePracticeStatus();

  // 3. DSGVO 2-Klick-Lösung für Google Maps
  const loadMapBtn = document.getElementById('loadMapBtn');
  const mapContainer = document.getElementById('mapContainer');

  if (loadMapBtn && mapContainer) {
    loadMapBtn.addEventListener('click', () => {
      mapContainer.innerHTML = `
        <div class="map-iframe-container">
          <iframe
            title="Standort Urologie im Haus Hochherz, Rothenburg 2, 48143 Münster"
            src="https://maps.google.com/maps?q=Rothenburg%202,%2048143%20M%C3%BCnster&t=&z=16&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen>
          </iframe>
        </div>
      `;
    });
  }

  // 4. Rückruf-Service-Formular
  const callbackForm = document.getElementById('callbackForm');
  const formFeedback = document.getElementById('formFeedback');

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cbName').value.trim();
      const phone = document.getElementById('cbPhone').value.trim();
      const email = document.getElementById('cbEmail').value.trim();
      const topic = document.getElementById('cbTopic').value;
      const message = document.getElementById('cbMessage').value.trim();

      const subject = encodeURIComponent(`Rückrufbitte (${topic}): ${name}`);
      const body = encodeURIComponent(
        `Guten Tag liebes Praxisteam,\n\nbitte um Rückruf bzw. Kontaktaufnahme:\n\n` +
        `Name: ${name}\n` +
        `Telefon: ${phone}\n` +
        `E-Mail: ${email || 'nicht angegeben'}\n` +
        `Anliegen: ${topic}\n` +
        `Nachricht: ${message || '-'}\n\n` +
        `Mit freundlichen Grüßen\n${name}`
      );

      window.location.href = `mailto:praxis@urologie-muenster.de?subject=${subject}&body=${body}`;

      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `
          <strong>Vielen Dank, ${name}!</strong> Ihr E-Mail-Programm wurde mit Ihrer vorformulierten Rückrufbitte an 
          <a href="mailto:praxis@urologie-muenster.de">praxis@urologie-muenster.de</a> geöffnet. Alternativ erreichen Sie uns direkt unter <strong>0251 / 28 468 - 0</strong>.
        `;
      }
    });
  }

  // 5. Rechtliche Modals (Impressum & Datenschutz)
  const modals = {
    impressum: document.getElementById('modalImpressum'),
    datenschutz: document.getElementById('modalDatenschutz')
  };

  function openModal(key) {
    if (modals[key]) {
      modals[key].classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAllModals() {
    Object.values(modals).forEach(m => {
      if (m) m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-open-modal');
      openModal(target);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  Object.values(modals).forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Falls #impressum oder #datenschutz in URL
  if (window.location.hash === '#impressum') openModal('impressum');
  if (window.location.hash === '#datenschutz') openModal('datenschutz');
});
