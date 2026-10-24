/**
 * LuminaTV - Motor de Aplicación y Navegación Espacial para Smart TV (Tizen)
 * Diseñado para control remoto (D-Pad), modo día/noche y reanudación automática.
 */

'use strict';

// ============================================================================
// Configuración & Constantes
// ============================================================================
const TMDB_API_KEY = '4ef0d7355d9ffb5151e987764708ce96';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p';

// Lista de Servidores de Streaming 100% Verificados y Compatibles con Iframe / Smart TV
const STREAM_SERVERS = [
  {
    id: 'vidlink',
    name: 'VidLink Pro (1080p Ultra-Rápido • Auto-Play)',
    type: 'embed',
    movieUrl: (id, start = 0) => `https://vidlink.pro/movie/${id}?autoplay=true&primaryColor=0284c7&secondaryColor=0f172a&iconColor=ffffff&nextbutton=true${start > 10 ? `&startAt=${Math.floor(start)}` : ''}`,
    tvUrl: (id, s, e, start = 0) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=true&primaryColor=0284c7&secondaryColor=0f172a&iconColor=ffffff&nextbutton=true${start > 10 ? `&startAt=${Math.floor(start)}` : ''}`
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
  if (!media || !media.id || currentTime <= 5 || duration <= 0) return;
  
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
  else if (State.currentView === 'player') activeScope = document.getElementById('player-hud');

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
  const cursorEl = document.getElementById('virtual-cursor');
  cursorEl.classList.add('clicking');
  setTimeout(() => cursorEl.classList.remove('clicking'), 150);

  // Ocultar momentáneamente el overlay del HUD para que el clic pase al reproductor
  const hud = document.getElementById('player-hud');
  const wasVisible = !hud.classList.contains('hidden');
  hud.classList.add('hidden');

  // Disparar eventos de ratón
  const target = document.elementFromPoint(State.cursorX, State.cursorY) || document.body;
  
  ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(eventType => {
    const evt = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: State.cursorX,
      clientY: State.cursorY
    });
    target.dispatchEvent(evt);
  });

  if (wasVisible) {
    setTimeout(() => hud.classList.remove('hidden'), 500);
  }
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
  renderCarousel('carousel-trending-movies', trendingMovies ? trendingMovies.results.slice(1, 15) : [], 'movie');
  renderCarousel('carousel-popular-series', popularSeries ? popularSeries.results.slice(0, 15) : [], 'tv');
  renderCarousel('carousel-top-rated', topRated ? topRated.results.slice(0, 15) : [], 'movie');

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

// Escuchador de Eventos PostMessage (VidLink Pro & otros Reproductores Embed)
window.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'PLAYER_EVENT' && event.data.data) {
    const payload = event.data.data;

    if (typeof payload.currentTime === 'number') {
      State.currentTime = payload.currentTime;
    }
    if (typeof payload.duration === 'number' && payload.duration > 0) {
      State.duration = payload.duration;
    }

    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    if (payload.event === 'play') {
      State.isPlaying = true;
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
    } else if (payload.event === 'pause') {
      State.isPlaying = false;
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
    } else if (payload.event === 'ended') {
      State.isPlaying = false;
      showToast('Reproducción finalizada');
    }

    updateHudTimeline(State.currentTime, State.duration);

    if (State.currentMedia && State.currentTime > 5) {
      saveProgress(State.currentMedia, State.currentTime, State.duration || 7200);
    }
  }
});

function openPlayer(media, startTime = 0, season = 1, episode = 1) {
  State.currentMedia = media;
  State.currentView = 'player';
  State.currentTime = startTime;
  State.duration = (media && media.runtime ? media.runtime * 60 : 7200);
  State.selectedSeason = season;
  State.selectedEpisode = episode;
  State.isPlaying = true;
  
  const container = document.getElementById('player-container');
  container.style.display = 'flex';

  const isTv = media.media_type === 'tv' || media.mediaType === 'tv';
  const title = media.title || media.name || 'Reproduciendo';
  document.getElementById('hud-media-title').textContent = title;
  document.getElementById('hud-media-sub').textContent = isTv ? `Temporada ${season} • Episodio ${episode}` : 'Película';

  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  if (iconPlay) iconPlay.style.display = 'none';
  if (iconPause) iconPause.style.display = 'block';

  updateHudTimeline(startTime, State.duration);

  loadStream(startTime);
  wakeHud();

  // Enfocar el botón de reproducción/pausa en el HUD para control inmediato con el control
  setFocus(document.getElementById('btn-hud-playpause'));
}

function loadStream(startTime = 0) {
  const media = State.currentMedia;
  if (!media) return;
  const isTv = media.media_type === 'tv' || media.mediaType === 'tv';
  const server = STREAM_SERVERS[State.activeServerIndex];
  
  document.getElementById('hud-server-name').textContent = server.name;

  const videoEl = document.getElementById('player-video');
  const iframeEl = document.getElementById('player-iframe');

  if (server.type === 'embed') {
    videoEl.style.display = 'none';
    iframeEl.style.display = 'block';
    
    const streamUrl = isTv 
      ? server.tvUrl(media.id, State.selectedSeason, State.selectedEpisode, startTime)
      : server.movieUrl(media.id, startTime);
    
    iframeEl.src = streamUrl;
    showToast(`Conectado a ${server.name}`);
  }

  // Actualizador continuo de avance en pantalla y guardado automático en historial
  if (window.progressInterval) clearInterval(window.progressInterval);
  window.progressInterval = setInterval(() => {
    if (State.currentView === 'player' && State.currentMedia && State.isPlaying) {
      State.currentTime += 1;
      updateHudTimeline(State.currentTime, State.duration || 7200);

      // Guardar en el historial cada 5 segundos
      if (State.currentTime % 5 === 0) {
        saveProgress(State.currentMedia, State.currentTime, State.duration || 7200);
      }
    }
  }, 1000);
}

function togglePlayPause() {
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  
  State.isPlaying = !State.isPlaying;
  if (State.isPlaying) {
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconPause) iconPause.style.display = 'block';
    showToast('Reproduciendo');
  } else {
    if (iconPlay) iconPlay.style.display = 'block';
    if (iconPause) iconPause.style.display = 'none';
    showToast('Pausa');
  }
  wakeHud();
}

function seekBy(seconds) {
  State.currentTime = Math.max(0, State.currentTime + seconds);
  updateHudTimeline(State.currentTime, State.duration || 7200);
  showToast(`${seconds > 0 ? '+' : ''}${seconds}s`);
  wakeHud();
}

function wakeHud() {
  const hud = document.getElementById('player-hud');
  if (!hud) return;
  hud.classList.remove('hidden');
  clearTimeout(State.hudTimer);
  State.hudTimer = setTimeout(() => {
    if (State.currentView === 'player' && !State.virtualCursorActive) {
      hud.classList.add('hidden');
    }
  }, 4500);
}

function closePlayer() {
  const container = document.getElementById('player-container');
  container.style.display = 'none';
  
  const iframe = document.getElementById('player-iframe');
  iframe.src = '';
  
  if (window.progressInterval) clearInterval(window.progressInterval);
  
  if (State.virtualCursorActive) toggleVirtualCursor();
  
  // Si el modal de detalles estaba abierto, devolver el foco y el estado al modal
  const modalDetails = document.getElementById('modal-details');
  if (modalDetails && modalDetails.style.display === 'flex') {
    State.currentView = 'modal-details';
    
    // Actualizar botón de reanudar por si avanzó la reproducción
    if (State.currentMedia) {
      const saved = getSavedProgress(State.currentMedia.id);
      const resumeBtn = document.getElementById('btn-details-resume');
      if (saved && saved.currentTime > 15 && resumeBtn) {
        resumeBtn.style.display = 'flex';
        document.getElementById('resume-time-label').textContent = formatTime(saved.currentTime);
        resumeBtn.onclick = () => openPlayer(State.currentMedia, saved.currentTime, saved.season, saved.episode);
        setFocus(resumeBtn);
        return;
      }
    }
    
    const playBtn = document.getElementById('btn-details-play');
    if (playBtn) {
      setFocus(playBtn);
      return;
    }
  }

  // De lo contrario, regresar al inicio
  State.currentView = 'home';
  if (State.lastFocusedCard && document.body.contains(State.lastFocusedCard)) {
    setFocus(State.lastFocusedCard);
  } else {
    setFocus(document.getElementById('hero-play-btn'));
  }
}

function cycleServer() {
  State.activeServerIndex = (State.activeServerIndex + 1) % STREAM_SERVERS.length;
  const nextServer = STREAM_SERVERS[State.activeServerIndex];
  showToast(`Servidor [${State.activeServerIndex + 1}/${STREAM_SERVERS.length}]: ${nextServer.name}`);
  loadStream(State.currentTime);
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
document.addEventListener('keydown', (e) => {
  const keyCode = e.keyCode;
  const key = e.key;

  // Manejo de Teclas de Medios (Play / Pausa / Detener del control)
  if (keyCode === 415 || keyCode === 19 || key === 'MediaPlay' || key === 'MediaPause' || key === 'MediaPlayPause') {
    if (State.currentView === 'player') {
      togglePlayPause();
      return;
    }
  }

  if (keyCode === 417 || key === 'MediaFastForward') {
    if (State.currentView === 'player') {
      seekBy(10);
      return;
    }
  }

  if (keyCode === 412 || key === 'MediaRewind') {
    if (State.currentView === 'player') {
      seekBy(-10);
      return;
    }
  }

  // Tecla Volver / Atrás (Tizen Return: 10009, Escape: 27, Backspace: 8)
  if (keyCode === 10009 || keyCode === 27 || (keyCode === 8 && e.target.tagName !== 'INPUT')) {
    e.preventDefault();
    if (State.currentView === 'player') {
      closePlayer();
      return;
    }
    if (State.currentView === 'modal-details') {
      closeDetails();
      return;
    }
    if (State.currentView === 'modal-search') {
      closeSearchModal();
      return;
    }
    return;
  }

  // Si estamos en el reproductor y el HUD está oculto, las flechas despiertan el menú
  if (State.currentView === 'player' && !State.virtualCursorActive) {
    const hud = document.getElementById('player-hud');
    if (hud && hud.classList.contains('hidden') && [13, 37, 38, 39, 40].includes(keyCode)) {
      e.preventDefault();
      wakeHud();
      return;
    }
  }

  // Teclas de Dirección D-Pad
  switch (keyCode) {
    case 37: // Izquierda
      e.preventDefault();
      navigateDirection('left');
      break;
    case 38: // Arriba
      e.preventDefault();
      navigateDirection('up');
      break;
    case 39: // Derecha
      e.preventDefault();
      navigateDirection('right');
      break;
    case 40: // Abajo
      e.preventDefault();
      navigateDirection('down');
      break;
    case 13: // Enter / Botón Central OK
      if (State.virtualCursorActive) {
        clickVirtualCursor();
      } else if (State.currentFocusedElement) {
        State.currentFocusedElement.click();
      }
      break;
    case 48: // Tecla '0' del control para alternar ratón virtual en el reproductor
      if (State.currentView === 'player') {
        toggleVirtualCursor();
      }
      break;
  }
});

// ============================================================================
// Inicialización General
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
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

  // Botones del reproductor
  document.getElementById('btn-hud-close').onclick = closePlayer;
  document.getElementById('btn-hud-playpause').onclick = togglePlayPause;
  document.getElementById('btn-hud-forward').onclick = () => seekBy(10);
  document.getElementById('btn-hud-rewind').onclick = () => seekBy(-10);
  document.getElementById('btn-hud-server-select').onclick = cycleServer;
  document.getElementById('btn-hud-virtual-cursor').onclick = toggleVirtualCursor;

  const btnFocusFrame = document.getElementById('btn-hud-focus-frame');
  if (btnFocusFrame) {
    btnFocusFrame.onclick = () => {
      const iframe = document.getElementById('player-iframe');
      if (iframe) {
        iframe.focus();
        showToast('Control en reproductor: usa Enter/Flechas. Presiona Atrás para salir.');
        const hud = document.getElementById('player-hud');
        if (hud) hud.classList.add('hidden');
      }
    };
  }

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
});
