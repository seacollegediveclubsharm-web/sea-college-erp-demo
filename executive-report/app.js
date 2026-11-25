/* ==========================================================================
   Sea College Dive Club — Interactive Executive Presentation Controller
   ========================================================================== */

(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const pills = Array.from(document.querySelectorAll('.deck-pill'));
  const counterEl = document.getElementById('slide-counter');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnModeReport = document.getElementById('btn-mode-report');
  const btnModeDeck = document.getElementById('btn-mode-deck');

  let currentSlide = 0;
  let currentMode = 'report'; // 'report' | 'deck'

  function updateDeckUI() {
    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === currentSlide);
    });
    pills.forEach((p, idx) => {
      p.classList.toggle('is-active', idx === currentSlide);
    });
    if (counterEl) {
      counterEl.textContent = (currentSlide + 1) + ' / ' + slides.length;
    }
    if (btnPrev) btnPrev.disabled = currentSlide === 0;
    if (btnNext) btnNext.disabled = currentSlide === slides.length - 1;

    if (pills[currentSlide]) {
      pills[currentSlide].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  window.setViewMode = function (mode) {
    currentMode = mode === 'deck' ? 'deck' : 'report';
    document.body.classList.toggle('mode-deck', currentMode === 'deck');
    document.body.classList.toggle('mode-report', currentMode === 'report');
    if (btnModeReport) btnModeReport.classList.toggle('is-active', currentMode === 'report');
    if (btnModeDeck) btnModeDeck.classList.toggle('is-active', currentMode === 'deck');
    updateDeckUI();
    if (currentMode === 'deck') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (slides[currentSlide]) {
      slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.goToSlide = function (index) {
    if (index < 0 || index >= slides.length) return;
    currentSlide = index;
    updateDeckUI();
    if (currentMode === 'report' && slides[currentSlide]) {
      const yOffset = -118;
      const y = slides[currentSlide].getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  window.stepSlide = function (delta) {
    window.goToSlide(currentSlide + delta);
  };

  // Keyboard navigation (RTL aware: Left arrow = Next slide, Right arrow = Previous slide)
  document.addEventListener('keydown', function (e) {
    if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
      if (currentMode === 'deck') {
        e.preventDefault();
        window.stepSlide(1);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
      if (currentMode === 'deck') {
        e.preventDefault();
        window.stepSlide(-1);
      }
    }
  });

  // Scroll spy in Full Report Mode
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        if (currentMode !== 'report') return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-slide-index'));
            if (!Number.isNaN(idx)) {
              currentSlide = idx;
              pills.forEach((p, i) => p.classList.toggle('is-active', i === idx));
              if (counterEl) counterEl.textContent = (idx + 1) + ' / ' + slides.length;
              if (btnPrev) btnPrev.disabled = idx === 0;
              if (btnNext) btnNext.disabled = idx === slides.length - 1;
            }
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0.05 }
    );
    slides.forEach((s) => observer.observe(s));
  }

  // Filter LIVE vs STAGED Matrix
  window.filterMatrix = function (filter, btn) {
    const rows = document.querySelectorAll('#status-matrix-table tbody tr');
    rows.forEach(function (row) {
      const st = row.getAttribute('data-status');
      row.style.display = filter === 'all' || st === filter ? '' : 'none';
    });
    if (btn && btn.parentElement) {
      Array.from(btn.parentElement.querySelectorAll('.filter-btn')).forEach((b) =>
        b.classList.toggle('is-active', b === btn)
      );
    }
  };

  // Executive Decision Cards Styling
  window.toggleDecision = function (num, checkbox) {
    const card = document.getElementById('dec-card-' + num);
    if (card) {
      card.classList.toggle('is-checked', checkbox.checked);
    }
  };

  // Initialize checked states
  [1, 2, 3, 4].forEach(function (n) {
    const card = document.getElementById('dec-card-' + n);
    if (card) {
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb && cb.checked) card.classList.add('is-checked');
    }
  });

  // Share Interactive Report Link via WhatsApp
  window.shareReportWhatsApp = function () {
    const url = window.location.href.split('#')[0];
    const msg =
      '🌊 *سي كوليدج دايف كلوب — شرم الشيخ (Sea College Dive Club)*\n' +
      '📊 *التقرير التنفيذي التفاعلي الشامل لمشروع التحول الرقمي ومنظومة النمو الذكي (14 – 25 نوفمبر 2026)*\n\n' +
      'يتضمن الرسوم البيانية، الجدول الزمني، نتائج التحويلات الفعلية (4x)، الـ 16 عميلاً في الـ CRM، وخطة الـ 90 يوماً مع إمكانية تحميل ملف العرض التقديمي (PPTX):\n' +
      url;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };

  // Send Approved Decisions via WhatsApp
  window.sendDecisionsWhatsApp = function () {
    const labels = [
      '1️⃣ القرار 1 (فوري): تفعيل سكربت Google Ads v2.2 (AQ-56–76) وربط الدفع لإطلاق حملات Meta Ads الأربع.',
      '2️⃣ القرار 2 (خلال 48 ساعة): تكليف أيمن بتحويلات 301 للروابط .php ومزامنة عداد المراجعات إلى 3,220+.',
      '3️⃣ القرار 3 (هذا الأسبوع): تفعيل زر "متواجد حالياً في شرم الشيخ (<72h Express Booking)".',
      '4️⃣ القرار 4 (الأسبوع القادم): بدء ربط بوابة الدفع الإلكتروني لعربون الـ 20% باليورو (EUR).'
    ];
    const selected = [];
    [1, 2, 3, 4].forEach(function (n, i) {
      const card = document.getElementById('dec-card-' + n);
      const cb = card ? card.querySelector('input[type="checkbox"]') : null;
      if (cb && cb.checked) selected.push(labels[i]);
    });
    const text =
      '✅ *اعتماد القرارات التنفيذية — إدارة وملاك Sea College Dive Club*\n\n' +
      (selected.length ? selected.join('\n\n') : 'يرجى مراجعة القرارات الأربعة في التقرير التنفيذي.') +
      '\n\n🔗 التقرير التفاعلي: ' +
      window.location.href.split('#')[0];
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
  };

  // Honor #deck hash if opened directly in presentation mode
  if (window.location.hash === '#deck') {
    window.setViewMode('deck');
  } else {
    updateDeckUI();
  }
})();
