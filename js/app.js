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


// ===== WRITERS AUTO-SCROLL (duplicate for infinite loop) =====
const wt = document.getElementById('writersTrack');
if (wt) wt.innerHTML += wt.innerHTML;


// ===== REVIEWS CAROUSEL (duplicate for infinite scroll) =====
const rt = document.getElementById('revTrack');
if (rt) rt.innerHTML += rt.innerHTML;


// ===== PRICE CALCULATOR =====
function calcPrice() {
  const type = parseFloat(document.getElementById('calcType').value) || 5;
  const deadline = parseFloat(document.getElementById('calcDeadline').value) || 1;
  const level = parseFloat(document.getElementById('calcLevel').value) || 1;
  const price = (type * deadline * level).toFixed(2);
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
