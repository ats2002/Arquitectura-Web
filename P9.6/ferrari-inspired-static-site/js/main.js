// Main JS: slider, countdown, load more news, mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------
     Slider
     ------------------------- */
  const slider = document.getElementById('slider');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('.slider-control.prev');
  const nextBtn = slider.querySelector('.slider-control.next');
  const indicatorsWrap = slider.querySelector('.slider-indicators');
  let current = 0;
  let autoplayInterval = 5000;
  let autoplayId = null;

  // create indicators
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('role','tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.dataset.index = i;
    indicatorsWrap.appendChild(btn);
    btn.addEventListener('click', () => goTo(i));
  });

  function updateSlides() {
    slides.forEach((s, i) => {
      const hidden = i !== current;
      s.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      // update indicators
      const indicator = indicatorsWrap.children[i];
      if (indicator) indicator.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function goTo(index){
    current = (index + slides.length) % slides.length;
    updateSlides();
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  // autoplay with pause on hover/focus
  function startAutoplay(){
    if (autoplayId) return;
    autoplayId = setInterval(next, autoplayInterval);
  }
  function stopAutoplay(){
    clearInterval(autoplayId); autoplayId = null;
  }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  // keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Initialize
  updateSlides();
  startAutoplay();

  /* -------------------------
     Countdown (next race)
     ------------------------- */
  const countdownEl = document.getElementById('countdown');
  // Example next race date — change as needed (YYYY,MM-1,DD,HH,MM,SS) or ISO string:
  const nextRaceDate = new Date('2025-11-15T15:00:00');

  function updateCountdown(){
    const now = new Date();
    const diff = nextRaceDate - now;
    if (diff <= 0){
      countdownEl.textContent = 'Race underway / check schedule';
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = String(Math.floor((diff / (1000*60*60)) % 24)).padStart(2,'0');
    const mins = String(Math.floor((diff / (1000*60)) % 60)).padStart(2,'0');
    const secs = String(Math.floor((diff / 1000) % 60)).padStart(2,'0');
    countdownEl.textContent = `${days}d ${hours}:${mins}:${secs}`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* -------------------------
     Load more news (simulated)
     ------------------------- */
  const loadMoreBtn = document.getElementById('load-more');
  const newsGrid = document.getElementById('news-grid');
  const moreNews = [
    {img:'assets/img/news-4.jpg', date:'2025-07-28', title:'Tech Upgrade', desc:'Overview of the recent upgrade.'},
    {img:'assets/img/news-5.jpg', date:'2025-06-12', title:'Driver Spotlight', desc:'Profile piece on the lead driver.'},
    {img:'assets/img/news-6.jpg', date:'2025-05-02', title:'Behind the Scenes', desc:'A look inside the pit lane.'},
  ];

  loadMoreBtn.addEventListener('click', () => {
    moreNews.forEach(item => {
      const card = document.createElement('article');
      card.className = 'news-card';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        <time datetime="${item.date}">${new Date(item.date).toLocaleDateString()}</time>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <a class="link" href="#" aria-label="Read more about ${item.title}">Read more</a>
      `;
      newsGrid.appendChild(card);
    });
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'All loaded';
  });

  /* -------------------------
     Mobile nav toggle
     ------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.style.display = expanded ? '' : 'flex';
  });

  /* -------------------------
     Small helpers
     ------------------------- */
  // set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
});