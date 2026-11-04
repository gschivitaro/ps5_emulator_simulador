const IMG = (id, file, w = 900) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(`cdn.cloudflare.steamstatic.com/steam/apps/${id}/${file}`)}&w=${w}`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const $ = (id) => document.getElementById(id);
const money = (n) => `R$ ${Number(n).toFixed(2).replace('.', ',')}`;
const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const SPEED = new URLSearchParams(location.search).get('fast') === null ? 1 : 0.05;
const STORAGE_KEY = 'ps5-menu-state-v2';

const games = [
  { id: '2322010', title: 'God of War Ragnarök', studio: 'Santa Monica Studio', genre: 'Ação e aventura', accent: '#4aa3ff' },
  { id: '2651280', title: "Marvel's Spider-Man 2", studio: 'Insomniac Games', genre: 'Ação e aventura', accent: '#ff3d4e' },
  { id: '2420110', title: 'Horizon Forbidden West', studio: 'Guerrilla Games', genre: 'Ação e aventura', accent: '#ff8a3d' },
  { id: '2531310', title: 'The Last of Us Part II', studio: 'Naughty Dog', genre: 'Drama e sobrevivência', accent: '#7fd1a5' },
  { id: '2215430', title: 'Ghost of Tsushima', studio: 'Sucker Punch Productions', genre: 'Ação e aventura', accent: '#ff5a5f' },
  { id: '1895880', title: 'Ratchet & Clank: Rift Apart', studio: 'Insomniac Games', genre: 'Plataforma e aventura', accent: '#ffcc4d' },
  { id: '1649240', title: 'Returnal', studio: 'Housemarque', genre: 'Roguelike de ação', accent: '#8a7dff' },
  { id: '1659420', title: 'Uncharted: Legacy of Thieves', studio: 'Naughty Dog', genre: 'Ação e aventura', accent: '#e0b352' },
  { id: '553850', title: 'Helldivers 2', studio: 'Arrowhead Game Studios', genre: 'Cooperativo', accent: '#ffd23f' },
  { id: '1245620', title: 'Elden Ring', studio: 'FromSoftware', genre: 'RPG de ação', accent: '#c9a227' }
];

const extras = [
  { id: '1091500', title: 'Cyberpunk 2077', studio: 'CD Projekt Red', accent: '#fcee0a' },
  { id: '1174180', title: 'Red Dead Redemption 2', studio: 'Rockstar Games', accent: '#e05a4a' },
  { id: '1086940', title: "Baldur's Gate 3", studio: 'Larian Studios', accent: '#c9a227' },
  { id: '990080', title: 'Hogwarts Legacy', studio: 'Avalanche Software', accent: '#b28dff' },
  { id: '271590', title: 'Grand Theft Auto V', studio: 'Rockstar North', accent: '#8ef0a4' },
  { id: '1551360', title: 'Forza Horizon 5', studio: 'Playground Games', accent: '#ff8a3d' }
];

const infoById = {};
games.concat(extras).forEach((game) => { infoById[game.id] = game; });

const tiles = games
  .map((game) => ({ kind: 'game', ...game }))
  .concat([{ kind: 'store', id: 'store', title: 'PlayStation Store', accent: '#3d7bff' }]);

const loadState = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const savedState = loadState();
const savedCart = savedState.cart && typeof savedState.cart === 'object' ? savedState.cart : {};

Object.keys(savedCart).forEach((key) => {
  const qty = Math.floor(Number(savedCart[key]));
  if (!Number.isFinite(qty) || qty <= 0) delete savedCart[key];
  else savedCart[key] = Math.min(qty, 9);
});

const state = {
  selectedId: typeof savedState.selectedId === 'string' ? savedState.selectedId : '2322010',
  theme: savedState.theme === 'light' ? 'light' : 'dark',
  volume: Number.isFinite(Number(savedState.volume)) ? Number(savedState.volume) : 65,
  brightness: Number.isFinite(Number(savedState.brightness)) ? Number(savedState.brightness) : 100,
  muted: typeof savedState.muted === 'boolean'
    ? savedState.muted
    : localStorage.getItem('ps5-menu-muted') === '1',
  profileId: typeof savedState.profileId === 'string' ? savedState.profileId : 'p1',
  pinned: Array.isArray(savedState.pinned) ? savedState.pinned.slice() : [],
  readNotifs: Array.isArray(savedState.readNotifs) ? savedState.readNotifs.slice() : [],
  trophyUnlocked: Boolean(savedState.trophyUnlocked),
  cart: savedCart
};

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem('ps5-menu-muted', state.muted ? '1' : '0');
  } catch {
    /* sem espaço nem para piada */
  }
}

const boot = $('boot');
const bootBar = $('bootBar');
const bootLogo = $('bootLogo');
const bootHint = $('bootHint');
const bgEls = [$('bgA'), $('bgB')];
const dim = $('dim');
const clockTime = $('clockTime');
const clockDate = $('clockDate');
const ccClock = $('ccClock');
const psBtn = $('psBtn');
const storeBtn = $('storeBtn');
const storeBadge = $('storeBadge');
const soundBtn = $('soundBtn');
const notifBtn = $('notifBtn');
const notifDot = $('notifDot');
const avatarBtn = $('avatarBtn');
const heroInfo = $('heroInfo');
const heroGenre = $('heroGenre');
const heroTitle = $('heroTitle');
const heroStudio = $('heroStudio');
const playBtn = $('playBtn');
const playLabel = $('playLabel');
const moreBtn = $('moreBtn');
const carousel = $('carousel');
const hints = $('hints');
const controlCenter = $('controlCenter');
const ccBackdrop = $('ccBackdrop');
const ccMute = $('ccMute');
const ccTheme = $('themeBtn');
const ccAvatarEl = $('ccAvatarEl');
const ccUserName = $('ccUserName');
const ccUserStatus = $('ccUserStatus');
const ccNotifBadge = $('ccNotifBadge');
const ccNotifSub = $('ccNotifSub');
const volRange = $('volRange');
const volValue = $('volValue');
const brightRange = $('brightRange');
const brightValue = $('brightValue');
const launch = $('launch');
const launchArt = $('launchArt');
const launchInner = $('launchInner');
const launchLoading = $('launchLoading');
const launchSpinner = $('launchSpinner');
const launchTitle = $('launchTitle');
const launchStatus = $('launchStatus');
const launchBar = $('launchBar');
const launchPct = $('launchPct');
const launchError = $('launchError');
const errMain = $('errMain');
const errCode = $('errCode');
const errAttempt = $('errAttempt');
const errTrophy = $('errTrophy');
const errJoke = $('errJoke');
const errRetry = $('errRetry');
const errOk = $('errOk');
const notifPanel = $('notifPanel');
const notifList = $('notifList');
const notifClose = $('notifClose');
const notifReadAll = $('notifReadAll');
const profilePanel = $('profilePanel');
const profileList = $('profileList');
const profileClose = $('profileClose');
const addProfile = $('addProfile');
const hub = $('hub');
const hubBg = $('hubBg');
const hubClose = $('hubClose');
const hubGenre = $('hubGenre');
const hubTitle = $('hubTitle');
const hubStudio = $('hubStudio');
const hubPlay = $('hubPlay');
const hubPin = $('hubPin');
const hubPinLabel = $('hubPinLabel');
const hubStats = $('hubStats');
const hubTrophyCount = $('hubTrophyCount');
const hubRing = $('hubRing');
const hubProgress = $('hubProgress');
const hubTrophies = $('hubTrophies');
const hubActivities = $('hubActivities');
const hubSize = $('hubSize');
const hubStorageBar = $('hubStorageBar');
const storeScreen = $('store');
const storeBack = $('storeBack');
const storeSearch = $('storeSearch');
const storeHero = $('storeHero');
const storeHeroBg = $('storeHeroBg');
const storeHeroPrice = $('storeHeroPrice');
const storeEmpty = $('storeEmpty');
const offersRow = $('offersRow');
const freeRow = $('freeRow');
const plusRow = $('plusRow');
const bestRow = $('bestRow');
const cartBtn = $('cartBtn');
const cartCount = $('cartCount');
const cartDrawer = $('cartDrawer');
const cartBackdrop = $('cartBackdrop');
const cartClose = $('cartClose');
const cartItems = $('cartItems');
const cartError = $('cartError');
const cartTotal = $('cartTotal');
const checkoutBtn = $('checkoutBtn');
const updateScreen = $('update');
const updateLoading = $('updateLoading');
const updateStatus = $('updateStatus');
const updateBar = $('updateBar');
const updatePct = $('updatePct');
const updateError = $('updateError');
const updateRetry = $('updateRetry');
const updateOk = $('updateOk');
const rest = $('rest');
const shutdownEl = $('shutdown');
const bluescreen = $('bluescreen');
const toast = $('toast');

/* ---------- áudio ---------- */

const AudioFX = (() => {
  let ctx = null;
  let master = null;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = state.muted ? 0 : (state.volume / 100) * 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  function tone(freq, dur, opts = {}) {
    const c = ensure();
    if (!c) return;
    const { type = 'sine', gain = 0.15, delay = 0, slideTo = null } = opts;
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function noise(dur = 0.5, gain = 0.08) {
    const c = ensure();
    if (!c) return;
    const len = Math.floor(c.sampleRate * dur);
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    const g = c.createGain();
    g.gain.value = gain;
    src.connect(filter).connect(g).connect(master);
    src.start();
  }

  function refresh() {
    if (master) master.gain.value = state.muted ? 0 : (state.volume / 100) * 0.5;
  }

  return {
    resume() { ensure(); },
    tick() { tone(760, 0.045, { gain: 0.045 }); },
    move() {
      tone(523.25, 0.07, { gain: 0.05 });
      tone(783.99, 0.09, { gain: 0.045, delay: 0.03 });
    },
    select() {
      tone(660, 0.08, { gain: 0.07 });
      tone(990, 0.11, { gain: 0.06, delay: 0.05 });
    },
    launch() {
      noise(0.7, 0.11);
      tone(220, 0.5, { gain: 0.07, slideTo: 520 });
    },
    error() {
      tone(196, 0.16, { type: 'square', gain: 0.05 });
      tone(147, 0.3, { type: 'square', gain: 0.05, delay: 0.2 });
    },
    trophy() {
      [880, 1174.66, 1318.51, 1760].forEach((f, i) => {
        tone(f, 0.36, { gain: 0.055, delay: i * 0.09 });
      });
    },
    boot() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.5, { gain: 0.05, delay: i * 0.14 }));
    },
    powerOff() { tone(330, 0.5, { gain: 0.07, slideTo: 70 }); },
    get muted() { return state.muted; },
    setMuted(muted) {
      state.muted = muted;
      saveState();
      refresh();
    },
    setVolume(volume) {
      state.volume = volume;
      refresh();
    }
  };
})();

/* ---------- catálogo da loja ---------- */

const gameProduct = (id, opts = {}) => {
  const info = infoById[id] || { title: 'Jogo misterioso', studio: 'Estúdio imaginário', accent: '#4aa3ff' };
  const { price = 0, oldPrice = null, discount = 0, free = false, key = null, meta = null } = opts;
  return {
    kind: 'game',
    key: key || `g-${id}`,
    id,
    title: info.title,
    meta: meta || info.studio,
    accent: info.accent,
    price,
    oldPrice,
    discount,
    free
  };
};

const plusPlans = [
  { kind: 'plus', key: 'plus-essential', title: 'PS Plus Essencial', meta: 'Mensal · 2 jogos por mês', price: 34.9, accent: '#4aa3ff', tag: 'Essencial', sub: 'Mensal' },
  { kind: 'plus', key: 'plus-extra', title: 'PS Plus Extra', meta: 'Mensal · catálogo com 400 jogos', price: 52.9, accent: '#7b3dff', tag: 'Extra', sub: 'Mensal' },
  { kind: 'plus', key: 'plus-deluxe', title: 'PS Plus Deluxe', meta: 'Mensal · clássicos e testes', price: 59.9, accent: '#ff8a3d', tag: 'Deluxe', sub: 'Mensal' },
  { kind: 'plus', key: 'plus-premium', title: 'PS Plus Premium', meta: 'Mensal · tudo e mais um pouco', price: 64.9, accent: '#ffd166', tag: 'Premium', sub: 'Mensal' }
];

const offers = [
  gameProduct('2651280', { price: 299.9, oldPrice: 349.9, discount: 14 }),
  gameProduct('2322010', { price: 249.9, oldPrice: 299.9, discount: 17 }),
  gameProduct('2420110', { price: 199.9, oldPrice: 249.9, discount: 20 }),
  gameProduct('2531310', { price: 149.9, oldPrice: 199.9, discount: 25 }),
  gameProduct('2215430', { price: 179.9, oldPrice: 229.9, discount: 22 }),
  gameProduct('1245620', { price: 229.9, oldPrice: 279.9, discount: 18 })
];

const freeProducts = [
  gameProduct('553850', { key: 'free-553850', free: true, meta: 'Grátis no PS Plus · Arrowhead Game Studios' }),
  gameProduct('1649240', { key: 'free-1649240', free: true, meta: 'Grátis no PS Plus · Housemarque' }),
  gameProduct('1659420', { key: 'free-1659420', free: true, meta: 'Grátis no PS Plus · Naughty Dog' }),
  gameProduct('1895880', { key: 'free-1895880', free: true, meta: 'Grátis no PS Plus · Insomniac Games' })
];

const bestsellers = [
  gameProduct('1091500', { price: 199.9, oldPrice: 249.9, discount: 20 }),
  gameProduct('1174180', { price: 249.9, oldPrice: 299.9, discount: 17 }),
  gameProduct('1086940', { price: 199.9, oldPrice: 249.9, discount: 20 }),
  gameProduct('990080', { price: 179.9, oldPrice: 229.9, discount: 22 }),
  gameProduct('271590', { price: 89.9, oldPrice: 149.9, discount: 40 }),
  gameProduct('1551360', { price: 199.9, oldPrice: 249.9, discount: 20 })
];

const catalogByKey = {};
offers.concat(freeProducts, plusPlans, bestsellers).forEach((product) => {
  if (!catalogByKey[product.key]) catalogByKey[product.key] = product;
});

/* ---------- notificações e perfis ---------- */

const notifs = [
  { id: 'n1', type: 'update', title: 'Atualização do sistema disponível', body: 'Versão 24.02-08 · 1,2 GB · instala sozinha às 3h da manhã.', time: 'agora' },
  { id: 'n2', type: 'trophy', title: 'Troféu desbloqueado: Quase Platina', body: 'Você venceu um chefe. Ninguém viu, mas consta no histórico.', time: '12 min' },
  { id: 'n3', type: 'friend', title: 'Player_2 entrou no jogo', body: 'Ghost of Tsushima · há 2 minutos. Ele não te convidou.', time: '2 h' },
  { id: 'n4', type: 'download', title: 'Download concluído', body: 'Ratchet & Clank: Rift Apart · 42 GB · ironicamente, sem espaço.', time: 'ontem' },
  { id: 'n5', type: 'store', title: 'PS Store: ofertas da semana', body: 'Até 70% de desconto em jogos que você já tem.', time: 'ontem' }
];

const profiles = [
  { id: 'p1', name: 'Player_1', status: 'Online · Nível 12', color: '#7fe3ff', initial: 'P' },
  { id: 'p2', name: 'Player_2', status: 'Offline desde 2019', color: '#ffd166', initial: 'P' },
  { id: 'guest', name: 'Convidado', status: 'Nível 1 · Sem troféus', color: '#8ef0a4', initial: 'C' }
];

const NOTIF_ICONS = {
  update: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a3 3 0 0 0 3 3"/><path d="M16 6h3a3 3 0 0 1-3 3"/><path d="M12 13v4"/><path d="M9 20h6"/><path d="M10 17h4l1 3H9z"/></svg>',
  friend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6 6 0 0 1 3 6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 19h16"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.2 13H4.8L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>'
};

/* ---------- estado de interface ---------- */

let cards = [];
let selected = 0;
let bgVisible = 0;
let bgToken = 0;
let booted = false;
let bootTimer = null;
let ccOpen = false;
let launchOpen = false;
let launchAttempt = 0;
let launchTimers = [];
let launchInterval = null;
let updateOpen = false;
let updateTimers = [];
let updateInterval = null;
let cartOpen = false;
let storeOpen = false;
let hubOpen = false;
let restOpen = false;
let shutdownOpen = false;
let bsOpen = false;
let notifOpen = false;
let profileOpen = false;
let toastTimer = null;
let konami = [];
let konamiAt = 0;

/* ---------- utilidades ---------- */

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  clockTime.textContent = time;
  ccClock.textContent = time;
  const date = now.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  clockDate.textContent = date.replace(/\./g, '').trim();
}

function setBackground(url, accent) {
  const token = ++bgToken;
  const next = 1 - bgVisible;
  const el = bgEls[next];
  const previous = bgEls[bgVisible];
  const image = new Image();

  const apply = (value) => {
    if (token !== bgToken) return;
    el.style.backgroundImage = value;
    el.classList.add('visible');
    previous.classList.remove('visible');
    bgVisible = next;
  };

  image.onload = () => apply(`url("${url}")`);
  image.onerror = () => apply(`linear-gradient(145deg, ${accent}, #070a0f 75%)`);
  image.src = url;
}

/* ---------- temas e perfis ---------- */

function applyTheme(theme, notify = false) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', state.theme === 'light' ? '#e9eef5' : '#080b10');
  saveState();
  if (notify) showToast(state.theme === 'light' ? 'Tema claro ativado. A verdade também.' : 'Tema escuro ativado.');
}

function toggleTheme() {
  applyTheme(state.theme === 'light' ? 'dark' : 'light', true);
  AudioFX.tick();
}

function currentProfile() {
  return profiles.find((profile) => profile.id === state.profileId) || profiles[0];
}

function applyProfile() {
  const profile = currentProfile();
  avatarBtn.textContent = profile.initial;
  avatarBtn.style.background = profile.color;
  avatarBtn.setAttribute('aria-label', `Perfil de ${profile.name}`);
  ccAvatarEl.textContent = profile.initial;
  ccAvatarEl.style.background = profile.color;
  ccUserName.textContent = profile.name;
  ccUserStatus.textContent = profile.status;
}

function renderProfiles() {
  profileList.innerHTML = profiles.map((profile) => `
    <button class="profile-item${profile.id === state.profileId ? ' active' : ''}" type="button" data-profile="${profile.id}">
      <span class="profile-avatar" style="background:${profile.color}">${esc(profile.initial)}</span>
      <span class="profile-meta">
        <strong>${esc(profile.name)}</strong>
        <span>${esc(profile.status)}</span>
      </span>
      <svg class="profile-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>
    </button>
  `).join('');
}

function unreadCount() {
  return notifs.filter((notif) => !state.readNotifs.includes(notif.id)).length;
}

function renderNotifications() {
  notifList.innerHTML = notifs.map((notif) => {
    const unread = !state.readNotifs.includes(notif.id);
    return `
      <button class="notif-item${unread ? ' unread' : ''}" type="button" data-notif="${notif.id}">
        <span class="notif-icon">${NOTIF_ICONS[notif.type] || NOTIF_ICONS.store}</span>
        <span class="notif-body">
          <strong>${esc(notif.title)}</strong>
          <span>${esc(notif.body)}</span>
        </span>
        <span class="notif-time">${esc(notif.time)}</span>
        ${unread ? '<span class="notif-unread-dot"></span>' : ''}
      </button>
    `;
  }).join('');

  const count = unreadCount();
  notifDot.hidden = count === 0;
  ccNotifBadge.hidden = count === 0;
  ccNotifBadge.textContent = String(count);
  ccNotifSub.textContent = count === 0 ? 'Tudo lido' : `${count} ${count === 1 ? 'nova' : 'novas'}`;
}

function markNotifRead(id) {
  if (!state.readNotifs.includes(id)) {
    state.readNotifs.push(id);
    saveState();
    renderNotifications();
  }
}

/* ---------- cards ---------- */

function renderCards() {
  carousel.innerHTML = tiles.map((tile, index) => {
    if (tile.kind === 'store') {
      return `
        <button class="card store-card" type="button" data-index="${index}" aria-label="Abrir PlayStation Store">
          <span class="store-cover">
            <span class="store-bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l1.2 13H4.8L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
            </span>
            <span class="store-word">PlayStation<br>Store</span>
            <span class="store-tag">Abrir loja</span>
          </span>
        </button>
      `;
    }

    return `
      <button class="card" type="button" data-index="${index}" style="--card-accent:${tile.accent}" aria-label="${esc(tile.title)}">
        <img src="${IMG(tile.id, 'library_600x900.jpg', 400)}" alt="Capa de ${esc(tile.title)}" loading="${index < 4 ? 'eager' : 'lazy'}" draggable="false">
        <span class="card-pin" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M8 3h8l-1 6 3 3v2H6v-2l3-3-1-6z"/></svg>
        </span>
        <span class="card-fallback">${esc(tile.title)}</span>
        <span class="card-name">${esc(tile.title)}</span>
      </button>
    `;
  }).join('');

  cards = Array.from(carousel.querySelectorAll('.card'));

  cards.forEach((card, index) => {
    const image = card.querySelector('img');
    if (image) image.addEventListener('error', () => card.classList.add('failed'));

    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') select(index, { sound: false });
    });

    card.addEventListener('click', () => {
      const tile = tiles[index];
      if (tile.kind === 'store') {
        openStore();
        return;
      }
      if (index === selected) launchGame();
      else select(index);
    });
  });

  updatePinUI();
}

function updatePinUI() {
  tiles.forEach((tile, index) => {
    if (tile.kind !== 'game') return;
    const card = cards[index];
    if (card) card.classList.toggle('pinned', state.pinned.includes(tile.id));
  });
}

function centerCard(index, smooth = true) {
  const card = cards[index];
  if (!card) return;
  const left = card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;
  carousel.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
}

function select(index, opts = {}) {
  const total = tiles.length;
  const i = ((index % total) + total) % total;
  const { force = false, sound = true, scroll = true, animate = true } = opts;

  if (i === selected && !force) {
    if (scroll) centerCard(i);
    return;
  }

  selected = i;
  const tile = tiles[i];

  cards.forEach((card, index) => {
    const active = index === i;
    card.classList.toggle('selected', active);
    if (active) card.setAttribute('aria-current', 'true');
    else card.removeAttribute('aria-current');
  });

  if (tile.kind === 'store') {
    heroGenre.textContent = 'Loja';
    heroTitle.textContent = 'PlayStation Store';
    heroStudio.textContent = 'Ofertas, planos e arrependimento';
    document.documentElement.style.setProperty('--accent', tile.accent);
    setBackground(IMG('1091500', 'library_hero.jpg', 1600), tile.accent);
    playBtn.classList.add('is-store');
    playLabel.textContent = 'Abrir Store';
    moreBtn.classList.add('hidden');
  } else {
    heroGenre.textContent = tile.genre;
    heroTitle.textContent = tile.title;
    heroStudio.textContent = tile.studio;
    document.documentElement.style.setProperty('--accent', tile.accent);
    setBackground(IMG(tile.id, 'library_hero.jpg', 1600), tile.accent);
    playBtn.classList.remove('is-store');
    playLabel.textContent = 'Jogar';
    moreBtn.classList.remove('hidden');
  }

  state.selectedId = tile.id;
  saveState();

  if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroInfo.animate(
      [
        { opacity: 0.15, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 420, easing: 'cubic-bezier(.22,.61,.36,1)' }
    );
  }

  if (scroll) centerCard(i);
  if (sound && booted) AudioFX.move();
}

/* ---------- boot ---------- */

function startBoot() {
  booted = false;
  boot.classList.remove('hidden');
  document.body.classList.add('booting');

  [bootBar, bootLogo, bootHint].forEach((el) => { el.style.animation = 'none'; });
  void boot.offsetWidth;
  [bootBar, bootLogo, bootHint].forEach((el) => { el.style.animation = ''; });

  clearTimeout(bootTimer);
  bootTimer = setTimeout(finishBoot, Math.max(220, 2700 * SPEED));
}

function finishBoot() {
  if (booted) return;
  booted = true;
  clearTimeout(bootTimer);
  boot.classList.add('hidden');
  document.body.classList.remove('booting');
  AudioFX.boot();
  setTimeout(() => {
    select(selected, { force: true, sound: false, animate: false });
  }, 300);
}

/* ---------- central de controle ---------- */

function openControlCenter() {
  if (ccOpen) return;
  ccOpen = true;
  controlCenter.classList.add('open');
  controlCenter.setAttribute('aria-hidden', 'false');
  AudioFX.select();
}

function closeControlCenter() {
  if (!ccOpen) return;
  ccOpen = false;
  controlCenter.classList.remove('open');
  controlCenter.setAttribute('aria-hidden', 'true');
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  AudioFX.tick();
}

/* ---------- popovers ---------- */

function closePanels() {
  if (notifOpen) {
    notifOpen = false;
    notifPanel.classList.remove('open');
    notifPanel.setAttribute('aria-hidden', 'true');
  }
  if (profileOpen) {
    profileOpen = false;
    profilePanel.classList.remove('open');
    profilePanel.setAttribute('aria-hidden', 'true');
  }
}

function openNotifPanel() {
  closePanels();
  if (ccOpen) closeControlCenter();
  notifOpen = true;
  notifPanel.classList.add('open');
  notifPanel.setAttribute('aria-hidden', 'false');
  renderNotifications();
  AudioFX.select();
}

function openProfilePanel() {
  closePanels();
  if (ccOpen) closeControlCenter();
  profileOpen = true;
  profilePanel.classList.add('open');
  profilePanel.setAttribute('aria-hidden', 'false');
  renderProfiles();
  AudioFX.select();
}

/* ---------- hub do jogo ---------- */

function selectedTile() {
  return tiles[selected];
}

function openHub() {
  const tile = selectedTile();
  if (tile.kind !== 'game') {
    showToast('A Store não tem hub. Tem carrinho.');
    return;
  }
  closePanels();
  if (ccOpen) closeControlCenter();
  hubOpen = true;
  renderHub(tile);
  hub.classList.add('open');
  hub.setAttribute('aria-hidden', 'false');
  AudioFX.select();
}

function closeHub() {
  if (!hubOpen) return;
  hubOpen = false;
  hub.classList.remove('open');
  hub.setAttribute('aria-hidden', 'true');
  AudioFX.tick();
}

function renderHub(tile) {
  const index = tiles.findIndex((item) => item.id === tile.id);
  const gold = 4 + (index % 5);
  const silver = 9 + (index % 4);
  const bronze = 14 + (index % 6);
  const platinum = index === 9 ? 1 : 0;
  const total = gold + silver + bronze + platinum;
  const progress = Math.min(96, 12 + index * 7 + platinum * 5);
  const hours = (8.4 + index * 4.3).toFixed(1).replace('.', ',');
  const size = 78 + index * 6;
  const storage = Math.min(94, 34 + index * 5);

  hubBg.style.backgroundImage = `url("${IMG(tile.id, 'library_hero.jpg', 1600)}")`;
  hubGenre.textContent = tile.genre;
  hubTitle.textContent = tile.title;
  hubStudio.textContent = tile.studio;
  hubPin.classList.toggle('active', state.pinned.includes(tile.id));
  hubPinLabel.textContent = state.pinned.includes(tile.id) ? 'Fixado na tela inicial' : 'Fixar na tela inicial';

  hubStats.innerHTML = `
    <span class="stat-chip">Última sessão <b>há ${index + 1} ${index ? 'dias' : 'dia'}</b></span>
    <span class="stat-chip">Tempo de jogo <b>${hours} h</b></span>
    <span class="stat-chip">Tamanho <b>${size} GB</b></span>
    <span class="stat-chip">Troféus <b>${progress}%</b></span>
  `;

  hubTrophyCount.textContent = `${total} de ${total + 9} troféus`;
  hubRing.style.background = `conic-gradient(#7fe3ff ${progress}%, rgba(255,255,255,.12) 0)`;
  hubProgress.textContent = `${progress}%`;
  hubTrophies.innerHTML = `
    <li><span class="trophy-dot" style="background:#c9d6e4"></span>Platina <b>${platinum}</b></li>
    <li><span class="trophy-dot" style="background:#ffd166"></span>Ouro <b>${gold}</b></li>
    <li><span class="trophy-dot" style="background:#c7d3e0"></span>Prata <b>${silver}</b></li>
    <li><span class="trophy-dot" style="background:#c08a5a"></span>Bronze <b>${bronze}</b></li>
  `;

  hubActivities.innerHTML = `
    <button class="activity-item" type="button" data-act="continue">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.2v13.6L19 12 8 5.2z"/></svg>
      Continuar história
      <span>2 h</span>
    </button>
    <button class="activity-item" type="button" data-act="side">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3z"/></svg>
      Missão secundária: ${index === 9 ? 'morrer com dignidade' : 'coletar 300 penas'}
      <span>40 min</span>
    </button>
    <button class="activity-item" type="button" data-act="photo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.2"/><path d="M8 6l1.5-2h5L16 6"/></svg>
      Modo foto
      <span>agora</span>
    </button>
  `;

  hubSize.textContent = `${size},4 GB`;
  hubStorageBar.style.width = `${storage}%`;
}

function togglePin() {
  const tile = selectedTile();
  if (tile.kind !== 'game') return;
  const pinned = state.pinned.includes(tile.id);
  state.pinned = pinned ? state.pinned.filter((id) => id !== tile.id) : state.pinned.concat(tile.id);
  saveState();
  updatePinUI();
  hubPin.classList.toggle('active', !pinned);
  hubPinLabel.textContent = pinned ? 'Fixar na tela inicial' : 'Fixado na tela inicial';
  showToast(pinned ? 'Removido dos fixados.' : 'Fixado na tela inicial. Agora você não esquece.');
  AudioFX.tick();
}

/* ---------- lançamento ---------- */

function clearLaunchTimers() {
  launchTimers.forEach(clearTimeout);
  launchTimers = [];
  if (launchInterval) {
    clearInterval(launchInterval);
    launchInterval = null;
  }
}

function launchGame() {
  if (launchOpen || !booted) return;

  const tile = selectedTile();
  if (tile.kind === 'store') {
    openStore();
    return;
  }

  launchOpen = true;
  launchAttempt = 0;
  launchTitle.textContent = tile.title;
  launchArt.style.backgroundImage = `url("${IMG(tile.id, 'library_hero.jpg', 1600)}")`;
  launch.classList.add('open');
  launch.setAttribute('aria-hidden', 'false');
  AudioFX.launch();
  startAttempt();
}

function startAttempt() {
  launchAttempt += 1;
  clearLaunchTimers();

  launchLoading.hidden = false;
  launchError.hidden = true;
  launchInner.classList.remove('shake');
  errTrophy.hidden = true;
  errJoke.hidden = true;
  errRetry.hidden = false;
  errRetry.textContent = 'Tentar novamente';
  errOk.textContent = 'Voltar ao menu';
  errAttempt.textContent = `Tentativa ${launchAttempt} de 3`;
  errMain.textContent = 'Não foi possível iniciar o aplicativo.';
  launchStatus.textContent = 'Iniciando aplicativo...';
  launchBar.style.width = '0%';
  launchPct.textContent = '0%';

  const duration = 15000 * SPEED;
  const statuses = [
    [0.16, 'Verificando licença...'],
    [0.34, 'Sincronizando dados salvos...'],
    [0.52, 'Procurando atualização... (não recomendado)'],
    [0.7, 'Quase lá. Fé em 0,4%.'],
    [0.86, 'Ainda iniciando. Respire.']
  ];

  statuses.forEach(([fraction, text]) => {
    launchTimers.push(setTimeout(() => { launchStatus.textContent = text; }, duration * fraction));
  });

  const started = performance.now();
  launchInterval = setInterval(() => {
    const pct = Math.min(99, Math.round(((performance.now() - started) / duration) * 100));
    launchBar.style.width = `${pct}%`;
    launchPct.textContent = `${pct}%`;
    if (pct >= 99) {
      clearInterval(launchInterval);
      launchInterval = null;
    }
  }, 80);

  launchTimers.push(setTimeout(finishAttempt, duration));
}

function finishAttempt() {
  launchBar.style.width = '100%';
  launchPct.textContent = '100%';
  launchLoading.hidden = true;
  launchError.hidden = false;
  launchInner.classList.add('shake');
  AudioFX.error();

  const codes = ['CE-108255-1', 'CE-107863-5', 'CE-108262-9'];
  errCode.textContent = `(${codes[Math.min(launchAttempt - 1, codes.length - 1)]})`;

  if (launchAttempt >= 3) {
    errMain.textContent = 'Não foi possível iniciar o aplicativo. De novo.';
    errAttempt.textContent = 'Tentativa 3 de 3 · encerrando o bom humor';
    errTrophy.hidden = false;
    errJoke.hidden = false;
    errRetry.hidden = true;
    errOk.textContent = 'Voltar ao menu';
    AudioFX.trophy();
    if (!state.trophyUnlocked) {
      state.trophyUnlocked = true;
      saveState();
      setTimeout(() => showToast('Troféu desbloqueado: Paciência de Platina'), 500);
    }
  } else {
    errMain.textContent = 'Não foi possível iniciar o aplicativo.';
    errAttempt.textContent = `Tentativa ${launchAttempt} de 3`;
  }
}

function closeLaunch() {
  if (!launchOpen) return;
  launchOpen = false;
  clearLaunchTimers();
  launch.classList.remove('open');
  launch.setAttribute('aria-hidden', 'true');
  launchError.hidden = true;
  launchLoading.hidden = false;
  launchInner.classList.remove('shake');
  AudioFX.tick();
}

/* ---------- atualização ---------- */

function clearUpdateTimers() {
  updateTimers.forEach(clearTimeout);
  updateTimers = [];
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

function openUpdate() {
  if (updateOpen) return;
  closePanels();
  if (ccOpen) closeControlCenter();
  updateOpen = true;
  updateScreen.classList.add('open');
  updateScreen.setAttribute('aria-hidden', 'false');
  AudioFX.select();
  runUpdate();
}

function runUpdate() {
  clearUpdateTimers();
  updateLoading.hidden = false;
  updateError.hidden = true;
  updateStatus.textContent = 'Procurando atualizações...';
  updateBar.style.width = '0%';
  updatePct.textContent = '0%';

  const duration = 6500 * SPEED;
  const statuses = [
    [0.18, 'Baixando pacote 24.02-08 (1,2 GB)...'],
    [0.44, 'Instalando atualização...'],
    [0.7, 'Migrando dados do usuário...'],
    [0.9, 'Finalizando... 99%']
  ];

  statuses.forEach(([fraction, text]) => {
    updateTimers.push(setTimeout(() => { updateStatus.textContent = text; }, duration * fraction));
  });

  const started = performance.now();
  updateInterval = setInterval(() => {
    const pct = Math.min(99, Math.round(((performance.now() - started) / duration) * 100));
    updateBar.style.width = `${pct}%`;
    updatePct.textContent = `${pct}%`;
    if (pct >= 99) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  }, 80);

  updateTimers.push(setTimeout(() => {
    updateBar.style.width = '99%';
    updatePct.textContent = '99%';
    updateLoading.hidden = true;
    updateError.hidden = false;
    AudioFX.error();
  }, duration));
}

function closeUpdate() {
  if (!updateOpen) return;
  updateOpen = false;
  clearUpdateTimers();
  updateScreen.classList.remove('open');
  updateScreen.setAttribute('aria-hidden', 'true');
  AudioFX.tick();
}

/* ---------- store ---------- */

function productHTML(product) {
  const inCart = Boolean(state.cart[product.key]);
  const tags = [
    product.free ? '<span class="free-tag">Grátis</span>' : '',
    product.discount ? `<span class="discount">-${product.discount}%</span>` : ''
  ].join('');
  const price = product.free
    ? '<span class="new">Grátis</span>'
    : `<span class="new">${money(product.price)}</span>`;

  const cover = product.kind === 'plus'
    ? `<div class="plus-cover"><strong>${esc(product.tag)}</strong><span>${esc(product.sub)}</span></div>`
    : `<img src="${IMG(product.id, 'library_600x900.jpg', 400)}" alt="Capa de ${esc(product.title)}" loading="lazy" draggable="false">`;

  return `
    <article class="product" style="--p-accent:${product.accent}">
      <div class="product-cover">
        ${cover}
        ${tags}
      </div>
      <div class="product-info">
        <h3>${esc(product.title)}</h3>
        <p class="product-meta">${esc(product.meta)}</p>
        <div class="product-price">
          ${product.oldPrice ? `<span class="old">${money(product.oldPrice)}</span>` : ''}
          ${price}
        </div>
        <button class="add-btn${inCart ? ' added' : ''}" type="button" data-add="${product.key}">
          ${inCart ? 'No carrinho' : 'Adicionar'}
        </button>
      </div>
    </article>
  `;
}

function refreshAddButtons() {
  storeScreen.querySelectorAll('.add-btn[data-add]').forEach((button) => {
    const inCart = Boolean(state.cart[button.dataset.add]);
    button.classList.toggle('added', inCart);
    button.textContent = inCart ? 'No carrinho' : 'Adicionar';
  });
}

function renderRow(container, products) {
  container.innerHTML = products.map(productHTML).join('');
  const section = container.closest('.store-section');
  if (section) section.hidden = products.length === 0 && norm(storeSearch.value).length > 0;
}

function renderStore() {
  const query = norm(storeSearch.value.trim());
  const filter = (list) => (query ? list.filter((product) => norm(product.title).includes(query)) : list);

  const offersView = filter(offers);
  const freeView = filter(freeProducts);
  const plusView = filter(plusPlans);
  const bestView = filter(bestsellers);

  renderRow(offersRow, offersView);
  renderRow(freeRow, freeView);
  renderRow(plusRow, plusView);
  renderRow(bestRow, bestView);

  const total = offersView.length + freeView.length + plusView.length + bestView.length;
  storeHero.hidden = Boolean(query);
  storeEmpty.hidden = !(query && total === 0);
  refreshAddButtons();
}

function openStore() {
  closePanels();
  if (ccOpen) closeControlCenter();
  if (hubOpen) closeHub();
  storeOpen = true;
  storeScreen.classList.add('open');
  storeScreen.setAttribute('aria-hidden', 'false');
  storeEmpty.hidden = true;
  if (!storeSearch.value) storeHero.hidden = false;
  renderStore();
  AudioFX.select();
}

function closeStore() {
  if (!storeOpen) return;
  if (cartOpen) closeCart();
  storeOpen = false;
  storeScreen.classList.remove('open');
  storeScreen.setAttribute('aria-hidden', 'true');
  storeSearch.blur();
  AudioFX.tick();
}

function cartQuantity() {
  return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([key, qty]) => ({ product: catalogByKey[key], qty }))
    .filter((entry) => entry.product && entry.qty > 0);
}

function cartTotalValue() {
  return cartEntries().reduce((sum, entry) => sum + entry.product.price * entry.qty, 0);
}

function updateCartBadges() {
  const count = cartQuantity();
  [storeBadge, cartCount].forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

function renderCart() {
  const entries = cartEntries();
  if (!entries.length) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.<br>Igual à pasta de jogos instalados.</p>';
  } else {
    cartItems.innerHTML = entries.map(({ product, qty }) => `
      <div class="cart-item">
        ${product.kind === 'plus'
          ? '<div class="cart-thumb plus">PS<br>Plus</div>'
          : `<img class="cart-thumb" src="${IMG(product.id, 'library_600x900.jpg', 200)}" alt="" draggable="false">`}
        <div class="cart-item-info">
          <h4>${esc(product.title)}</h4>
          <span>${product.free ? 'Grátis' : money(product.price)}</span>
        </div>
        <div class="cart-qty">
          <button type="button" data-qty="-1" data-key="${product.key}" aria-label="Diminuir quantidade">−</button>
          <b>${qty}</b>
          <button type="button" data-qty="1" data-key="${product.key}" aria-label="Aumentar quantidade">+</button>
        </div>
        <button class="cart-remove" type="button" data-remove="${product.key}" aria-label="Remover item">×</button>
      </div>
    `).join('');
  }
  cartTotal.textContent = money(cartTotalValue());
  updateCartBadges();
}

function addToCart(key) {
  const product = catalogByKey[key];
  if (!product) return;
  state.cart[key] = Math.min(9, (state.cart[key] || 0) + 1);
  saveState();
  cartError.hidden = true;
  renderCart();
  refreshAddButtons();
  showToast(`${product.title} adicionado ao carrinho.`);
  AudioFX.select();
}

function changeCartQty(key, delta) {
  const qty = (state.cart[key] || 0) + delta;
  if (qty <= 0) delete state.cart[key];
  else state.cart[key] = Math.min(9, qty);
  saveState();
  cartError.hidden = true;
  renderCart();
  refreshAddButtons();
  AudioFX.tick();
}

function removeCartItem(key) {
  delete state.cart[key];
  saveState();
  cartError.hidden = true;
  renderCart();
  refreshAddButtons();
  AudioFX.tick();
}

function openCart() {
  if (cartOpen) return;
  cartOpen = true;
  cartError.hidden = true;
  renderCart();
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  AudioFX.select();
}

function closeCart() {
  if (!cartOpen) return;
  cartOpen = false;
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  AudioFX.tick();
}

function checkout() {
  const entries = cartEntries();
  cartError.hidden = false;
  cartError.textContent = entries.length
    ? 'Pagamento recusado pelo bom senso.'
    : 'Carrinho vazio. Nem a piada quis vir.';
  const panel = cartDrawer.querySelector('.cart-panel');
  if (panel) {
    panel.classList.remove('shake');
    void panel.offsetWidth;
    panel.classList.add('shake');
  }
  AudioFX.error();
}

/* ---------- energia ---------- */

function shutdownConsole() {
  closeControlCenter();
  closePanels();
  closeHub();
  closeStore();
  closeLaunch();
  closeUpdate();
  shutdownOpen = true;
  shutdownEl.classList.add('open');
  AudioFX.powerOff();
}

function wakeConsole() {
  if (!shutdownOpen) return;
  shutdownOpen = false;
  shutdownEl.classList.remove('open');
  startBoot();
}

function enterRest() {
  closeControlCenter();
  closePanels();
  closeHub();
  closeStore();
  closeLaunch();
  closeUpdate();
  restOpen = true;
  rest.classList.add('open');
  rest.setAttribute('aria-hidden', 'false');
  AudioFX.powerOff();
}

function wakeFromRest() {
  if (!restOpen) return;
  restOpen = false;
  rest.classList.remove('open');
  rest.setAttribute('aria-hidden', 'true');
  startBoot();
}

function restartConsole() {
  closeControlCenter();
  closePanels();
  closeHub();
  closeStore();
  closeLaunch();
  closeUpdate();
  startBoot();
}

/* ---------- tela azul ---------- */

function openBluescreen() {
  if (bsOpen) return;
  closeControlCenter();
  closePanels();
  closeHub();
  closeStore();
  closeLaunch();
  closeUpdate();
  bsOpen = true;
  bluescreen.classList.add('open');
  bluescreen.setAttribute('aria-hidden', 'false');
  AudioFX.error();
}

function closeBluescreen() {
  if (!bsOpen) return;
  bsOpen = false;
  bluescreen.classList.remove('open');
  bluescreen.setAttribute('aria-hidden', 'true');
  AudioFX.tick();
}

/* ---------- som ---------- */

function updateMuteUI() {
  soundBtn.classList.toggle('muted', state.muted);
  ccMute.classList.toggle('muted', state.muted);
  soundBtn.setAttribute('aria-label', state.muted ? 'Ativar som' : 'Desativar som');
}

function toggleMute() {
  AudioFX.setMuted(!state.muted);
  updateMuteUI();
  if (!state.muted) AudioFX.tick();
  showToast(state.muted ? 'Som desativado' : 'Som ativado');
}

/* ---------- konami ---------- */

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function trackKonami(key) {
  const now = Date.now();
  if (now - konamiAt > 1600) konami = [];
  konamiAt = now;
  const normalized = key.length === 1 ? key.toLowerCase() : key;
  konami.push(normalized);
  while (konami.length > KONAMI.length) konami.shift();
  if (konami.length === KONAMI.length && konami.every((item, index) => item === KONAMI[index])) {
    konami = [];
    openBluescreen();
    return true;
  }
  return false;
}

/* ---------- eventos ---------- */

document.addEventListener('pointerdown', () => AudioFX.resume(), { once: true });
document.addEventListener('keydown', () => AudioFX.resume(), { once: true });

document.addEventListener('keydown', (event) => {
  if (bsOpen) {
    event.preventDefault();
    closeBluescreen();
    return;
  }

  if (restOpen) {
    event.preventDefault();
    wakeFromRest();
    return;
  }

  if (shutdownOpen) {
    event.preventDefault();
    wakeConsole();
    return;
  }

  if (!booted) {
    event.preventDefault();
    finishBoot();
    return;
  }

  const typing = event.target instanceof HTMLElement
    ? event.target.closest('input, textarea, [contenteditable="true"]')
    : null;

  if (typing) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.target.blur();
    }
    return;
  }

  const konamiActive = konami.length > 0 && Date.now() - konamiAt < 1600;
  if (!launchOpen && !updateOpen && !cartOpen && !hubOpen && !storeOpen) {
    if (trackKonami(event.key)) {
      event.preventDefault();
      return;
    }
  }

  if (launchOpen) {
    if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault();
      closeLaunch();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!launchError.hidden) {
        if (errRetry.hidden) closeLaunch();
        else startAttempt();
      }
    }
    return;
  }

  if (updateOpen) {
    if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault();
      closeUpdate();
    } else if (event.key === 'Enter' && !updateError.hidden) {
      event.preventDefault();
      runUpdate();
    }
    return;
  }

  if (cartOpen) {
    if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault();
      closeCart();
    }
    return;
  }

  if (storeOpen) {
    if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault();
      closeStore();
    }
    return;
  }

  if (hubOpen) {
    if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault();
      closeHub();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeHub();
      launchGame();
    }
    return;
  }

  if (notifOpen || profileOpen) {
    if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault();
      closePanels();
    }
    return;
  }

  if (ccOpen) {
    if (event.key === 'Escape' || event.key === 'Backspace' || event.key === 'ArrowUp') {
      event.preventDefault();
      closeControlCenter();
    }
    return;
  }

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      select(selected + 1);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      select(selected - 1);
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (!konamiActive) openControlCenter();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (selectedTile().kind === 'store') openStore();
      else launchGame();
      break;
    case 'h':
    case 'H':
      event.preventDefault();
      openHub();
      break;
    case 's':
    case 'S':
      event.preventDefault();
      openStore();
      break;
    case 't':
    case 'T':
      event.preventDefault();
      toggleTheme();
      break;
    case 'u':
    case 'U':
      event.preventDefault();
      openUpdate();
      break;
    default:
      break;
  }
});

boot.addEventListener('pointerdown', finishBoot);
shutdownEl.addEventListener('pointerdown', wakeConsole);
rest.addEventListener('pointerdown', wakeFromRest);
bluescreen.addEventListener('pointerdown', closeBluescreen);
errOk.addEventListener('click', closeLaunch);
errRetry.addEventListener('click', startAttempt);
updateRetry.addEventListener('click', runUpdate);
updateOk.addEventListener('click', closeUpdate);

psBtn.addEventListener('click', () => {
  if (ccOpen) closeControlCenter();
  else openControlCenter();
});

storeBtn.addEventListener('click', openStore);
playBtn.addEventListener('click', () => {
  if (selectedTile().kind === 'store') openStore();
  else launchGame();
});
moreBtn.addEventListener('click', openHub);
notifBtn.addEventListener('click', openNotifPanel);
avatarBtn.addEventListener('click', openProfilePanel);
soundBtn.addEventListener('click', toggleMute);
ccMute.addEventListener('click', toggleMute);
ccTheme.addEventListener('click', toggleTheme);
ccBackdrop.addEventListener('click', closeControlCenter);

controlCenter.addEventListener('click', (event) => {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  AudioFX.select();

  switch (actionEl.dataset.action) {
    case 'users':
      closeControlCenter();
      openProfilePanel();
      break;
    case 'notifications':
      closeControlCenter();
      openNotifPanel();
      break;
    case 'downloads':
      showToast('Download simulado em 42%. Não desligue o console.');
      break;
    case 'trophies':
      showToast('Nível 12 · 6 platinas · Quase lá.');
      break;
    case 'captures':
      showToast('128 capturas. Nenhuma delas é sua.');
      break;
    case 'spotify':
      showToast('Spotify conectado. Tocando: playlist deste menu.');
      break;
    case 'settings':
      showToast('Configurações bloqueadas pelo administrador da piada.');
      break;
    case 'energy':
      showToast('Economia de energia ativada. O planeta agradece.');
      break;
    case 'rest':
      enterRest();
      break;
    case 'restart':
      restartConsole();
      break;
    case 'shutdown':
      shutdownConsole();
      break;
    default:
      showToast('Função indisponível nesta demonstração.');
  }
});

notifClose.addEventListener('click', () => {
  closePanels();
  AudioFX.tick();
});

notifReadAll.addEventListener('click', () => {
  state.readNotifs = notifs.map((notif) => notif.id);
  saveState();
  renderNotifications();
  AudioFX.select();
  showToast('Notificações lidas. Você continua sem novidades.');
});

notifList.addEventListener('click', (event) => {
  const item = event.target.closest('[data-notif]');
  if (!item) return;
  const notif = notifs.find((entry) => entry.id === item.dataset.notif);
  if (!notif) return;
  markNotifRead(notif.id);
  AudioFX.tick();

  if (notif.type === 'update') {
    closePanels();
    openUpdate();
  } else if (notif.type === 'store') {
    closePanels();
    openStore();
  } else {
    showToast(notif.body);
  }
});

profileClose.addEventListener('click', () => {
  closePanels();
  AudioFX.tick();
});

profileList.addEventListener('click', (event) => {
  const item = event.target.closest('[data-profile]');
  if (!item) return;
  const profile = profiles.find((entry) => entry.id === item.dataset.profile);
  if (!profile) return;
  state.profileId = profile.id;
  saveState();
  applyProfile();
  renderProfiles();
  closePanels();
  AudioFX.select();
  showToast(`Agora quem manda é ${profile.name}.`);
});

addProfile.addEventListener('click', () => {
  AudioFX.tick();
  showToast('Limite de perfis atingido (ou de paciência).');
});

document.querySelectorAll('.popover-backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', () => {
    closePanels();
    AudioFX.tick();
  });
});

hubClose.addEventListener('click', closeHub);
hubPlay.addEventListener('click', () => {
  closeHub();
  launchGame();
});
hubPin.addEventListener('click', togglePin);

hubActivities.addEventListener('click', (event) => {
  const item = event.target.closest('[data-act]');
  if (!item) return;
  AudioFX.select();
  if (item.dataset.act === 'continue') {
    closeHub();
    launchGame();
  } else if (item.dataset.act === 'photo') {
    showToast('Modo foto aberto. A paisagem continua mais bonita que o jogo.');
  } else {
    showToast('Missão secundária adicionada. Ela também vai ficar pela metade.');
  }
});

storeBack.addEventListener('click', closeStore);
storeSearch.addEventListener('input', renderStore);

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

cartItems.addEventListener('click', (event) => {
  const qtyBtn = event.target.closest('[data-qty]');
  if (qtyBtn) {
    changeCartQty(qtyBtn.dataset.key, Number(qtyBtn.dataset.qty));
    return;
  }
  const removeBtn = event.target.closest('[data-remove]');
  if (removeBtn) removeCartItem(removeBtn.dataset.remove);
});

checkoutBtn.addEventListener('click', checkout);

storeScreen.addEventListener('click', (event) => {
  const addBtn = event.target.closest('[data-add]');
  if (!addBtn) return;
  addToCart(addBtn.dataset.add);
});

volRange.addEventListener('input', () => {
  volValue.textContent = volRange.value;
  AudioFX.setVolume(Number(volRange.value));
  saveState();
});

volRange.addEventListener('change', () => {
  if (!state.muted) AudioFX.tick();
});

brightRange.addEventListener('input', () => {
  state.brightness = Number(brightRange.value);
  brightValue.textContent = brightRange.value;
  dim.style.opacity = String((1 - state.brightness / 100) * 0.7);
  saveState();
});

carousel.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    carousel.scrollLeft += event.deltaY;
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('resize', () => centerCard(selected, false));

/* ---------- iniciar ---------- */

applyTheme(state.theme);
applyProfile();
volRange.value = String(state.volume);
volValue.textContent = String(state.volume);
brightRange.value = String(state.brightness);
brightValue.textContent = String(state.brightness);
dim.style.opacity = String((1 - state.brightness / 100) * 0.7);

renderCards();
renderNotifications();
renderProfiles();
renderCart();
updateCartBadges();
updateClock();
setInterval(updateClock, 1000);
updateMuteUI();
AudioFX.setVolume(state.volume);

storeHeroBg.style.backgroundImage = `url("${IMG('2651280', 'library_hero.jpg', 1600)}")`;
storeHeroPrice.textContent = `${money(299.9)} · 14% OFF`;

const initialIndex = tiles.findIndex((tile) => tile.id === state.selectedId);
selected = initialIndex >= 0 ? initialIndex : 0;
select(selected, { force: true, sound: false, scroll: false, animate: false });

startBoot();

window.addEventListener('load', () => {
  setTimeout(() => {
    games.forEach((game) => {
      new Image().src = IMG(game.id, 'library_600x900.jpg', 400);
      new Image().src = IMG(game.id, 'library_hero.jpg', 1600);
    });
    extras.forEach((game) => {
      new Image().src = IMG(game.id, 'library_600x900.jpg', 400);
    });
  }, 1200);
});
