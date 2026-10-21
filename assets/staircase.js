/**
 * शिक्षा DHAM — सफलता की सीढ़ी (Staircase to Success) Animation Controller
 * Optimized for 60fps buttery smoothness, minimal RAM and zero background CPU usage.
 */

(function () {
  'use strict';

  let currentStep = 1;
  const totalSteps = 5;
  let confettiTriggered = false;
  let isSectionVisible = false;

  const stepDetails = {
    1: {
      title: "1. LEARN (सीखें)",
      desc: "बुनियादी कॉन्सेप्ट्स और थ्योरी की आसान व गहरी समझ (Concept-Based Learning)",
      badge: "प्रारंभिक चरण",
      color: "blue"
    },
    2: {
      title: "2. PRACTICE (अभ्यास)",
      desc: "उच्च गुणवत्ता वाले नोट्स, असाइनमेंट्स व दैनिक होमवर्क का नियमित अभ्यास",
      badge: "मजबूत नींव",
      color: "emerald"
    },
    3: {
      title: "3. TEST (परीक्षा दें)",
      desc: "हर माह 2 वीकली टेस्ट (30+30 अंक) + 1 मंथली टेस्ट (40 अंक) = कुल 100 अंक",
      badge: "सतत मूल्यांकन",
      color: "amber"
    },
    4: {
      title: "4. ANALYSIS (विश्लेषण)",
      desc: "कमजोर टॉपिक्स की पहचान, गलतियों की समीक्षा और पर्सनल डाउट क्लियरिंग",
      badge: "कमी सुधार",
      color: "purple"
    },
    5: {
      title: "5. SUCCESS (सफलता)",
      desc: "बोर्ड परीक्षा में टॉपर्स रैंक, ट्रॉफी, सर्टिफिकेट और 50% छात्रवृत्ति छूट!",
      badge: "सर्वोच्च लक्ष्य 🏆",
      color: "gold"
    }
  };

  let lottieAnim = null;

  function loadLottieAvatar() {
    const lottieContainer = document.getElementById('lottieCharacter');
    if (!lottieContainer || lottieAnim) return;

    if (typeof lottie !== 'undefined' && window.SHIKSHA_DHAM_LOTTIE) {
      try {
        lottieAnim = lottie.loadAnimation({
          container: lottieContainer,
          renderer: 'svg',
          loop: true,
          autoplay: false, // Don't burn CPU until section is visible
          animationData: window.SHIKSHA_DHAM_LOTTIE
        });

        // If staircase is already in view, start playing
        if (isSectionVisible) {
          lottieAnim.play();
        }
      } catch (err) {
        console.error('Lottie init error:', err);
      }
    }
  }

  function initStaircase() {
    const staircaseSection = document.getElementById('staircaseSection');
    const avatar = document.getElementById('studentAvatar');
    const steps = document.querySelectorAll('.stair-step');
    const infoBox = document.getElementById('stepInfoDisplay');
    const canvas = document.getElementById('confettiCanvas');

    if (!staircaseSection || !avatar || steps.length === 0) return;

    // Load Lottie
    loadLottieAvatar();

    // Zero-overhead Visibility Observer:
    // Pauses Lottie completely when offscreen -> 0% CPU & 0% battery/RAM waste!
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSectionVisible = entry.isIntersecting;
        if (lottieAnim) {
          if (isSectionVisible) {
            lottieAnim.play();
          } else {
            lottieAnim.pause(); // Frees CPU immediately
          }
        }
      });
    }, { threshold: 0.05 });
    visibilityObserver.observe(staircaseSection);

    // Dynamic avatar dimensions without layout thrashing
    function getAvatarDimensions() {
      const isMobile = window.innerWidth < 1024;
      return {
        w: isMobile ? 120 : 150,
        h: isMobile ? 120 : 150
      };
    }

    // Position Avatar on a specific step (1 to 5)
    function moveToStep(stepNum, triggerBounce = true) {
      if (stepNum < 1) stepNum = 1;
      if (stepNum > totalSteps) stepNum = totalSteps;

      const previousStep = currentStep;
      currentStep = stepNum;

      const targetStepElem = document.querySelector(`.stair-step[data-step="${stepNum}"]`);
      if (!targetStepElem) return;

      // Update active states on steps
      steps.forEach((step, idx) => {
        const num = idx + 1;
        step.classList.remove('active', 'completed');
        if (num < stepNum) {
          step.classList.add('completed');
        } else if (num === stepNum) {
          step.classList.add('active');
        }
      });

      // Calculate relative position within container
      const containerRect = staircaseSection.getBoundingClientRect();
      const stepRect = targetStepElem.getBoundingClientRect();
      const dims = getAvatarDimensions();

      const targetX = (stepRect.left - containerRect.left) + (stepRect.width / 2) - (dims.w / 2);
      const targetY = (stepRect.top - containerRect.top) - (dims.h * 0.74);

      avatar.style.left = `${targetX}px`;
      avatar.style.top = `${targetY}px`;

      // Smooth bounce animation without synchronous reflow thrashing
      if (triggerBounce && previousStep !== stepNum) {
        avatar.classList.remove('avatar-bouncing');
        requestAnimationFrame(() => {
          avatar.classList.add('avatar-bouncing');
        });
      }

      // Update accessories for Step 5
      const avatarCap = document.getElementById('avatarGradCap');
      const avatarTrophy = document.getElementById('avatarTrophyHand');

      if (stepNum === 5) {
        if (avatarCap) avatarCap.classList.remove('hidden');
        if (avatarTrophy) avatarTrophy.classList.remove('hidden');
        if (!confettiTriggered) {
          launchConfetti(canvas);
          confettiTriggered = true;
        }
      } else {
        if (avatarCap) avatarCap.classList.add('hidden');
        if (avatarTrophy) avatarTrophy.classList.add('hidden');
      }

      // Update Info Display ONLY when step actually changes (prevents DOM re-renders)
      if (infoBox && stepDetails[stepNum] && previousStep !== stepNum) {
        const d = stepDetails[stepNum];
        infoBox.innerHTML = `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded-none text-xs font-bold uppercase tracking-wider bg-brandGold text-brandNavy font-hindi border border-brandGoldDark/40 shadow-2xs">${d.badge}</span>
              <h4 class="text-xl font-black text-brandNavy font-hindi">${d.title}</h4>
            </div>
            <span class="text-xs font-bold text-slate-500 font-hindi uppercase tracking-wider">पायदान ${stepNum} / ${totalSteps}</span>
          </div>
          <p class="text-slate-600 text-sm mt-2 font-hindi leading-relaxed">${d.desc}</p>
        `;
      }
    }

    // Click & Keyboard navigation for staircase steps (WCAG 2.1.1 compliant)
    steps.forEach(step => {
      const stepNumber = parseInt(step.getAttribute('data-step') || '1', 10);
      step.setAttribute('tabindex', '0');
      step.setAttribute('role', 'button');
      step.setAttribute('aria-label', `पायदान ${stepNumber}: ${stepDetails[stepNumber]?.title || ''}`);

      step.addEventListener('click', () => {
        moveToStep(stepNumber, true);
      });

      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          moveToStep(stepNumber, true);
        }
      });
    });

    // Highly optimized scroll listener:
    // - Immediately skips if section is offscreen (0 CPU waste)
    // - Debounced via requestAnimationFrame (buttery 60fps)
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!isSectionVisible) return; // Exit in 0.001ms if not looking at staircase
      if (scrollTicking) return;
      scrollTicking = true;

      requestAnimationFrame(() => {
        const rect = staircaseSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
          const progress = Math.min(Math.max((windowHeight * 0.75 - rect.top) / (rect.height * 0.85), 0), 1);
          const mappedStep = Math.min(Math.floor(progress * totalSteps) + 1, totalSteps);

          if (mappedStep !== currentStep) {
            moveToStep(mappedStep, true);
          }
        }
        scrollTicking = false;
      });
    }, { passive: true });

    // Initial position on load and resize
    window.addEventListener('resize', () => moveToStep(currentStep, false));
    setTimeout(() => moveToStep(1, false), 150);

    // Setup interactive manual controls (Previous / Next Step Buttons)
    const btnPrev = document.getElementById('stairBtnPrev');
    const btnNext = document.getElementById('stairBtnNext');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStep > 1) moveToStep(currentStep - 1, true);
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentStep < totalSteps) moveToStep(currentStep + 1, true);
      });
    }
  }

  // Lightweight Confetti Particle System (auto-stops after 1.5s to preserve RAM)
  function launchConfetti(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const particles = [];
    const colors = ['#FDB813', '#0F2942', '#107C41', '#E11D48', '#38BDF8'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: canvas.width * 0.82,
        y: canvas.height * 0.22,
        r: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 1) * 6 - 2,
        opacity: 1
      });
    }

    let animationFrame;
    const startTime = performance.now();

    function render(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Auto-terminate after 1500ms
      if (time - startTime > 1600) {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      let active = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          active = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.fill();
        }
      });

      if (active) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animationFrame = requestAnimationFrame(render);
  }

  // View Switcher: Allows User to toggle between "एनिमेटेड सीढ़ी" vs "क्लासिक ग्रिड"
  function initViewSwitcher() {
    const toggleBtn = document.getElementById('toggleStaircaseView');
    const staircaseWrapper = document.getElementById('staircaseWrapper');
    const gridWrapper = document.getElementById('gridMethodologyWrapper');

    if (!toggleBtn || !staircaseWrapper || !gridWrapper) return;

    toggleBtn.addEventListener('click', () => {
      const isStaircaseVisible = !staircaseWrapper.classList.contains('hidden');
      if (isStaircaseVisible) {
        staircaseWrapper.classList.add('hidden');
        gridWrapper.classList.remove('hidden');
        toggleBtn.innerHTML = '<i class="fa-solid fa-stairs text-brandGold mr-1.5"></i> <span>🧗‍♂️ एनिमेटेड सीढ़ी व्यू देखें</span>';
      } else {
        staircaseWrapper.classList.remove('hidden');
        gridWrapper.classList.add('hidden');
        toggleBtn.innerHTML = '<i class="fa-solid fa-table-cells-large text-brandGold mr-1.5"></i> <span>📋 क्लासिक कार्ड्स व्यू देखें</span>';
        window.dispatchEvent(new Event('resize'));
      }
    });
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initStaircase();
      initViewSwitcher();
    });
  } else {
    initStaircase();
    initViewSwitcher();
  }
})();
