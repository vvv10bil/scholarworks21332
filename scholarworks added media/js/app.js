/* =============================================
   APP.JS — All Site JavaScript
   ============================================= */

// ===== ROUTING =====
function nav2(p) {
  document.querySelectorAll('.pg').forEach(x => x.classList.remove('on'));
  document.getElementById('pg-' + p).classList.add('on');
  document.querySelectorAll('.nl a[data-p]').forEach(a => a.classList.toggle('act', a.dataset.p === p));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('nls').classList.remove('mo');
  setTimeout(initRv, 100);
}

function goSec(id) {
  nav2('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
  document.getElementById('nls').classList.remove('mo');
}


// ===== COUNTDOWN TIMER =====
let t = 9 * 3600 + 37 * 60 + 22;
setInterval(() => {
  if (t <= 0) return;
  t--;
  const h = String(Math.floor(t / 3600)).padStart(2, '0');
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const s = String(t % 60).padStart(2, '0');
  [['ph', 'pm', 'ps'], ['ch', 'cm', 'cc']].forEach(([a, b, c]) => {
    const e = document.getElementById(a);
    if (e) {
      e.textContent = h;
      document.getElementById(b).textContent = m;
      document.getElementById(c).textContent = s;
    }
  });
}, 1000);


// ===== NAV SCROLL SHADOW =====
window.addEventListener('scroll', () => {
  document.getElementById('nb').classList.toggle('sc', window.scrollY > 40);
});


// ===== SCROLL REVEAL ANIMATIONS =====
function initRv() {
  const o = new IntersectionObserver((es) => {
    es.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vi'), i * 40);
        o.unobserve(e.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.rv:not(.vi)').forEach(el => o.observe(el));
}
initRv();


// ===== FAQ ACCORDION =====
function tgf(el) {
  el.parentElement.classList.toggle('op');
}


// ===== WRITERS SCROLLBAR WITH ARROWS =====
(function() {
  const track = document.getElementById('writersTrack');
  const wrap = document.getElementById('writersWrap');
  const leftBtn = document.getElementById('writersLeft');
  const rightBtn = document.getElementById('writersRight');
  const dotsContainer = document.getElementById('writersDots');
  if (!track || !wrap || !leftBtn || !rightBtn) return;

  const cards = track.querySelectorAll('.wcard');
  let currentPos = 0;

  function getCardWidth() {
    if (!cards.length) return 296;
    var card = cards[0];
    return card.offsetWidth + 16; // card width + gap
  }

  function isMobileScroll() {
    return window.innerWidth <= 480;
  }

  function getVisibleCards() {
    return Math.floor(wrap.offsetWidth / getCardWidth()) || 1;
  }

  function getMaxPos() {
    const visible = getVisibleCards();
    return Math.max(0, cards.length - visible);
  }

  function getPageCount() {
    const visible = getVisibleCards();
    return Math.ceil(cards.length / visible);
  }

  function getCurrentPage() {
    const visible = getVisibleCards();
    return Math.floor(currentPos / visible);
  }

  function buildDots() {
    if (!dotsContainer) return;
    const pages = getPageCount();
    dotsContainer.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'writers-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Page ' + (i + 1));
      dot.addEventListener('click', function() {
        const visible = getVisibleCards();
        currentPos = Math.min(i * visible, getMaxPos());
        updatePosition();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const page = getCurrentPage();
    dotsContainer.querySelectorAll('.writers-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === page);
    });
  }

  function updatePosition() {
    if (isMobileScroll()) return; // mobile uses native scroll
    var cw = getCardWidth();
    var offset = currentPos * cw;
    track.style.transform = 'translateX(-' + offset + 'px)';
    leftBtn.disabled = currentPos <= 0;
    rightBtn.disabled = currentPos >= getMaxPos();
    updateDots();
  }

  leftBtn.addEventListener('click', function() {
    const step = getVisibleCards();
    currentPos = Math.max(0, currentPos - step);
    updatePosition();
  });

  rightBtn.addEventListener('click', function() {
    const step = getVisibleCards();
    currentPos = Math.min(getMaxPos(), currentPos + step);
    updatePosition();
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchDelta = 0;
  let isSwiping = false;

  wrap.addEventListener('touchstart', function(e) {
    if (isMobileScroll()) return;
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
    track.style.transition = 'none';
  }, { passive: true });

  wrap.addEventListener('touchmove', function(e) {
    if (isMobileScroll() || !isSwiping) return;
    touchDelta = e.touches[0].clientX - touchStartX;
    var cw = getCardWidth();
    var offset = currentPos * cw - touchDelta;
    track.style.transform = 'translateX(-' + offset + 'px)';
  }, { passive: true });

  wrap.addEventListener('touchend', function() {
    if (isMobileScroll() || !isSwiping) return;
    isSwiping = false;
    track.style.transition = '';
    var cw = getCardWidth();
    var threshold = cw / 3;
    if (touchDelta > threshold) {
      currentPos = Math.max(0, currentPos - getVisibleCards());
    } else if (touchDelta < -threshold) {
      currentPos = Math.min(getMaxPos(), currentPos + getVisibleCards());
    }
    touchDelta = 0;
    updatePosition();
  });

  // Rebuild on resize
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (isMobileScroll()) {
        // Reset transform for mobile native scroll
        track.style.transform = '';
      } else {
        currentPos = Math.min(currentPos, getMaxPos());
        updatePosition();
      }
      buildDots();
    }, 150);
  });

  buildDots();
  if (!isMobileScroll()) updatePosition();
})();


// ===== REVIEWS CAROUSEL (duplicate for infinite scroll) =====
const rt = document.getElementById('revTrack');
if (rt) rt.innerHTML += rt.innerHTML;


// ===== PRICE CALCULATOR =====
function calcPrice() {
  const type = parseFloat(document.getElementById('calcType').value) || 5;
  const deadline = parseFloat(document.getElementById('calcDeadline').value) || 1;
  const level = parseFloat(document.getElementById('calcLevel').value) || 1;
  const price = Math.max(5, type * deadline * level).toFixed(2);
  document.getElementById('calcResult').textContent = '$' + price;
}
calcPrice();


// ===== EXIT INTENT POPUP =====
let exitShown = false;
document.addEventListener('mouseleave', (e) => {
  if (e.clientY <= 0 && !exitShown) {
    exitShown = true;
    document.getElementById('exitPopup').classList.add('show');
  }
});

function closeExit() {
  document.getElementById('exitPopup').classList.remove('show');
}


// ===== WRITERS ONLINE RANDOMIZER =====
(function() {
  var el = document.getElementById('writersCount');
  if (!el) return;
  var current = 47;
  function update() {
    var delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
    current = Math.max(38, Math.min(56, current + delta));
    el.textContent = current;
    var next = 30000 + Math.floor(Math.random() * 60000); // 30-90 seconds
    setTimeout(update, next);
  }
  // Initial randomization on page load
  current = 41 + Math.floor(Math.random() * 16); // 41-56
  el.textContent = current;
  setTimeout(update, 30000 + Math.floor(Math.random() * 60000));
})();


// ===== LIVE ORDER FEED =====
const liveOrders = [
  { name: 'Marcus', school: 'UCLA', type: 'Research Paper', min: 2 },
  { name: 'Jessica', school: 'NYU', type: 'Nursing Essay', min: 4 },
  { name: 'David', school: 'UT Austin', type: 'Case Study', min: 7 },
  { name: 'Aisha', school: 'Columbia', type: 'Literature Review', min: 3 },
  { name: 'Ryan', school: 'Penn State', type: 'Lab Report', min: 5 },
  { name: 'Sophia', school: 'Duke', type: 'Thesis Chapter', min: 1 },
  { name: 'Brandon', school: 'Michigan', type: 'Business Paper', min: 6 },
  { name: 'Emily', school: 'Stanford', type: 'APA Essay', min: 8 },
  { name: 'Carlos', school: 'FIU', type: 'Discussion Post', min: 2 },
  { name: 'Hannah', school: 'Ohio State', type: 'Capstone Project', min: 4 },
  { name: 'Tyler', school: 'Berkeley', type: 'MLA Essay', min: 3 },
  { name: 'Priya', school: 'Georgia Tech', type: 'Statistics Report', min: 5 },
];

let feedIdx = 0;
function showLiveToast() {
  const order = liveOrders[feedIdx % liveOrders.length];
  const toast = document.getElementById('liveToast');
  const text = document.getElementById('liveToastText');
  text.innerHTML = '<strong>' + order.name + ' from ' + order.school + '</strong> just ordered a ' + order.type + '<span class="lt-time">' + order.min + ' min ago</span>';
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); feedIdx++; }, 4500);
}
setTimeout(() => { showLiveToast(); setInterval(showLiveToast, 17000); }, 5000);


// ===== INTERACTIVE US MAP =====
document.querySelectorAll('#usMapSvg path').forEach(function (path) {
  var titleEl = path.querySelector('title');
  if (!titleEl) return;
  var name = titleEl.textContent;
  path.addEventListener('mouseenter', function (e) {
    var tip = document.getElementById('mapTooltip');
    if (tip) { tip.textContent = name; tip.classList.add('show'); }
  });
  path.addEventListener('mouseleave', function () {
    var tip = document.getElementById('mapTooltip');
    if (tip) { tip.classList.remove('show'); }
  });
  path.addEventListener('click', function () {
    nav2('home');
  });
});

// ===== FILE ATTACH IN DESCRIPTION =====
(function() {
  var MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  document.querySelectorAll('.fta-file-input').forEach(function(input) {
    var wrap = input.closest('.fta-bottom');
    var list = wrap.querySelector('.fta-file-list');
    var stored = [];

    input.addEventListener('change', function() {
      Array.from(input.files).forEach(function(f) {
        if (f.size > MAX_SIZE) {
          showFileError(list, f.name + ' exceeds 5 MB limit');
          return;
        }
        if (stored.some(function(s) { return s.name === f.name && s.size === f.size; })) return;
        stored.push(f);
        renderChips(list, stored, input);
      });
      input.value = '';
    });
  });

  function renderChips(list, stored, input) {
    list.innerHTML = '';
    stored.forEach(function(f, i) {
      var chip = document.createElement('span');
      chip.className = 'fta-file-chip';
      chip.innerHTML = f.name + ' <button type="button">&times;</button>';
      chip.querySelector('button').addEventListener('click', function() {
        stored.splice(i, 1);
        renderChips(list, stored, input);
      });
      list.appendChild(chip);
    });
    syncFiles(stored, input);
  }

  function syncFiles(stored, input) {
    var dt = new DataTransfer();
    stored.forEach(function(f) { dt.items.add(f); });
    input.files = dt.files;
  }

  function showFileError(list, msg) {
    var el = list.parentElement.querySelector('.fta-file-error');
    if (!el) {
      el = document.createElement('div');
      el.className = 'fta-file-error';
      list.parentElement.appendChild(el);
    }
    el.textContent = msg;
    setTimeout(function() { if (el.parentElement) el.remove(); }, 4000);
  }
})();

