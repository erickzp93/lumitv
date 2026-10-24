/**
 * LuminaTV - Motor de Aplicación y Navegación Espacial para Smart TV (Tizen)
 * Diseñado para control remoto (D-Pad), modo día/noche y reanudación automática.
 */

'use strict';

// ============================================================================
// Motor de Depuración en Pantalla y Telemetría Remota (TV -> PC Logger)
// ============================================================================
const APP_VERSION = '1.1.0';
const REMOTE_LOGGER_URL = localStorage.getItem('lumina_logger_url') || '';

const Debugger = {
  enabled: false,
  ready: false,
  logs: [],
  maxLogs: 50,

  init() {
    this.ready = true;
    this.hookConsole();
    this.hookErrors();
    this.info(`LuminaTV v${APP_VERSION} iniciada. UA: ${navigator.userAgent}`);
    this.flushQueuedLogs();
  },

  log(category, message, data = null) {
    const time = new Date().toTimeString().split(' ')[0];
    const logItem = { time, category, message, data };
    this.logs.push(logItem);
    if (this.logs.length > this.maxLogs) this.logs.shift();

    if (this.ready) {
      this.renderLog(logItem);
    }
    this.sendRemote(logItem);
  },

  info(msg, data) { this.log('info', msg, data); },
  warn(msg, data) { this.log('warn', msg, data); },
  error(msg, data) { this.log('error', msg, data); },
  net(msg, data) { this.log('net', msg, data); },
  msg(msg, data) { this.log('msg', msg, data); },

  flushQueuedLogs() {
    if (!this.ready) return;
    const container = document.getElementById('debug-logs-container');
    if (!container) return;
    container.innerHTML = '';
    this.logs.forEach(item => this.renderLog(item));
  },

  renderLog(item) {
    try {
      const container = document.getElementById('debug-logs-container');
      if (!container) return;
      const el = document.createElement('div');
      el.className = `debug-log-line log-${item.category}`;
      el.textContent = `[${item.time}] [${item.category.toUpperCase()}] ${item.message}${item.data ? ' ' + (typeof item.data === 'object' ? JSON.stringify(item.data) : item.data) : ''}`;
      container.appendChild(el);
      container.scrollTop = container.scrollHeight;
      this.updateStatusBar();
    } catch (e) {}
  },

  updateStatusBar() {
    if (!this.ready) return;
    const bar = document.getElementById('debug-status-bar');
    if (!bar) return;
    try {
      const srv = (typeof STREAM_SERVERS !== 'undefined' && typeof State !== 'undefined' && STREAM_SERVERS[State.activeServerIndex]) 
        ? STREAM_SERVERS[State.activeServerIndex].name 
        : 'N/A';
      const media = (typeof State !== 'undefined' && State.currentMedia) 
        ? (State.currentMedia.title || State.currentMedia.name) 
        : 'Ninguno';
      const cur = (typeof formatTime === 'function' && typeof State !== 'undefined') ? formatTime(State.currentTime) : '00:00';
      const dur = (typeof formatTime === 'function' && typeof State !== 'undefined') ? formatTime(State.duration) : '00:00';
      const isPlay = (typeof State !== 'undefined') ? State.isPlaying : false;
      const curView = (typeof State !== 'undefined') ? State.currentView : 'home';
      bar.textContent = `Vista: ${curView} | Media: ${media} | Servidor: ${srv} | Tiempo: ${cur}/${dur} | Play: ${isPlay}`;
    } catch (e) {}
  },

  sendRemote(item) {
    try {
      if (REMOTE_LOGGER_URL && typeof fetch === 'function') {
        fetch(REMOTE_LOGGER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        }).catch(() => {});
      }
    } catch (e) {}
  },

  toggle() {
    this.enabled = !this.enabled;
    const overlay = document.getElementById('debug-overlay');
    if (!overlay) return;
    overlay.style.display = this.enabled ? 'flex' : 'none';
    if (this.enabled) {
      this.updateStatusBar();
      showToast('Consola de Depuración (Pulsa 9 para Ocultar)');
    } else {
      showToast('Consola Ocultada');
    }
  },

  clear() {
    this.logs = [];
    const container = document.getElementById('debug-logs-container');
    if (container) container.innerHTML = '';
  },

  hookConsole() {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args) => {
      origLog.apply(console, args);
      this.info(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };
    console.warn = (...args) => {
      origWarn.apply(console, args);
      this.warn(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };
    console.error = (...args) => {
      origError.apply(console, args);
      this.error(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };
  },

  hookErrors() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (e) => {
        this.error(`Error no controlado: ${e.message} at ${e.filename}:${e.lineno}`);
      });
      window.addEventListener('unhandledrejection', (e) => {
        this.error(`Promesa rechazada: ${e.reason}`);
      });
    }
  }
};

// ============================================================================
// Configuración & Constantes
// ============================================================================
const TMDB_API_KEY = '4ef0d7355d9ffb5151e987764708ce96';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p';

// La disponibilidad y los formatos dependen de cada proveedor.
const STREAM_SERVERS = [
  {
    id: 'vidlink',
    name: 'VidLink',
    type: 'embed',
    movieUrl: (id) => `https://vidlink.pro/movie/${id}?autoplay=false&poster=true&primaryColor=0284c7&secondaryColor=0f172a&iconColor=ffffff`,
    tvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=false&poster=true&primaryColor=0284c7&secondaryColor=0f172a&iconColor=ffffff`
  },
  {
    id: 'multiembed',
    name: 'SuperEmbed VIP (Multi-Servidor / Latino)',
    type: 'embed',
    movieUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tvUrl: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
  },
  {
    id: '2embed',
    name: '2Embed HD (Servidor Alternativo 1)',
    type: 'embed',
    movieUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    tvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
  },
  {
    id: 'vidsrc-to',
    name: 'VidSrc TO (Servidor Alternativo 2)',
    type: 'embed',
    movieUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
  },
  {
    id: 'vidsrc-pm',
    name: 'VidSrc PM (Servidor Alternativo 3)',
    type: 'embed',
    movieUrl: (id) => `https://vidsrc.pm/embed/movie?tmdb=${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.pm/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
  }
];

// ============================================================================
// Estado Global de la App
// ============================================================================
const State = {
  theme: localStorage.getItem('lumina_theme') || 'day',
  history: JSON.parse(localStorage.getItem('lumina_history') || '[]'),
  currentView: 'home', // 'home' | 'modal-details' | 'modal-search' | 'player'
  currentMedia: null,  // { id, media_type, title, name, poster_path, backdrop_path, ... }
  selectedSeason: 1,
  selectedEpisode: 1,
  activeServerIndex: 0,
  
  // Reproductor
  playerMode: 'embed', // 'native' | 'embed'
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  hudTimer: null,
  hlsInstance: null,
  playerSession: 0,
  resumeAt: 0,
  hasPlaybackSample: false,
  lastSavedTime: null,
  lastSavedAt: 0,
  commandBusy: false,
  
  // Ratón Virtual (para navegar servidores embed)
  virtualCursorActive: false,
  cursorX: window.innerWidth / 2,
  cursorY: window.innerHeight / 2,
  cursorSpeed: 28,

  // Navegación
  currentFocusedElement: null
};

// ============================================================================
// Gestor de Modo Día y Noche
// ============================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', State.theme);
  updateThemeIcons();
}

function toggleTheme() {
  State.theme = State.theme === 'day' ? 'night' : 'day';
  localStorage.setItem('lumina_theme', State.theme);
  document.documentElement.setAttribute('data-theme', State.theme);
  updateThemeIcons();
  showToast(`Modo ${State.theme === 'day' ? 'Día (Claro)' : 'Noche (Oscuro)'} activado`);
}

function updateThemeIcons() {
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  if (State.theme === 'day') {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
}

// ============================================================================
// Historial y Reanudación de Avance (Resume Tracker)
// ============================================================================
function saveProgress(media, currentTime, duration) {
  if (!media || !media.id || !Number.isFinite(currentTime) || !Number.isFinite(duration) || currentTime <= 5 || duration <= 0 || currentTime > duration) return;
  
  const percent = Math.min(100, Math.round((currentTime / duration) * 100));
  const isTv = media.media_type === 'tv' || media.mediaType === 'tv';
  
  const historyItem = {
    id: media.id,
    media_type: isTv ? 'tv' : 'movie',
    title: media.title || media.name || 'Título',
    poster_path: media.poster_path,
    backdrop_path: media.backdrop_path,
    season: isTv ? State.selectedSeason : null,
    episode: isTv ? State.selectedEpisode : null,
    currentTime: Math.floor(currentTime),
    duration: Math.floor(duration),
    percent: percent,
    updatedAt: Date.now()
  };

  // Filtrar si ya existía para ponerlo de primero
  State.history = State.history.filter(item => !(item.id === media.id && (!isTv || (item.season === historyItem.season && item.episode === historyItem.episode))));
  State.history.unshift(historyItem);
  
  // Limitar a los últimos 20
  if (State.history.length > 20) State.history.pop();
  
  localStorage.setItem('lumina_history', JSON.stringify(State.history));
  renderContinueWatching();
}

function getSavedProgress(mediaId, season = null, episode = null) {
  return State.history.find(item => {
    if (item.id !== mediaId) return false;
    if (season && item.season !== season) return false;
    if (episode && item.episode !== episode) return false;
    return true;
  });
}

function renderContinueWatching() {
  const row = document.getElementById('row-continue-watching');
  const carousel = document.getElementById('carousel-continue-watching');
  if (!State.history || State.history.length === 0) {
    row.style.display = 'none';
    return;
  }
  
  row.style.display = 'block';
  carousel.innerHTML = '';

  State.history.forEach(item => {
    const card = document.createElement('div');
    card.className = 'media-card focusable';
    card.tabIndex = 0;
    
    const posterSrc = item.backdrop_path 
      ? `${TMDB_IMG_URL}/w300${item.backdrop_path}` 
      : item.poster_path 
        ? `${TMDB_IMG_URL}/w342${item.poster_path}` 
        : 'https://via.placeholder.com/300x169?text=Sin+Imagen';

    const epText = item.season ? `T${item.season}:E${item.episode}` : 'Película';
    
    card.innerHTML = `
      <div class="media-poster-wrap" style="aspect-ratio: 16/9;">
        <img class="media-poster" src="${posterSrc}" alt="${item.title}" loading="lazy" />
        <div class="card-rating" style="color: #38bdf8;">${item.percent}%</div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: ${item.percent}%;"></div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-sub">
          <span>${epText}</span>
          <span style="color: var(--accent-primary); font-weight:700;">Reanudar</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openDetails(item, true); // Pasar true para mostrar botón de reanudar destacado
    });

    carousel.appendChild(card);
  });
}

// ============================================================================
// Motor de Navegación Espacial (Control Remoto 100% Funcional)
// ============================================================================
function getFocusableElements(container = document.body) {
  const selector = 'button:not([disabled]):not([style*="display: none"]), .focusable:not([disabled]):not([style*="display: none"]), input:not([disabled])';
  return Array.from(container.querySelectorAll(selector)).filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
  });
}

function setFocus(el) {
  if (!el) return;
  if (State.currentFocusedElement) {
    State.currentFocusedElement.classList.remove('focused');
  }
  State.currentFocusedElement = el;
  el.classList.add('focused');
  el.focus();
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function navigateDirection(direction) {
  if (State.virtualCursorActive) {
    moveVirtualCursor(direction);
    return;
  }

  const current = State.currentFocusedElement;
  let activeScope = document.body;
  if (State.currentView === 'modal-details') activeScope = document.getElementById('modal-details');
  else if (State.currentView === 'modal-search') activeScope = document.getElementById('modal-search');
  else if (State.currentView === 'player') {
    const prompt = document.getElementById('player-start-overlay');
    activeScope = prompt && prompt.style.display !== 'none' ? prompt : document.getElementById('player-hud');
  }

  const elements = getFocusableElements(activeScope);
  if (!elements.length) return;

  if (!current || !elements.includes(current)) {
    setFocus(elements[0]);
    return;
  }

  const currentRect = current.getBoundingClientRect();
  const currentCenter = {
    x: currentRect.left + currentRect.width / 2,
    y: currentRect.top + currentRect.height / 2
  };

  let bestCandidate = null;
  let bestDistance = Infinity;

  elements.forEach(el => {
    if (el === current) return;
    const rect = el.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const deltaX = center.x - currentCenter.x;
    const deltaY = center.y - currentCenter.y;

    let isValidDirection = false;
    let primaryDistance = 0;
    let secondaryDistance = 0;

    switch (direction) {
      case 'left':
        isValidDirection = deltaX < -10;
        primaryDistance = Math.abs(deltaX);
        secondaryDistance = Math.abs(deltaY);
        break;
      case 'right':
        isValidDirection = deltaX > 10;
        primaryDistance = Math.abs(deltaX);
        secondaryDistance = Math.abs(deltaY);
        break;
      case 'up':
        isValidDirection = deltaY < -10;
        primaryDistance = Math.abs(deltaY);
        secondaryDistance = Math.abs(deltaX);
        break;
      case 'down':
        isValidDirection = deltaY > 10;
        primaryDistance = Math.abs(deltaY);
        secondaryDistance = Math.abs(deltaX);
        break;
    }

    if (isValidDirection) {
      // Ponderar la distancia del eje principal con el eje perpendicular
      const distance = primaryDistance + secondaryDistance * 2.5;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestCandidate = el;
      }
    }
  });

  if (bestCandidate) {
    setFocus(bestCandidate);
  }
}

// ============================================================================
// Ratón Virtual Emulado (Para Servidores Embed / Iframes)
// ============================================================================
function toggleVirtualCursor() {
  State.virtualCursorActive = !State.virtualCursorActive;
  const cursorEl = document.getElementById('virtual-cursor');
  
  if (State.virtualCursorActive) {
    cursorEl.style.display = 'block';
    State.cursorX = window.innerWidth / 2;
    State.cursorY = window.innerHeight / 2;
    updateCursorPosition();
    showToast('Modo Ratón Virtual Activado: Usa las flechas para moverte y OK para pulsar Play');
  } else {
    cursorEl.style.display = 'none';
    showToast('Modo Control Remoto Normal');
    setFocus(document.getElementById('btn-hud-playpause') || document.getElementById('btn-hud-close'));
  }
}

function moveVirtualCursor(direction) {
  const step = State.cursorSpeed;
  if (direction === 'left') State.cursorX = Math.max(10, State.cursorX - step);
  if (direction === 'right') State.cursorX = Math.min(window.innerWidth - 10, State.cursorX + step);
  if (direction === 'up') State.cursorY = Math.max(10, State.cursorY - step);
  if (direction === 'down') State.cursorY = Math.min(window.innerHeight - 10, State.cursorY + step);
  updateCursorPosition();
}

function updateCursorPosition() {
  const cursorEl = document.getElementById('virtual-cursor');
  cursorEl.style.left = `${State.cursorX}px`;
  cursorEl.style.top = `${State.cursorY}px`;
}

function clickVirtualCursor() {
  const cursor = document.getElementById('virtual-cursor');
  cursor.classList.add('clicking');
  setTimeout(() => cursor.classList.remove('clicking'), 150);
  const hud = document.getElementById('player-hud');
  const visible = !hud.classList.contains('hidden');
  hud.classList.add('hidden');
  const frame = document.getElementById('player-iframe');
  const rect = frame.getBoundingClientRect();
  if (State.cursorX >= rect.left && State.cursorX <= rect.right && State.cursorY >= rect.top && State.cursorY <= rect.bottom) {
    sendPlayerCommand('click', {x:State.cursorX - rect.left, y:State.cursorY - rect.top});
  } else {
    const target = document.elementFromPoint(State.cursorX, State.cursorY);
    if (target && typeof target.click === 'function') target.click();
  }
  if (visible) hud.classList.remove('hidden');
}

// ============================================================================
// Catálogo y Consumo de TMDB
// ============================================================================
async function fetchTmdb(endpoint) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=es-MX`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching TMDB:', err);
    return null;
  }
}

async function loadInitialData() {
  const [trendingMovies, popularSeries, topRated] = await Promise.all([
    fetchTmdb('/trending/movie/week'),
    fetchTmdb('/tv/popular'),
    fetchTmdb('/movie/top_rated')
  ]);

  // Hero Banner
  if (trendingMovies && trendingMovies.results && trendingMovies.results.length > 0) {
    setupHeroBanner(trendingMovies.results[0]);
  }

  // Filas
  renderCarousel('carousel-trending-movies', (trendingMovies && trendingMovies.results) ? trendingMovies.results.slice(1, 15) : [], 'movie');
  renderCarousel('carousel-popular-series', (popularSeries && popularSeries.results) ? popularSeries.results.slice(0, 15) : [], 'tv');
  renderCarousel('carousel-top-rated', (topRated && topRated.results) ? topRated.results.slice(0, 15) : [], 'movie');

  renderContinueWatching();
  setFocus(document.getElementById('hero-play-btn'));
}

function setupHeroBanner(item) {
  State.currentMedia = item;
  document.getElementById('hero-title').textContent = item.title || item.name;
  document.getElementById('hero-desc').textContent = item.overview || 'Sin descripción disponible.';
  document.getElementById('hero-year').textContent = (item.release_date || item.first_air_date || '2026').split('-')[0];
  document.getElementById('hero-rating').textContent = `★ ${item.vote_average ? item.vote_average.toFixed(1) : '8.0'}`;
  document.getElementById('hero-type').textContent = item.title ? 'Película' : 'Serie';
  
  if (item.backdrop_path) {
    document.getElementById('hero-backdrop').src = `${TMDB_IMG_URL}/w1280${item.backdrop_path}`;
  }

  document.getElementById('hero-play-btn').onclick = () => openPlayer(item);
  document.getElementById('hero-details-btn').onclick = () => openDetails(item);
}

function renderCarousel(carouselId, items, mediaType) {
  const container = document.getElementById(carouselId);
  container.innerHTML = '';

  items.forEach(item => {
    item.media_type = item.media_type || mediaType;
    const card = document.createElement('div');
    card.className = 'media-card focusable';
    card.tabIndex = 0;

    const poster = item.poster_path 
      ? `${TMDB_IMG_URL}/w342${item.poster_path}` 
      : 'https://via.placeholder.com/300x450?text=Sin+Poster';

    card.innerHTML = `
      <div class="media-poster-wrap">
        <img class="media-poster" src="${poster}" alt="${item.title || item.name}" loading="lazy" />
        <div class="card-rating">★ ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</div>
      </div>
      <div class="card-info">
        <div class="card-title">${item.title || item.name}</div>
        <div class="card-sub">
          <span>${(item.release_date || item.first_air_date || '').split('-')[0]}</span>
          <span>${item.title ? 'Película' : 'Serie'}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openDetails(item));
    container.appendChild(card);
  });
}

// ============================================================================
// Modal de Detalles y Selección de Temporadas/Episodios
// ============================================================================
async function openDetails(media, highlightResume = false) {
  State.lastFocusedCard = State.currentFocusedElement;
  State.currentMedia = media;
  State.currentView = 'modal-details';
  const modal = document.getElementById('modal-details');
  modal.style.display = 'flex';

  document.getElementById('details-title').textContent = media.title || media.name;
  document.getElementById('details-overview').textContent = media.overview || 'Sin descripción.';
  document.getElementById('details-year').textContent = (media.release_date || media.first_air_date || '2026').split('-')[0];
  document.getElementById('details-rating').textContent = `★ ${media.vote_average ? media.vote_average.toFixed(1) : '8.0'}`;
  
  if (media.poster_path) {
    document.getElementById('details-poster').src = `${TMDB_IMG_URL}/w500${media.poster_path}`;
  }

  // Verificar si hay avance guardado
  const saved = getSavedProgress(media.id);
  const resumeBtn = document.getElementById('btn-details-resume');
  if (saved && saved.currentTime > 15) {
    resumeBtn.style.display = 'flex';
    document.getElementById('resume-time-label').textContent = formatTime(saved.currentTime);
    resumeBtn.onclick = () => openPlayer(media, saved.currentTime, saved.season, saved.episode);
  } else {
    resumeBtn.style.display = 'none';
  }

  document.getElementById('btn-details-play').onclick = () => openPlayer(media, 0, 1, 1);

  // Manejo de Series (Temporadas y Episodios)
  const isTv = media.media_type === 'tv' || media.mediaType === 'tv';
  const seriesWrap = document.getElementById('series-episodes-wrap');
  
  if (isTv) {
    seriesWrap.style.display = 'block';
    await loadSeasonsAndEpisodes(media.id);
  } else {
    seriesWrap.style.display = 'none';
  }

  setFocus(highlightResume && saved ? resumeBtn : document.getElementById('btn-details-play'));
}

async function loadSeasonsAndEpisodes(tvId) {
  const details = await fetchTmdb(`/tv/${tvId}`);
  const seasonsTabs = document.getElementById('seasons-tab-row');
  seasonsTabs.innerHTML = '';

  const seasons = (details.seasons || []).filter(s => s.season_number > 0);
  
  seasons.forEach((season, idx) => {
    const btn = document.createElement('button');
    btn.className = `btn-secondary focusable ${idx === 0 ? 'active' : ''}`;
    btn.textContent = `Temporada ${season.season_number}`;
    btn.onclick = () => {
      Array.from(seasonsTabs.children).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.selectedSeason = season.season_number;
      fetchEpisodes(tvId, season.season_number);
    };
    seasonsTabs.appendChild(btn);
  });

  if (seasons.length > 0) {
    State.selectedSeason = seasons[0].season_number;
    fetchEpisodes(tvId, seasons[0].season_number);
  }
}

async function fetchEpisodes(tvId, seasonNumber) {
  const container = document.getElementById('episodes-container');
  container.innerHTML = '<p style="color:var(--text-muted)">Cargando episodios...</p>';
  
  const seasonData = await fetchTmdb(`/tv/${tvId}/season/${seasonNumber}`);
  container.innerHTML = '';

  if (seasonData && seasonData.episodes) {
    seasonData.episodes.forEach(ep => {
      const card = document.createElement('button');
      card.className = 'episode-card focusable';
      card.innerHTML = `
        <h4>Capítulo ${ep.episode_number}</h4>
        <p style="font-size:0.75rem; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${ep.name || ''}</p>
      `;
      card.onclick = () => {
        State.selectedEpisode = ep.episode_number;
        openPlayer(State.currentMedia, 0, seasonNumber, ep.episode_number);
      };
      container.appendChild(card);
    });
  }
}

function closeDetails() {
  document.getElementById('modal-details').style.display = 'none';
  const modalSearch = document.getElementById('modal-search');
  if (modalSearch && modalSearch.style.display === 'flex') {
    State.currentView = 'modal-search';
    setFocus(document.getElementById('search-input'));
  } else {
    State.currentView = 'home';
    if (State.lastFocusedCard && document.body.contains(State.lastFocusedCard)) {
      setFocus(State.lastFocusedCard);
    } else {
      setFocus(document.getElementById('hero-play-btn'));
    }
  }
}

// ============================================================================
// Reproductor de Video (Directo & Embed con Soporte de Ratón Virtual)
// ============================================================================
// ============================================================================
// Reproductor de Video (Directo & Embed con Soporte de Ratón Virtual & Sincronización)
// ============================================================================
function updateHudTimeline(currentTime, duration) {
  const curEl = document.getElementById('time-current');
  const durEl = document.getElementById('time-duration');
  const fillEl = document.getElementById('timeline-filled');
  
  if (curEl) curEl.textContent = formatTime(currentTime);
  if (durEl) {
    if (duration && duration > 0) {
      durEl.textContent = formatTime(duration);
    } else {
      durEl.textContent = '--:--:--';
    }
  }
  if (fillEl && duration && duration > 0) {
    const pct = Math.min(100, Math.max(0, (currentTime / duration) * 100));
    fillEl.style.width = `${pct.toFixed(2)}%`;
  }
}

function saveConfirmedProgress(force = false) {
  if (!State.hasPlaybackSample || !State.currentMedia || State.lastSavedTime === State.currentTime) return;
  if (!force && Date.now() - State.lastSavedAt < 5000) return;
  if (State.currentTime <= 5 || State.duration <= 0) return;
  saveProgress(State.currentMedia, State.currentTime, State.duration);
  State.lastSavedAt = Date.now();
  State.lastSavedTime = State.currentTime;
}

function applyPlaybackSnapshot(snapshot) {
  if (snapshot.error || !Number.isFinite(snapshot.currentTime) || snapshot.currentTime < 0 ||
      !Number.isFinite(snapshot.duration) || snapshot.duration <= 0 || snapshot.currentTime > snapshot.duration) return;
  State.hasPlaybackSample = true;
  State.currentTime = snapshot.currentTime;
  State.duration = snapshot.duration;
  if (typeof snapshot.paused === 'boolean') State.isPlaying = !snapshot.paused && !snapshot.ended;
  const play = document.getElementById('icon-play');
  const pause = document.getElementById('icon-pause');
  if (play) play.style.display = State.isPlaying ? 'none' : 'block';
  if (pause) pause.style.display = State.isPlaying ? 'block' : 'none';
  updateHudTimeline(State.currentTime, State.duration);
  saveConfirmedProgress(!State.isPlaying);
  Debugger.updateStatusBar();
}

// Only accept telemetry from the active frame, origin, title and episode.
// The native bridge supplies authoritative samples, including paused state.
window.addEventListener('message', (event) => {
  if (State.currentView !== 'player') return;
  const frame = document.getElementById('player-iframe');
  if (!frame || event.source !== frame.contentWindow) return;
  let data = event.data;
  try {
    if (event.origin !== new URL(frame.src).origin) return;
    if (typeof data === 'string') {
      if (data.length > 100000) return;
      data = JSON.parse(data);
    }
  } catch (error) { return; }
  if (!data || !['MEDIA_DATA', 'PLAYER_EVENT'].includes(data.type)) return;
  if (data.type === 'MEDIA_DATA') {
    // This contains the provider's entire saved history, not a live clock.
    // Never overwrite current playback or store unrelated titles from it.
    return;
  }
  const payload = data.data;
  const media = State.currentMedia;
  if (!payload || !media || String(payload.mtmdbId || payload.tmdbId || payload.id) !== String(media.id)) return;
  const isTv = media.media_type === 'tv' || media.mediaType === 'tv';
  if (isTv && (Number(payload.season) !== Number(State.selectedSeason) || Number(payload.episode) !== Number(State.selectedEpisode))) return;
  if (window.LuminaBridge.connected && Date.now() - window.LuminaBridge.lastSeen < 5000) return;
  const paused = ['pause', 'ended'].includes(payload.event) ? true : payload.event === 'play' ? false : undefined;
  applyPlaybackSnapshot({currentTime:payload.currentTime, duration:payload.duration, paused, ended:payload.event === 'ended'});
});

function resetPlayerFrame() {
  const oldFrame = document.getElementById('player-iframe');
  const freshFrame = oldFrame.cloneNode(false);
  freshFrame.removeAttribute('src');
  freshFrame.style.display = 'none';
  // Remove the cross-origin window synchronously before Tizen forwards Back.
  oldFrame.parentNode.replaceChild(freshFrame, oldFrame);
  return freshFrame;
}

function openPlayer(media, startTime = 0, season = 1, episode = 1) {
  saveConfirmedProgress(true);
  State.hasPlaybackSample = false;
  State.currentMedia = media;
  State.currentView = 'player';
  State.selectedSeason = season || 1;
  State.selectedEpisode = episode || 1;
  document.getElementById('modal-details').style.display = 'none';
  document.getElementById('player-container').style.display = 'flex';
  const isTv = media.media_type === 'tv' || media.mediaType === 'tv';
  document.getElementById('hud-media-title').textContent = media.title || media.name || 'Reproduciendo';
  document.getElementById('hud-media-sub').textContent = isTv ? `Temporada ${State.selectedSeason} • Episodio ${State.selectedEpisode}` : 'Película';
  loadStream(startTime);
}

function showStartPrompt(message) {
  const overlay = document.getElementById('player-start-overlay');
  overlay.style.display = 'flex';
  document.getElementById('player-start-hint').textContent = message || 'Pulsa OK para iniciar el video con sonido. Atrás cierra el reproductor.';
  const button = document.getElementById('btn-start-play');
  button.disabled = false;
  button.querySelector('span').textContent = 'PULSA OK PARA REPRODUCIR';
  wakeHud();
  setFocus(button);
}

async function activatePlayerFromStartPrompt() {
  if (State.commandBusy || State.currentView !== 'player') return;
  const session = State.playerSession;
  State.commandBusy = true;
  const button = document.getElementById('btn-start-play');
  button.querySelector('span').textContent = 'INICIANDO VIDEO…';
  document.getElementById('player-start-hint').textContent = 'Preparando imagen y sonido. Puedes pulsar Atrás para salir.';
  const deadline = Date.now() + 30000;
  let lastError;
  try {
    while (Date.now() < deadline && State.playerSession === session) {
      try {
        const sample = await window.LuminaBridge.request('play', {startAt:State.resumeAt, volume:0.5});
        if (!sample || sample.paused) throw new Error('VIDEO_NOT_READY');
        if (State.playerSession !== session) return;
        document.getElementById('player-start-overlay').style.display = 'none';
        setFocus(document.getElementById('btn-hud-playpause'));
        showToast('Reproduciendo con sonido');
        wakeHud();
        return;
      } catch (error) {
        lastError = error;
        if (!['VIDEO_NOT_READY', 'BRIDGE_OFFLINE', 'APP_NOT_READY'].includes(error.message)) throw error;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    if (State.playerSession === session) throw lastError || new Error('VIDEO_NOT_READY');
  } catch (error) {
    if (State.playerSession !== session) return;
    Debugger.error('No se pudo iniciar el video: ' + error.message);
    showStartPrompt(error.message === 'BRIDGE_OFFLINE'
      ? 'El control de video no está conectado. Vuelve a TizenBrew, actualiza el módulo y ábrelo en modo Debug.'
      : 'El servidor no pudo iniciar este video. Puedes reintentar o cambiar de servidor.');
  } finally {
    if (State.playerSession === session) State.commandBusy = false;
  }
}

function loadStream(startTime = 0) {
  if (!State.currentMedia) return;
  saveConfirmedProgress(true);
  State.playerSession += 1;
  State.commandBusy = false;
  State.hasPlaybackSample = false;
  State.lastSavedTime = null;
  State.lastSavedAt = 0;
  State.resumeAt = Number.isFinite(startTime) ? Math.max(0, startTime) : 0;
  State.currentTime = 0;
  State.duration = 0;
  State.isPlaying = false;
  clearTimeout(State.hudTimer);
  // Also stop a tracker left by an older version during a debug upgrade.
  if (window.progressInterval) clearInterval(window.progressInterval);
  if (State.virtualCursorActive) toggleVirtualCursor();
  const server = STREAM_SERVERS[State.activeServerIndex];
  const media = State.currentMedia;
  const isTv = media.media_type === 'tv' || media.mediaType === 'tv';
  const streamUrl = isTv ? server.tvUrl(media.id, State.selectedSeason, State.selectedEpisode) : server.movieUrl(media.id);
  document.getElementById('hud-server-name').textContent = server.name;
  document.getElementById('player-video').style.display = 'none';
  const frame = resetPlayerFrame();
  frame.style.display = 'block';
  frame.onload = () => Debugger.info(`Página de ${server.name} cargada; esperando video real`);
  frame.onerror = () => Debugger.error(`No se pudo cargar ${server.name}`);
  frame.src = streamUrl;
  document.getElementById('icon-play').style.display = 'block';
  document.getElementById('icon-pause').style.display = 'none';
  document.getElementById('timeline-filled').style.width = '0%';
  updateHudTimeline(0, 0);
  Debugger.net(`Abriendo ${server.name}`);
  showStartPrompt();
}

async function sendPlayerCommand(action, options = {}) {
  if (State.currentView !== 'player' || State.commandBusy) return;
  const session = State.playerSession;
  State.commandBusy = true;
  try {
    await window.LuminaBridge.request(action, options);
    if (session === State.playerSession) wakeHud();
  } catch (error) {
    if (session !== State.playerSession) return;
    Debugger.warn(`Control de video: ${error.message}`);
    showToast(error.message === 'BRIDGE_OFFLINE' ? 'Abre el módulo desde TizenBrew en modo Debug' : 'El video aún no está listo. Reintenta o cambia de servidor.');
  } finally {
    if (session === State.playerSession) State.commandBusy = false;
  }
}

function togglePlayPause() { return sendPlayerCommand('toggle', {volume:0.5}); }
function seekBy(seconds) { return sendPlayerCommand('seek', {seconds}); }

function wakeHud() {
  const hud = document.getElementById('player-hud');
  hud.classList.remove('hidden');
  clearTimeout(State.hudTimer);
  State.hudTimer = setTimeout(() => {
    const overlay = document.getElementById('player-start-overlay');
    if (State.currentView === 'player' && !State.virtualCursorActive && overlay.style.display === 'none') hud.classList.add('hidden');
  }, 4500);
}

function closePlayer() {
  saveConfirmedProgress(true);
  State.playerSession += 1;
  State.commandBusy = false;
  State.hasPlaybackSample = false;
  State.isPlaying = false;
  clearTimeout(State.hudTimer);
  if (window.progressInterval) clearInterval(window.progressInterval);
  resetPlayerFrame();
  document.getElementById('player-container').style.display = 'none';
  document.getElementById('player-start-overlay').style.display = 'none';
  if (State.virtualCursorActive) toggleVirtualCursor();
  document.getElementById('modal-details').style.display = 'none';
  renderContinueWatching();
  const search = document.getElementById('modal-search');
  State.currentView = search && search.style.display === 'flex' ? 'modal-search' : 'home';
  if (State.lastFocusedCard && document.body.contains(State.lastFocusedCard)) setFocus(State.lastFocusedCard);
  else setFocus(document.getElementById(State.currentView === 'modal-search' ? 'search-input' : 'hero-play-btn'));
}

function cycleServer() {
  const resumeAt = State.hasPlaybackSample ? State.currentTime : State.resumeAt;
  State.activeServerIndex = (State.activeServerIndex + 1) % STREAM_SERVERS.length;
  loadStream(resumeAt);
}

// ============================================================================
// Buscador
// ============================================================================
function openSearchModal() {
  State.currentView = 'modal-search';
  const modal = document.getElementById('modal-search');
  modal.style.display = 'flex';
  const input = document.getElementById('search-input');
  input.value = '';
  document.getElementById('search-results-grid').innerHTML = '';
  setFocus(input);
}

async function performSearch() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;

  const results = await fetchTmdb(`/search/multi?query=${encodeURIComponent(query)}`);
  const container = document.getElementById('search-results-grid');
  container.innerHTML = '';

  if (results && results.results && results.results.length > 0) {
    const filtered = results.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    renderCarousel('search-results-grid', filtered, 'movie');
  } else {
    container.innerHTML = '<p style="color:var(--text-muted); padding:2rem;">No se encontraron resultados.</p>';
  }
}

function closeSearchModal() {
  document.getElementById('modal-search').style.display = 'none';
  State.currentView = 'home';
  setFocus(document.getElementById('btn-search-toggle'));
}

// ============================================================================
// Utilidades (Toast, Tiempos)
// ============================================================================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// ============================================================================
// Controlador de Eventos de Teclado y Control Remoto Samsung
// ============================================================================
let lastBackAt = 0;
function handleBack() {
  if (Date.now() - lastBackAt < 250) return true;
  if (State.currentView === 'player') closePlayer();
  else if (State.currentView === 'modal-details') closeDetails();
  else if (State.currentView === 'modal-search') closeSearchModal();
  else return false;
  lastBackAt = Date.now();
  return true;
}

document.addEventListener('tizenhwkey', (event) => {
  if (event.keyName === 'back' && handleBack()) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);

document.addEventListener('keydown', (event) => {
  const code = event.keyCode;
  const key = event.key;
  const input = event.target && ['INPUT', 'TEXTAREA'].includes(event.target.tagName);
  let handled = true;
  if ([10009, 27].includes(code) || (code === 8 && !input)) handled = handleBack();
  else if (input) return;
  else if ([57, 457, 458].includes(code) || ['Info', 'Guide'].includes(key)) Debugger.toggle();
  else if (code === 48 && State.currentView === 'player') toggleVirtualCursor();
  else if (State.currentView === 'player' && (code === 415 || key === 'MediaPlay')) {
    if (document.getElementById('player-start-overlay').style.display !== 'none') activatePlayerFromStartPrompt();
    else sendPlayerCommand('play', {volume:0.5});
  } else if (State.currentView === 'player' && (code === 19 || key === 'MediaPause')) sendPlayerCommand('pause');
  else if (State.currentView === 'player' && (code === 10252 || key === 'MediaPlayPause')) {
    if (document.getElementById('player-start-overlay').style.display !== 'none') activatePlayerFromStartPrompt();
    else togglePlayPause();
  }
  else if (State.currentView === 'player' && (code === 413 || key === 'MediaStop')) closePlayer();
  else if (State.currentView === 'player' && (code === 417 || key === 'MediaFastForward')) seekBy(10);
  else if (State.currentView === 'player' && (code === 412 || key === 'MediaRewind')) seekBy(-10);
  else if ([37, 38, 39, 40].includes(code)) {
    const hidden = State.currentView === 'player' && document.getElementById('player-hud').classList.contains('hidden');
    if (hidden && !State.virtualCursorActive) {
      if (code === 37 || code === 39) seekBy(code === 37 ? -10 : 10);
      else { wakeHud(); setFocus(document.getElementById('btn-hud-playpause')); }
    } else navigateDirection({37:'left', 38:'up', 39:'right', 40:'down'}[code]);
  } else if (code === 13 || code === 32) {
    if (State.virtualCursorActive) clickVirtualCursor();
    else if (State.currentView === 'player' && document.getElementById('player-hud').classList.contains('hidden')) togglePlayPause();
    else if (State.currentFocusedElement) State.currentFocusedElement.click();
  } else handled = false;
  if (handled) { event.preventDefault(); event.stopPropagation(); }
}, true);

// ============================================================================
// Inicialización General
// ============================================================================
function initApp() {
  Debugger.init();
  initTheme();
  loadInitialData();

  // Enlazar botones estáticos
  document.getElementById('btn-theme-toggle').onclick = toggleTheme;
  document.getElementById('btn-search-toggle').onclick = openSearchModal;
  document.getElementById('btn-close-search').onclick = closeSearchModal;
  document.getElementById('btn-do-search').onclick = performSearch;
  document.getElementById('search-input').onkeydown = (e) => {
    if (e.keyCode === 13) performSearch();
  };

  document.getElementById('btn-close-details').onclick = closeDetails;

  // Botón de activación directa del reproductor
  const btnStartPlay = document.getElementById('btn-start-play');
  if (btnStartPlay) {
    btnStartPlay.onclick = activatePlayerFromStartPrompt;
  }

  // Botones del reproductor
  document.getElementById('btn-hud-close').onclick = closePlayer;
  document.getElementById('btn-hud-playpause').onclick = togglePlayPause;
  document.getElementById('btn-hud-forward').onclick = () => seekBy(10);
  document.getElementById('btn-hud-rewind').onclick = () => seekBy(-10);
  document.getElementById('btn-hud-server-select').onclick = cycleServer;
  document.getElementById('btn-hud-virtual-cursor').onclick = toggleVirtualCursor;

  document.getElementById('btn-hud-focus-frame').onclick = () => sendPlayerCommand('unmute', {volume:0.5});
  document.getElementById('btn-start-server').onclick = cycleServer;
  document.getElementById('btn-start-close').onclick = closePlayer;

  // Botones de depuración
  const btnDebugToggle = document.getElementById('btn-debug-toggle');
  if (btnDebugToggle) btnDebugToggle.onclick = () => Debugger.toggle();

  const btnHudDebug = document.getElementById('btn-hud-debug');
  if (btnHudDebug) btnHudDebug.onclick = () => Debugger.toggle();

  const btnDebugClear = document.getElementById('btn-debug-clear');
  if (btnDebugClear) btnDebugClear.onclick = () => Debugger.clear();

  const btnDebugClose = document.getElementById('btn-debug-close');
  if (btnDebugClose) btnDebugClose.onclick = () => Debugger.toggle();

  // Menú superior navegación
  document.getElementById('nav-home').onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFocus(document.getElementById('hero-play-btn'));
  };
  document.getElementById('nav-movies').onclick = () => {
    document.getElementById('row-trending-movies').scrollIntoView({ behavior: 'smooth' });
    const firstCard = document.querySelector('#carousel-trending-movies .media-card');
    if (firstCard) setFocus(firstCard);
  };
  document.getElementById('nav-series').onclick = () => {
    document.getElementById('row-popular-series').scrollIntoView({ behavior: 'smooth' });
    const firstCard = document.querySelector('#carousel-popular-series .media-card');
    if (firstCard) setFocus(firstCard);
  };
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
