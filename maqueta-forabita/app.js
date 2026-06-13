const page = document.body.dataset.page || "";

const header = `
  <header class="site-header">
    <div class="container nav-shell">
      <a class="brand" href="index.html" aria-label="Forabita, inicio">
        <img src="assets/forabita-logo.png" alt="">
        <span>Forabita</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-expanded="false">
        <i data-lucide="menu"></i>
      </button>
      <nav class="nav-links" aria-label="Navegación principal">
        <a data-nav="buscar" href="buscar.html">Encuentra tu hogar</a>
        <a data-nav="inicio" href="index.html#como-funciona">Cómo funciona</a>
        <a data-nav="seguridad" href="seguridad.html">Seguridad</a>
        <a data-nav="publicar" href="publicar.html">Soy arrendador</a>
        <div class="nav-actions">
          <a class="button button-secondary" href="acceso.html#login">Iniciar sesión</a>
          <a class="button" href="acceso.html#registro">Crear cuenta</a>
        </div>
      </nav>
    </div>
  </header>`;

const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a class="brand" href="index.html"><img src="assets/forabita-logo.png" alt=""><span>Forabita</span></a>
          <p>Tu lugar, lejos de casa. Vivienda estudiantil clara, segura y pensada para comenzar una nueva etapa.</p>
        </div>
        <div class="footer-group"><strong>Explora</strong><a href="buscar.html">Buscar vivienda</a><a href="index.html#como-funciona">Cómo funciona</a><a href="publicar.html">Publicar inmueble</a></div>
        <div class="footer-group"><strong>Confianza</strong><a href="seguridad.html">Seguridad al rentar</a><a href="seguridad.html#privacidad">Privacidad</a><a href="seguridad.html#consejos">Consejos</a></div>
        <div class="footer-group"><strong>Cuenta</strong><a href="acceso.html#login">Iniciar sesión</a><a href="acceso.html#registro">Crear cuenta</a><a href="#" data-demo="Soporte disponible en la versión final">Soporte</a></div>
      </div>
      <div class="footer-bottom">Forabita. Maqueta académica para demostración. <span data-year></span></div>
    </div>
  </footer>`;

document.querySelector("[data-site-header]")?.insertAdjacentHTML("afterbegin", header);
document.querySelector("[data-site-footer]")?.insertAdjacentHTML("afterbegin", footer);

const siteHeader = document.querySelector(".site-header");
const updateHeaderState = () => siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

document.querySelector(`[data-nav="${page}"]`)?.classList.add("active");
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToSection(target, behavior = reducedMotion ? "auto" : "smooth") {
  target.scrollIntoView({
    behavior,
    block: "start",
  });
}

function rememberScrollTarget(hash) {
  try {
    sessionStorage.setItem("forabita-scroll-target", hash);
  } catch {
    // Local file previews can block session storage.
  }
}

function consumeScrollTarget(hash) {
  try {
    const matches = sessionStorage.getItem("forabita-scroll-target") === hash;
    sessionStorage.removeItem("forabita-scroll-target");
    return matches;
  } catch {
    return false;
  }
}

document.querySelectorAll('a[href*="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href, location.href);
    const sameDocument = url.pathname === location.pathname && url.hash.length > 1;
    if (!sameDocument) {
      if (url.hash.length > 1) rememberScrollTarget(url.hash);
      return;
    }

    const target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();
    history.pushState(null, "", url.hash);
    scrollToSection(target);
  });
});

if (location.hash) {
  const scrollToInitialSection = () => {
    const target = document.querySelector(location.hash);
    if (!target) return;

    const requestedFromNavigation = consumeScrollTarget(location.hash);

    if (requestedFromNavigation && !reducedMotion) window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(target)));
  };

  setTimeout(scrollToInitialSection, 0);
}

const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
document.body.append(toast);
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

const cityOptions = {
  puebla: { value: "puebla", label: "Puebla" },
  cholula: { value: "puebla", label: "Puebla" },
  queretaro: { value: "queretaro", label: "Querétaro" },
  juriquilla: { value: "queretaro", label: "Querétaro" },
  jalisco: { value: "jalisco", label: "Jalisco" },
  guadalajara: { value: "jalisco", label: "Jalisco" },
  zapopan: { value: "jalisco", label: "Jalisco" },
  tlaquepaque: { value: "jalisco", label: "Jalisco" },
  leon: { value: "leon", label: "León" },
  "leon guanajuato": { value: "leon", label: "León" },
  guanajuato: { value: "guanajuato", label: "Guanajuato" },
  "guanajuato capital": { value: "guanajuato", label: "Guanajuato" },
};

function normalizeCity(value) {
  return value
    .trim()
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

document.querySelectorAll("[data-demo]").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(element.dataset.demo || "Acción demostrativa");
  });
});

document.querySelectorAll(".favorite-button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
    const active = button.classList.contains("active");
    button.setAttribute("aria-label", active ? "Quitar de favoritos" : "Guardar en favoritos");
    showToast(active ? "Vivienda guardada en favoritos" : "Vivienda eliminada de favoritos");
  });
});

document.querySelectorAll("form[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    showToast(form.dataset.success || "Formulario enviado correctamente");
    form.reset();
  });
});

const filterForm = document.querySelector("[data-filter-form]");
if (filterForm) {
  const propertyCards = [...document.querySelectorAll("[data-property]")];
  const count = document.querySelector("[data-result-count]");
  const empty = document.querySelector(".empty-state");

  const applyFilters = () => {
    const city = filterForm.elements.city.value;
    const type = filterForm.elements.type.value;
    const max = Number(filterForm.elements.max.value || Infinity);
    let visible = 0;

    propertyCards.forEach((card) => {
      const matches = (!city || card.dataset.city === city)
        && (!type || card.dataset.type === type)
        && Number(card.dataset.price) <= max;
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    const cityLabel = filterForm.elements.city.selectedOptions[0]?.textContent;
    const resultLabel = visible === 1 ? "1 opción encontrada" : `${visible} opciones encontradas`;
    count.textContent = city ? `${resultLabel} en ${cityLabel}` : resultLabel;
    empty.style.display = visible ? "none" : "block";
  };

  filterForm.addEventListener("input", applyFilters);
  filterForm.addEventListener("reset", () => setTimeout(applyFilters));

  const requestedCity = new URLSearchParams(location.search).get("city");
  if (requestedCity && [...filterForm.elements.city.options].some((option) => option.value === requestedCity)) {
    filterForm.elements.city.value = requestedCity;
  }
  applyFilters();
}

const tabs = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll("[data-panel]");

function activateTab(name) {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === name));
}

tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));

if (tabs.length) {
  activateTab(location.hash === "#registro" ? "registro" : "login");
  window.addEventListener("hashchange", () => activateTab(location.hash === "#registro" ? "registro" : "login"));
}

document.querySelector("[data-home-search]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.q;
  const selectedCity = cityOptions[normalizeCity(input.value)];

  if (!selectedCity) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    input.focus();
    showToast("Oops, aún no estamos en tu ciudad. Seguimos creciendo para llegar pronto.");
    return;
  }

  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
  location.href = `buscar.html?city=${encodeURIComponent(selectedCity.value)}`;
});

document.querySelector("[data-home-search] input")?.addEventListener("input", (event) => {
  if (cityOptions[normalizeCity(event.currentTarget.value)]) {
    event.currentTarget.classList.remove("is-invalid");
    event.currentTarget.removeAttribute("aria-invalid");
  }
});

if (window.lucide) window.lucide.createIcons();
