// ===================================================================
// EFEITO MATRIX COM "PLANTAS" (VERSÃO CORRIGIDA, OTIMIZADA E ISOLADA)
// ===================================================================

(function () {
  // --- CONFIGURAÇÃO ---
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) {
    console.warn('matrix-canvas não encontrado — efeito Matrix desativado.');
    // Ainda assim continua o resto dos scripts
  }

  // Função utilitária para debounce
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // MATRIX - somente se o canvas existir
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
      // limpa fundo imediatamente
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Caracteres que simulam as "plantas"
    let katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let nums = '0123456789';
    let matrixChars = (katakana + latin + nums).split('');

    let fontSize = 14;                       // tamanho do "pixel"
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = Array(columns).fill(1);

    // estilos iniciais do canvas
    if (ctx) {
      ctx.font = fontSize + 'px monospace';
      ctx.textBaseline = 'top';
    }

    // animação via requestAnimationFrame (mais suave)
    let lastFrame = 0;
    function drawMatrix(timestamp) {
      // limitar FPS se quiser (ex.: 60fps)
      if (timestamp - lastFrame < 33) { // ~30fps
        requestAnimationFrame(drawMatrix);
        return;
      }
      lastFrame = timestamp;

      // rastro sutil
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#34D399'; // cor verde
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        let text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        let x = i * fontSize;
        let y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      requestAnimationFrame(drawMatrix);
    }

    // inicialização segura
    resizeCanvas();
    requestAnimationFrame(drawMatrix);

    // resize com debounce para não recalcular loucamente
    window.addEventListener('resize', debounce(resizeCanvas, 150));
  } // fim matrix

  // ===================================================================
  // OUTROS SCRIPTS (SÓ RODAM DEPOIS QUE A PÁGINA CARREGA)
  // ===================================================================
  document.addEventListener('DOMContentLoaded', function () {
    // TYPING (safe: checa elementos antes)
    const titleElement = document.getElementById('typing-title');
    const subtitleElement = document.getElementById('typing-subtitle');

    function typeWriter(element, text, onComplete) {
      if (!element || !text) return typeof onComplete === 'function' && onComplete();
      let i = 0;
      element.textContent = ''; // garante estado inicial limpo
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, 40);
        } else if (onComplete) {
          onComplete();
        }
      }
      type();
    }

    let titleText = '';
    let subtitleText = '';
    if (titleElement && subtitleElement) {
      titleText = "Do Zero à Sua Primeira Página Web: O Guia Definitivo de HTML";
      subtitleText = "Aprenda a estrutura da internet e construa seu primeiro site, mesmo que você nunca tenha escrito uma linha de código.";

      typeWriter(titleElement, titleText, function () {
        typeWriter(subtitleElement, subtitleText);
      });
    }

    // COUNTDOWN (safe: checa elementos antes)
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownWrapper = document.getElementById('countdown');

    // Exemplo: 3 dias a partir de agora
    const promotionEndDate = new Date();
    promotionEndDate.setDate(promotionEndDate.getDate() + 3);

    let countdownInterval = null;
    if (daysEl && hoursEl && minutesEl && secondsEl && countdownWrapper) {
      countdownInterval = setInterval(function () {
        const now = Date.now();
        const distance = promotionEndDate - now;

        if (distance <= 0) {
          clearInterval(countdownInterval);
          countdownWrapper.textContent = 'PROMOÇÃO ENCERRADA!';
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = String(days).padStart(2, '0');
        hoursEl.innerText = String(hours).padStart(2, '0');
        minutesEl.innerText = String(minutes).padStart(2, '0');
        secondsEl.innerText = String(seconds).padStart(2, '0');
      }, 1000);
    }

    // SCROLLREVEAL (safe: checa existência e variáveis)
    if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({
        origin: 'bottom',
        distance: '50px',
        duration: 800,
        easing: 'ease-in-out',
        reset: false
      });

      // calcula um delay razoável (só se titleText existir)
      let typingDuration = 1000;
      if (titleText) {
        typingDuration = (titleText.length + (subtitleText ? subtitleText.length : 0)) * 40 + 500;
      }

      // revelações (verifica seletor antes de chamar reveal)
      try {
        sr.reveal('.hero-text .cta-button', { delay: typingDuration });
        sr.reveal('.hero-image-container', { delay: 1000 });
        sr.reveal('.offer, .result, .features, .testimonials, .final-cta', { interval: 150 });
        sr.reveal('.feature-column, .price-section', { interval: 100 });
      } catch (err) {
        console.warn('ScrollReveal falhou ao revelar elementos:', err);
      }
    } // fim ScrollReveal
  }); // fim DOMContentLoaded

  // ===================================================================
  // BLOQUEIOS (DIFICULTAR CÓPIA) - CONSERVADORES E SEGUROS
  // ===================================================================
  // Esses bloqueios não são "segurança", apenas desestimulam usuários casuais.
  // NÃO bloqueiam quando foco está em input/textarea/contenteditable.

  function isEditableTarget(target) {
    if (!target) return false;
    const tag = (target.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    if (target.isContentEditable) return true;
    return false;
  }

  // bloqueio de menu de contexto com salvaguarda
  document.addEventListener('contextmenu', function (e) {
    if (!isEditableTarget(e.target)) {
      e.preventDefault();
    }
  });

  // bloqueio de seleção por arrastar (opcional — pode afetar UX)
  document.addEventListener('selectstart', function (e) {
    if (isEditableTarget(e.target)) return;
    e.preventDefault();
  });

  // bloqueio de teclas comuns para inspecionar (com salvaguarda)
  document.addEventListener('keydown', function (e) {
    const active = document.activeElement;
    if (isEditableTarget(active)) return; // permite atalho quando digitando

    // teclas/combinações a bloquear
    const blocked =
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || // Ctrl+Shift+I
      (e.ctrlKey && e.key.toLowerCase() === 'u') ||               // Ctrl+U
      (e.ctrlKey && e.key.toLowerCase() === 's');                 // Ctrl+S

    if (blocked) {
      e.preventDefault();
      // opcional: mostrar aviso curto
      // flashMessage('Ação não permitida nesta página.');
    }
  });

  // fim do IIFE
})();

