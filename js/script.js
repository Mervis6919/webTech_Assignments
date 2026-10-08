// ICT251 Activity 3 - Mervis 202410672
// Features: Theme Toggle + Mobile Nav + Search/Filter + Calculator + Form Validation

// 1. THEME TOGGLE
const themeBtn = document.getElementById('themeToggle');
if(themeBtn){
  let saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  themeBtn.textContent = saved==='dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  themeBtn.addEventListener('click', ()=>{
    let cur = document.documentElement.getAttribute('data-theme');
    let next = cur==='dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeBtn.textContent = next==='dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

// 2. MOBILE NAV (if you have menuBtn)
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
if(menuBtn && mainNav){
  menuBtn.addEventListener('click', ()=>{
    mainNav.classList.toggle('open');
  });
}

// 3. PROJECT SEARCH + FILTER + RESET + NO RESULTS
const searchBox = document.getElementById('searchBox');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const noResults = document.getElementById('noResults');
const resetBtn = document.getElementById('resetBtn');
let currentFilter = 'all';

function applyFilters(){
  if(!searchBox) return;
  let q = searchBox.value.toLowerCase();
  let visible = 0;
  projectCards.forEach(card=>{
    let cat = (card.dataset.cat || 'all').toLowerCase();
    let text = card.textContent.toLowerCase();
    let okCat = currentFilter==='all' || cat===currentFilter;
    let okSearch = text.includes(q);
    let show = okCat && okSearch;
    card.style.display = show ? '' : 'none';
    if(show) visible++;
  });
  if(noResults) noResults.style.display = visible===0 ? 'block' : 'none';
}
filterBtns.forEach(b=>{
  b.addEventListener('click', ()=>{
    filterBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    currentFilter = b.dataset.filter;
    applyFilters();
  });
});
if(searchBox) searchBox.addEventListener('input', applyFilters);
if(resetBtn) resetBtn.addEventListener('click', ()=>{
  if(searchBox) searchBox.value='';
  currentFilter='all';
  filterBtns.forEach(x=>x.classList.remove('active'));
  let all = document.querySelector('[data-filter="all"]');
  if(all) all.classList.add('active');
  applyFilters();
});

// 4. STUDY CALCULATOR - hours*days, days 1-7 only
const calcBtn = document.getElementById('calcBtn');
if(calcBtn){
  calcBtn.addEventListener('click', ()=>{
    let h = document.getElementById('hoursPerDay').value.trim();
    let d = document.getElementById('daysPerWeek').value.trim();
    let err = document.getElementById('calcError');
    let res = document.getElementById('calcResult');
    err.textContent=''; res.textContent='';
    if(h==='' || d===''){ err.textContent='Both fields required'; return; }
    let hn = Number(h); let dn = Number(d);
    if(isNaN(hn) || isNaN(dn)){ err.textContent='Only numbers allowed'; return; }
    if(hn<0 || dn<0){ err.textContent='No negative values'; return; }
    if(!Number.isInteger(dn) || dn<1 || dn>7){ err.textContent='Days must be integer 1-7'; return; }
    res.textContent = `Total: ${hn*dn} hours per week (${hn}h × ${dn} days)`;
  });
}

// 5. FORM VALIDATION + LIVE PREVIEW + NO DELIVERY
const form = document.getElementById('contactForm');
if(form){
  const preview = document.getElementById('formPreview');
  function updatePreview(){
    let fd = new FormData(form);
    if(preview) preview.innerHTML = `Name: ${fd.get('name')||'-'}<br>Email: ${fd.get('email')||'-'}<br>Message: ${fd.get('message')||'-'}`;
  }
  form.querySelectorAll('input, textarea').forEach(el=> el.addEventListener('input', updatePreview));
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let msg = document.getElementById('message').value.trim();
    let ok = true;
    document.getElementById('err-name').textContent = name.length<2 ? 'Min 2 chars' : '';
    document.getElementById('err-email').textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Invalid email';
    document.getElementById('err-message').textContent = msg.length<10 ? 'Min 10 chars' : '';
    if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || msg.length<10) ok=false;
    if(ok){ alert('Validated! (Demo only - not sending)'); form.reset(); updatePreview(); }
  });
  updatePreview();
}