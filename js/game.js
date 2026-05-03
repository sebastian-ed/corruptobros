// ============================================
// CORRUPTO BROS — Game Engine v2
// 40 niveles, escenarios dinámicos y enemigos tipo plataforma clásica
// ============================================

const TILE = 40;
const GRAVITY = 0.72;
const MAX_FALL = 20;
const GROUND_Y = 560;
const LEVEL_COUNT = 40;
const WORLD_HEIGHT = 640;

// ===== WORLD / THEME SYSTEM =====
const WORLD_THEMES = [
  {
    name: 'CONGRESO CORRUPTO',
    bg: ['#081027', '#1a1a3e'],
    ground: '#5b3517',
    groundTop: '#9b6429',
    platform: '#4488ff',
    hazard: '#ff2244',
    deco: ['🏛️', '📜', '⚖️'],
    skyline: ['▁▃▁', '▂▅▂', '▁▆▁'],
    quote: 'Pasaste el Congreso sin quórum moral 🏛️',
  },
  {
    name: 'OFFSHORE CARIBEÑO',
    bg: ['#00283b', '#005173'],
    ground: '#76551f',
    groundTop: '#d7a546',
    platform: '#00c2ff',
    hazard: '#ffdd33',
    deco: ['🏝️', '🌊', '🛥️'],
    skyline: ['~~~~', '≈≈≈', '▁▁▁'],
    quote: 'Llegaste al paraíso fiscal con la valija intacta 🏝️',
  },
  {
    name: 'CASA ROSADA DEL CAOS',
    bg: ['#2c0b12', '#140511'],
    ground: '#4a1524',
    groundTop: '#c46b85',
    platform: '#ff6f91',
    hazard: '#ffd700',
    deco: ['🌹', '🚪', '📞'],
    skyline: ['▅▅▅', '▇▃▇', '▁▇▁'],
    quote: 'Sobreviviste a los pasillos de Casa Rosada 🌹',
  },
  {
    name: 'TRIBUNALES PIXELADOS',
    bg: ['#101010', '#252535'],
    ground: '#303040',
    groundTop: '#8a8aa0',
    platform: '#d8d8ff',
    hazard: '#ff2244',
    deco: ['⚖️', '🔨', '📁'],
    skyline: ['▉▉', '▆▆▆', '▇▁▇'],
    quote: 'La feria judicial te compró unos segundos ⚖️',
  },
  {
    name: 'CRYPTO CITY',
    bg: ['#120029', '#32105b'],
    ground: '#23113d',
    groundTop: '#6d37ff',
    platform: '#cc44ff',
    hazard: '#00ff88',
    deco: ['🪙', '📈', '💎'],
    skyline: ['0101', '░▒▓', '1010'],
    quote: 'Vendiste arriba y saliste antes del rug pull 🪙',
  },
  {
    name: 'AEROPUERTO VIP',
    bg: ['#001a3b', '#0c3566'],
    ground: '#283044',
    groundTop: '#7b879d',
    platform: '#00aaff',
    hazard: '#ff8800',
    deco: ['✈️', '🧳', '🛫'],
    skyline: ['====', '▁▁▁', '____'],
    quote: 'Embarcaste por puerta privada sin declarar equipaje ✈️',
  },
  {
    name: 'ANDIS LABERINTO',
    bg: ['#06201a', '#0b3b2e'],
    ground: '#16382f',
    groundTop: '#00a66b',
    platform: '#00ff88',
    hazard: '#ff2244',
    deco: ['💊', '🏥', '📋'],
    skyline: ['+ +', '▣▣', '▤▤'],
    quote: 'Atravesaste el expediente sin que se pierda una foja 🏥',
  },
  {
    name: 'FINAL: LA CAUSA INFINITA',
    bg: ['#1a0101', '#000000'],
    ground: '#2a0a0a',
    groundTop: '#ff2244',
    platform: '#ffd700',
    hazard: '#ff2244',
    deco: ['🔥', '💰', '👁️'],
    skyline: ['▇▇▇', '▓▓▓', '███'],
    quote: 'La causa infinita sigue abierta. Negocio redondo para los abogados 🔥',
  },
];

function hash(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pickTheme(levelIdx) {
  return WORLD_THEMES[Math.floor(levelIdx / 5) % WORLD_THEMES.length];
}

function chooseEnemyType(levelIdx, slot) {
  const pool = ['fiscal', 'periodista'];
  if (levelIdx >= 4) pool.push('juez');
  if (levelIdx >= 8) pool.push('auditor');
  if (levelIdx >= 12) pool.push('dron');
  if (levelIdx >= 16) pool.push('escribano');
  if (levelIdx >= 22) pool.push('custodio');

  // Menos jueces al inicio para evitar injusticia jugable.
  let type = pool[(slot + levelIdx + Math.floor(hash(levelIdx * 31 + slot) * pool.length)) % pool.length];
  if (levelIdx < 10 && type === 'juez' && slot % 3 !== 0) type = 'fiscal';
  return type;
}

function generateLevel(levelIdx) {
  const theme = pickTheme(levelIdx);
  const world = Math.floor(levelIdx / 5);
  const local = levelIdx % 5;
  const difficulty = 1 + levelIdx * 0.12;
  const length = 2850 + levelIdx * 145 + world * 220;
  const name = `${theme.name} ${local + 1}-5`;

  const gaps = [];
  const gapCount = Math.min(3 + Math.floor(levelIdx / 4) + (local >= 3 ? 1 : 0), 12);
  const playable = length - 900;
  const spacing = playable / Math.max(1, gapCount);

  for (let i = 0; i < gapCount; i++) {
    const jitter = Math.floor(hash(levelIdx * 101 + i * 17) * 110) - 35;
    const x = Math.floor(520 + i * spacing + jitter);
    const w = Math.min(170, 70 + world * 8 + local * 6 + Math.floor(hash(levelIdx * 19 + i) * 42));
    if (x > 360 && x + w < length - 360) gaps.push({ x, w });
  }

  const platforms = [{ x: 0, y: GROUND_Y, w: length, h: 40, type: 'ground' }];
  const floatCount = Math.min(10 + Math.floor(levelIdx * 0.55), 34);
  for (let i = 0; i < floatCount; i++) {
    const progress = i / Math.max(1, floatCount - 1);
    const x = Math.floor(180 + progress * (length - 520) + (hash(levelIdx * 77 + i) - 0.5) * 120);
    const wave = Math.sin(i * 1.35 + levelIdx * 0.6);
    const y = Math.floor(450 - ((i + levelIdx) % 4) * 48 + wave * 18 - Math.min(60, levelIdx * 1.2));
    const w = Math.floor(96 + hash(levelIdx * 11 + i) * 82);
    const moving = levelIdx >= 6 && (i + levelIdx) % Math.max(3, 6 - Math.floor(levelIdx / 12)) === 0;
    platforms.push({
      x: Math.max(120, Math.min(length - 260, x)),
      y: Math.max(230, Math.min(500, y)),
      w,
      h: 20,
      type: moving ? 'moving' : 'platform',
      baseX: Math.max(120, Math.min(length - 260, x)),
      baseY: Math.max(230, Math.min(500, y)),
      rangeX: moving ? 55 + local * 10 + Math.floor(hash(i + levelIdx) * 55) : 0,
      rangeY: moving && levelIdx >= 18 && i % 2 === 0 ? 22 + Math.floor(hash(i * 7) * 18) : 0,
      moveSpeed: moving ? 0.7 + difficulty * 0.12 + hash(i * 13) * 0.35 : 0,
      phase: hash(levelIdx * 9 + i) * Math.PI * 2,
    });
  }

  // Puentes arriba de algunos huecos para que el nivel sea desafiante, no injusto.
  gaps.forEach((gap, i) => {
    if (i % 2 === local % 2) {
      platforms.push({
        x: gap.x + 5,
        y: 438 - (i % 3) * 44,
        w: Math.max(90, gap.w + 20),
        h: 18,
        type: levelIdx >= 12 && i % 3 === 0 ? 'moving' : 'platform',
        baseX: gap.x + 5,
        baseY: 438 - (i % 3) * 44,
        rangeX: levelIdx >= 12 && i % 3 === 0 ? 70 : 0,
        rangeY: 0,
        moveSpeed: 0.9 + difficulty * 0.08,
        phase: i,
      });
    }
  });

  const enemies = [];
  const enemyCount = Math.min(7 + Math.floor(levelIdx * 0.65), 34);
  for (let i = 0; i < enemyCount; i++) {
    const x = Math.floor(330 + (i + 0.5) * ((length - 720) / enemyCount) + (hash(levelIdx * 53 + i) - 0.5) * 140);
    const type = chooseEnemyType(levelIdx, i);
    enemies.push({
      x: Math.max(220, Math.min(length - 300, x)),
      type,
      speed: 0.9 + difficulty * 0.25 + hash(i * 41 + levelIdx) * 0.85,
      dir: hash(levelIdx * 7 + i) > 0.5 ? 1 : -1,
      yHint: type === 'dron' ? 270 + (i % 4) * 42 : undefined,
    });
  }

  // Mini-boss cada 10 niveles y boss fuerte en el 40.
  if ((levelIdx + 1) % 10 === 0) {
    enemies.push({
      x: Math.max(1200, length - 760),
      type: 'tribunal',
      speed: 1.0 + difficulty * 0.12,
      dir: -1,
      hp: levelIdx === 39 ? 5 : 3,
    });
  }

  const collectibles = [];
  const collectCount = Math.min(14 + Math.floor(levelIdx * 0.55), 38);
  for (let i = 0; i < collectCount; i++) {
    const x = Math.floor(210 + i * ((length - 510) / collectCount) + (hash(levelIdx * 29 + i) - 0.5) * 88);
    collectibles.push({ x: Math.max(160, Math.min(length - 240, x)) });
  }

  const hazards = [];
  gaps.forEach((gap, i) => {
    if (levelIdx >= 3 && i % 2 === 1) {
      hazards.push({ x: gap.x + Math.max(8, gap.w * 0.2), y: GROUND_Y + 8, w: Math.max(28, gap.w * 0.55), h: 18, type: 'voidSpikes' });
    }
  });
  const hazardCount = Math.min(Math.floor(levelIdx / 5) + local, 10);
  for (let i = 0; i < hazardCount; i++) {
    const x = Math.floor(640 + i * ((length - 1300) / Math.max(1, hazardCount)) + hash(levelIdx * 37 + i) * 120);
    hazards.push({ x, y: GROUND_Y - 18, w: 42 + (i % 2) * 20, h: 18, type: 'spikes' });
  }

  const powerups = [];
  if (levelIdx % 5 === 2) powerups.push({ x: Math.floor(length * 0.48), type: 'life' });
  if (levelIdx % 4 === 1) powerups.push({ x: Math.floor(length * 0.62), type: 'shield' });
  if (levelIdx >= 10 && levelIdx % 3 === 0) powerups.push({ x: Math.floor(length * 0.73), type: 'briefcase' });

  return {
    index: levelIdx,
    name,
    worldName: theme.name,
    theme,
    bg: theme.bg,
    platforms,
    gaps,
    enemies,
    collectibles,
    hazards,
    powerups,
    checkpoint: { x: Math.floor(length * 0.52), y: GROUND_Y - 56, w: 28, h: 56, reached: false },
    goalX: length - 110,
    length,
    difficulty,
    quote: `${theme.quote} Nivel ${levelIdx + 1}/40 superado.`,
  };
}

const LEVELS = Array.from({ length: LEVEL_COUNT }, (_, i) => generateLevel(i));

// ===== ENEMY TYPES =====
const ENEMY_TYPES = {
  fiscal: {
    emoji: '👨‍⚖️',
    name: 'FISCAL',
    color: '#4488ff',
    w: 32, h: 40,
    points: 200,
    bounceOff: true,
    behavior: 'walker',
  },
  periodista: {
    emoji: '📰',
    name: 'PERIODISTA',
    color: '#ff8800',
    w: 32, h: 40,
    points: 120,
    bounceOff: true,
    behavior: 'walker',
  },
  juez: {
    emoji: '⚖️',
    name: 'JUEZ',
    color: '#ff2244',
    w: 36, h: 48,
    points: 500,
    bounceOff: false, // como un Spiny: no se pisa, se evita.
    behavior: 'walker',
  },
  auditor: {
    emoji: '🕵️',
    name: 'AUDITOR',
    color: '#00ff88',
    w: 34, h: 42,
    points: 300,
    bounceOff: true,
    behavior: 'patrolFast',
  },
  dron: {
    emoji: '🚁',
    name: 'DRON',
    color: '#cc44ff',
    w: 38, h: 34,
    points: 350,
    bounceOff: true,
    behavior: 'flyer',
  },
  escribano: {
    emoji: '📜',
    name: 'ESCRIBANO',
    color: '#ffd700',
    w: 34, h: 42,
    points: 380,
    bounceOff: true,
    behavior: 'jumper',
  },
  custodio: {
    emoji: '🛡️',
    name: 'CUSTODIO',
    color: '#ff66aa',
    w: 36, h: 44,
    points: 450,
    bounceOff: true,
    behavior: 'charger',
  },
  tribunal: {
    emoji: '🏛️',
    name: 'TRIBUNAL',
    color: '#ff2244',
    w: 62, h: 62,
    points: 1500,
    bounceOff: true,
    behavior: 'boss',
  },
};

const POWERUP_TYPES = {
  life: { emoji: '❤️', name: 'VIDA EXTRA', points: 0 },
  shield: { emoji: '🛡️', name: 'FUERO TEMPORAL', points: 250 },
  briefcase: { emoji: '💼', name: 'MALETÍN BONUS', points: 800 },
};

// ===== GAME STATE =====
let gameState = {
  running: false,
  level: 0,
  score: 0,
  lives: 3,
  character: null,
  specialCooldown: 0,
  specialActive: false,
  invincible: 0,
  loop: 1,
};

let player = null;
let camera = { x: 0, y: 0 };
let platforms = [];
let enemies = [];
let collectibles = [];
let hazards = [];
let powerups = [];
let particles = [];
let goalReached = false;
let levelData = null;
let animFrame = null;
let lastTime = 0;
let levelTime = 0;
let respawnPoint = { x: 80, y: GROUND_Y - 44 };

// Input
const keys = { left: false, right: false, up: false, space: false };
const justPressed = { up: false, space: false };

// Canvas
let canvas, ctx, CW = 800, CH = 600;
let canvasResizeBound = false;

function initCanvas() {
  canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();

  if (!canvasResizeBound) {
    window.addEventListener('resize', resizeCanvas);
    canvasResizeBound = true;
  }
}

function resizeCanvas() {
  if (!canvas) return;

  const screen = document.getElementById('screen-game');
  const hud = document.querySelector('.hud');
  const controls = document.querySelector('.mobile-controls');
  const rect = canvas.getBoundingClientRect();
  const hudH = hud?.offsetHeight || 48;
  const controlsVisible = window.matchMedia('(pointer: coarse)').matches;
  const controlsH = controlsVisible ? (controls?.offsetHeight || 60) : 0;
  const fallbackW = screen?.clientWidth || window.innerWidth || 800;
  const fallbackH = window.innerHeight - hudH - controlsH;

  CW = Math.max(320, Math.floor(rect.width || fallbackW));
  CH = Math.max(240, Math.floor(rect.height || fallbackH || 600));

  canvas.width = CW;
  canvas.height = CH;
}

// ===== HELPERS =====
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function clonePlatform(p) {
  return { ...p, prevX: p.x, prevY: p.y };
}

function splitGroundIntoSegments(ground, gaps) {
  const segments = [];
  let cursor = ground.x;
  [...gaps].sort((a, b) => a.x - b.x).forEach(gap => {
    if (gap.x > cursor) {
      segments.push({ x: cursor, y: ground.y, w: gap.x - cursor, h: ground.h, type: 'ground' });
    }
    cursor = Math.max(cursor, gap.x + gap.w);
  });
  if (cursor < ground.x + ground.w) {
    segments.push({ x: cursor, y: ground.y, w: ground.x + ground.w - cursor, h: ground.h, type: 'ground' });
  }
  return segments;
}

function findSupportAt(x, w = 32, maxY = WORLD_HEIGHT + 400, preferFloating = false) {
  const center = x + w / 2;
  const candidates = platforms
    .filter(p => center >= p.x && center <= p.x + p.w && p.y <= maxY)
    .sort((a, b) => b.y - a.y); // primero suelo/soporte más bajo: spawn estable.

  if (preferFloating) {
    const floating = candidates.filter(p => p.type !== 'ground');
    if (floating.length) return floating.sort((a, b) => a.y - b.y)[0];
  }

  return candidates[0] || null;
}

function findNearestSupport(x, w = 32, preferFloating = false) {
  let support = findSupportAt(x, w, WORLD_HEIGHT + 400, preferFloating);
  if (support) return support;

  let best = null;
  let bestDist = Infinity;
  const center = x + w / 2;
  const source = preferFloating && platforms.some(p => p.type !== 'ground')
    ? platforms.filter(p => p.type !== 'ground')
    : platforms;

  source.forEach(p => {
    const px = clamp(center, p.x + 8, p.x + p.w - 8);
    const dist = Math.abs(center - px) + Math.abs(GROUND_Y - p.y) * 0.1;
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  });
  return best;
}

function safeXOnSupport(preferredX, w = 36, groundOnly = false) {
  const list = platforms.filter(p => !groundOnly || p.type === 'ground');
  const current = list.find(p => preferredX + w > p.x && preferredX < p.x + p.w);
  if (current) return clamp(preferredX, current.x + 8, current.x + current.w - w - 8);

  const target = list.reduce((best, p) => {
    const dist = Math.abs(preferredX - clamp(preferredX, p.x, p.x + p.w));
    return !best || dist < best.dist ? { p, dist } : best;
  }, null)?.p;

  return target ? clamp(preferredX, target.x + 8, target.x + target.w - w - 8) : preferredX;
}

function safeYAt(x, w = 36, h = 44) {
  const support = findNearestSupport(x, w);
  return support ? support.y - h : GROUND_Y - h;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function isOnScreen(obj, margin = 80) {
  const sx = obj.x - camera.x;
  const sy = obj.y - camera.y;
  return sx + obj.w > -margin && sx < CW + margin && sy + obj.h > -margin && sy < CH + margin;
}

// ===== PLAYER =====
function createPlayer(charData) {
  const startX = safeXOnSupport(80, 36, true);
  const startY = safeYAt(startX, 36, 44);
  respawnPoint = { x: startX, y: startY };
  return {
    x: startX,
    y: startY,
    w: 36,
    h: 44,
    vx: 0,
    vy: 0,
    onGround: false,
    facingRight: true,
    jumpCount: 0,
    maxJumps: 2,
    char: charData,
    animTimer: 0,
    walkCycle: 0,
    ridePlatform: null,
  };
}

// ===== LEVEL INIT =====
function initLevel(levelIdx) {
  levelData = LEVELS[levelIdx];
  camera.x = 0;
  camera.y = Math.max(0, GROUND_Y + 80 - CH);
  goalReached = false;
  levelTime = 0;

  const basePlatforms = levelData.platforms.map(clonePlatform);
  const groundBase = basePlatforms.find(p => p.type === 'ground');
  const rest = basePlatforms.filter(p => p.type !== 'ground' && p.type !== 'pit_marker');
  platforms = groundBase ? [...splitGroundIntoSegments(groundBase, levelData.gaps || []), ...rest] : rest;
  platforms = platforms.map(clonePlatform);

  hazards = (levelData.hazards || []).map(h => ({ ...h }));
  powerups = (levelData.powerups || []).map((p, i) => ({
    ...p,
    id: i,
    w: 28,
    h: 28,
    collected: false,
    bobOffset: hash(levelIdx * 23 + i) * Math.PI * 2,
  }));

  powerups.forEach((p, i) => {
    const support = findNearestSupport(p.x, p.w, i % 2 === 0);
    p.y = support ? support.y - p.h - 12 : GROUND_Y - p.h - 12;
  });

  enemies = levelData.enemies.map((e, i) => {
    const type = ENEMY_TYPES[e.type] || ENEMY_TYPES.fiscal;
    const enemy = {
      x: e.x,
      y: e.yHint || 0,
      w: type.w,
      h: type.h,
      type: e.type,
      typeData: type,
      speed: e.speed,
      dir: e.dir || 1,
      alive: true,
      onGround: false,
      vy: 0,
      stunned: 0,
      animTimer: hash(levelIdx * 47 + i) * 2,
      baseY: e.yHint || 0,
      chargeTimer: 0,
      hp: e.hp || type.hp || 1,
    };

    if (type.behavior === 'flyer') {
      enemy.y = e.yHint || (270 + (i % 4) * 44);
      enemy.baseY = enemy.y;
      enemy.vy = 0;
    } else {
      const preferFloating = i % 3 === 0 || type.behavior === 'jumper' || type.behavior === 'boss';
      const support = findNearestSupport(enemy.x, enemy.w, preferFloating);
      enemy.x = support ? clamp(enemy.x, support.x + 10, support.x + support.w - enemy.w - 10) : enemy.x;
      enemy.y = support ? support.y - enemy.h : GROUND_Y - enemy.h;
    }
    return enemy;
  });

  collectibles = levelData.collectibles.map((c, i) => ({
    x: c.x,
    y: GROUND_Y - 60,
    w: 24,
    h: 24,
    collected: false,
    id: i,
    bobOffset: hash(levelIdx * 89 + i) * Math.PI * 2,
  }));

  collectibles.forEach((c, i) => {
    const support = findNearestSupport(c.x, c.w, i % 2 === 0);
    if (support) {
      c.x = clamp(c.x, support.x + 10, support.x + support.w - c.w - 10);
      c.y = support.y - c.h - 10;
    }
  });

  if (levelData.checkpoint) {
    const support = findNearestSupport(levelData.checkpoint.x, levelData.checkpoint.w);
    levelData.checkpoint.y = support ? support.y - levelData.checkpoint.h : GROUND_Y - levelData.checkpoint.h;
    levelData.checkpoint.reached = false;
  }

  respawnPoint = { x: safeXOnSupport(80, 36, true), y: safeYAt(safeXOnSupport(80, 36, true), 36, 44) };
  particles = [];
}

// ===== MOVING PLATFORMS =====
function updateMovingPlatforms(dt) {
  const t = levelTime;
  platforms.forEach(p => {
    p.prevX = p.x;
    p.prevY = p.y;
    if (p.type !== 'moving') return;

    p.x = p.baseX + Math.sin(t * p.moveSpeed + p.phase) * p.rangeX;
    p.y = p.baseY + Math.sin(t * p.moveSpeed * 0.75 + p.phase * 0.7) * p.rangeY;
  });
}

// ===== PHYSICS =====
function updatePlayer(dt) {
  if (!player || !levelData) return;

  const char = player.char;
  const speed = char.speed;
  const jumpForce = char.jumpForce;
  player.ridePlatform = null;

  if (keys.left) {
    player.vx = -speed * 60 * dt;
    player.facingRight = false;
  } else if (keys.right) {
    player.vx = speed * 60 * dt;
    player.facingRight = true;
  } else {
    player.vx *= 0.72;
  }

  if (justPressed.up && player.jumpCount < player.maxJumps) {
    player.vy = -jumpForce;
    player.jumpCount++;
    justPressed.up = false;
    spawnParticle(player.x + player.w / 2, player.y + player.h, '💨', 18);
  }

  if (justPressed.space && gameState.specialCooldown <= 0) {
    activateSpecial();
    justPressed.space = false;
  }

  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL);

  // Move X
  player.x += player.vx;
  player.x = clamp(player.x, 0, levelData.length - player.w);

  platforms.forEach(p => {
    if (rectsOverlap(player, p)) {
      if (player.vx > 0) player.x = p.x - player.w;
      else if (player.vx < 0) player.x = p.x + p.w;
      player.vx = 0;
    }
  });

  // Move Y
  const prevY = player.y;
  player.y += player.vy;
  player.onGround = false;

  platforms.forEach(p => {
    if (!rectsOverlap(player, p)) return;

    const wasAbove = prevY + player.h <= p.y + 8;
    if (player.vy >= 0 && wasAbove) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
      player.jumpCount = 0;
      player.ridePlatform = p;
      if (p.type === 'moving') {
        player.x += p.x - p.prevX;
        player.y += p.y - p.prevY;
      }
    } else if (player.vy < 0) {
      player.y = p.y + p.h;
      player.vy = 0;
    }
  });

  if (player.y > GROUND_Y + 210) {
    loseLife('Caíste al vacío... la causa prescribió en caída libre ⚖️');
    return;
  }

  if (gameState.specialCooldown > 0) gameState.specialCooldown -= dt;
  if (gameState.invincible > 0) gameState.invincible -= dt;

  player.animTimer += dt;
  if (player.animTimer > 0.10) {
    player.animTimer = 0;
    if (Math.abs(player.vx) > 0.35) player.walkCycle = (player.walkCycle + 1) % 4;
  }

  // Enemy collision
  if (gameState.invincible <= 0 && !gameState.specialActive) {
    enemies.forEach(enemy => {
      if (!enemy.alive || enemy.stunned > 0) return;
      if (!rectsOverlap(player, enemy)) return;

      const stomp = player.vy > 0 && prevY + player.h <= enemy.y + enemy.h * 0.45;
      if (stomp) {
        if (enemy.typeData.bounceOff) {
          stompEnemy(enemy);
          player.vy = -11;
          player.jumpCount = 1;
        } else {
          loseLife('Ese juez es tipo caparazón con pinches: no se pisa, se esquiva.');
        }
      } else {
        loseLife(enemy.typeData.name + ' te interceptó. Gestión de riesgo: baja.');
      }
    });
  }

  // Hazards
  if (gameState.invincible <= 0) {
    hazards.forEach(h => {
      if (rectsOverlap(player, h)) loseLife('Te clavaste con una chicana procesal.');
    });
  }

  // Collectibles
  collectibles.forEach(c => {
    if (!c.collected && rectsOverlap(player, c)) {
      c.collected = true;
      gameState.score += 100 + Math.floor(levelData.difficulty * 10);
      updateHUD();
      spawnParticle(c.x + 12, c.y, char.collectibleEmoji, 22);
      spawnParticle(c.x + 12, c.y - 12, '+100', 14);
    }
  });

  // Powerups
  powerups.forEach(p => {
    if (p.collected || !rectsOverlap(player, p)) return;
    collectPowerup(p);
  });

  // Checkpoint
  const cp = levelData.checkpoint;
  if (cp && !cp.reached && rectsOverlap(player, cp)) {
    cp.reached = true;
    respawnPoint = { x: safeXOnSupport(cp.x, player.w), y: safeYAt(cp.x, player.w, player.h) };
    gameState.score += 500;
    updateHUD();
    spawnParticle(cp.x + cp.w / 2, cp.y, '🚩', 28);
    showToast('🚩 Checkpoint activado. La causa queda radicada acá. +500');
  }

  if (player.x + player.w >= levelData.goalX && !goalReached) {
    goalReached = true;
    levelComplete();
  }
}

function collectPowerup(p) {
  const type = POWERUP_TYPES[p.type] || POWERUP_TYPES.briefcase;
  p.collected = true;

  if (p.type === 'life') {
    gameState.lives = Math.min(5, gameState.lives + 1);
    showToast('❤️ Vida extra. Blindaje institucional reforzado.');
  } else if (p.type === 'shield') {
    gameState.invincible = 5;
    gameState.score += type.points;
    showToast('🛡️ Fuero temporal: 5 segundos de invulnerabilidad.');
  } else {
    gameState.score += type.points;
    showToast('💼 Maletín bonus +' + type.points + ' CAUSA$');
  }

  updateHUD();
  spawnParticle(p.x + p.w / 2, p.y, type.emoji, 26);
}

function updateEnemies(dt) {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    if (enemy.stunned > 0) {
      enemy.stunned -= dt;
      return;
    }

    enemy.animTimer += dt;
    const type = enemy.typeData;

    if (type.behavior === 'flyer') {
      enemy.x += enemy.speed * enemy.dir * 44 * dt;
      enemy.y = enemy.baseY + Math.sin(enemy.animTimer * 2.4) * 38;
      if (enemy.x < 80 || enemy.x + enemy.w > levelData.length - 80) enemy.dir *= -1;
      return;
    }

    if (type.behavior === 'charger') {
      const dist = player ? player.x - enemy.x : 9999;
      if (Math.abs(dist) < 270 && Math.abs((player?.y || 0) - enemy.y) < 90) {
        enemy.dir = dist > 0 ? 1 : -1;
        enemy.chargeTimer = 0.9;
      }
      if (enemy.chargeTimer > 0) enemy.chargeTimer -= dt;
    }

    if ((type.behavior === 'jumper' || type.behavior === 'boss') && enemy.onGround) {
      const cadence = type.behavior === 'boss' ? 1.1 : 1.6;
      if ((enemy.animTimer % cadence) < dt) {
        enemy.vy = type.behavior === 'boss' ? -12 : -10;
      }
    }

    const speedMult = type.behavior === 'patrolFast' ? 1.35 : type.behavior === 'charger' && enemy.chargeTimer > 0 ? 2.2 : 1;
    enemy.x += enemy.speed * enemy.dir * 42 * speedMult * dt;
    enemy.vy = Math.min(enemy.vy + GRAVITY, MAX_FALL);

    const prevY = enemy.y;
    enemy.y += enemy.vy;
    enemy.onGround = false;

    platforms.forEach(p => {
      if (!rectsOverlap(enemy, p)) return;
      const wasAbove = prevY + enemy.h <= p.y + 8;
      if (enemy.vy >= 0 && wasAbove) {
        enemy.y = p.y - enemy.h;
        enemy.vy = 0;
        enemy.onGround = true;
      }
    });

    if (enemy.onGround) {
      const aheadX = enemy.dir > 0 ? enemy.x + enemy.w + 5 : enemy.x - 5;
      const footY = enemy.y + enemy.h + 5;
      const platformAhead = platforms.some(p =>
        aheadX >= p.x && aheadX <= p.x + p.w &&
        footY >= p.y && footY <= p.y + p.h + 16
      );
      if (!platformAhead) enemy.dir *= -1;
    }

    // Wall collision / edge bounds
    if (enemy.x < 0) { enemy.x = 0; enemy.dir = 1; }
    if (enemy.x + enemy.w > levelData.length) { enemy.x = levelData.length - enemy.w; enemy.dir = -1; }

    if (enemy.y > GROUND_Y + 210) enemy.alive = false;
  });
}

function updateParticles(dt) {
  particles = particles.filter(p => {
    p.life -= dt;
    p.y -= p.speed * dt;
    p.x += p.vx * dt;
    p.alpha = Math.max(0, p.life / p.maxLife);
    return p.life > 0;
  });
}

function updateCamera(dt) {
  if (!player || !levelData) return;
  const targetX = clamp(player.x - CW * 0.35, 0, Math.max(0, levelData.length - CW));
  const maxY = Math.max(0, GROUND_Y + 92 - CH);
  const targetY = clamp(player.y - CH * 0.48, 0, maxY);
  camera.x += (targetX - camera.x) * Math.min(1, dt * 8);
  camera.y += (targetY - camera.y) * Math.min(1, dt * 5);
}

// ===== SPECIAL ABILITY =====
function activateSpecial() {
  if (!player) return;
  const char = player.char;
  gameState.specialCooldown = 8;
  gameState.specialActive = true;

  switch(char.id) {
    case 'milei':
      enemies.forEach(e => {
        if (e.alive && e.x > camera.x - 80 && e.x < camera.x + CW + 80) e.stunned = 3;
      });
      for (let i = 0; i < 12; i++) spawnParticle(player.x + Math.random() * 40, player.y - Math.random() * 60, '🐕', 24);
      showToast('👻 ¡CONAN FANTASMA! Stun global de fiscales en pantalla.');
      break;

    case 'karina':
      enemies.forEach(e => { if (Math.abs(e.x - player.x) < 330 && e.alive) e.stunned = 4; });
      for (let i = 0; i < 10; i++) spawnParticle(player.x + Math.random() * 80, player.y - Math.random() * 40, '🌹', 22);
      showToast('🌹 ¡RAMO DE ROSAS! Congelamiento táctico.');
      break;

    case 'adorni':
      player.vy = -20;
      player.vx = player.facingRight ? 24 : -24;
      gameState.invincible = 1.2;
      for (let i = 0; i < 8; i++) spawnParticle(player.x + Math.random() * 40, player.y + Math.random() * 20, '✈️', 24);
      showToast('✈️ ¡FIRST CLASS! Escape aéreo con invulnerabilidad breve.');
      break;

    case 'espert':
      collectibles.forEach(c => {
        if (!c.collected && Math.abs(c.x - player.x) < 440) {
          c.collected = true;
          gameState.score += 220;
          spawnParticle(c.x, c.y, '💰', 22);
        }
      });
      updateHUD();
      for (let i = 0; i < 8; i++) spawnParticle(player.x + Math.random() * 60, player.y - Math.random() * 50, '💰', 24);
      showToast('💰 ¡200 MIL VERDES! Recolección magnética cercana.');
      break;

    case 'spagnuolo':
      gameState.invincible = 5;
      gameState.score += 500;
      updateHUD();
      enemies.forEach(e => { if (isOnScreen(e, 80)) e.stunned = 1.5; });
      for (let i = 0; i < 10; i++) spawnParticle(player.x + Math.random() * 40, player.y - Math.random() * 60, '🤫', 24);
      showToast('🤫 ¡SILENCIO TOTAL! Invulnerabilidad +500 CAUSA$.');
      break;

    case 'novelli':
      enemies.forEach(e => { if (isOnScreen(e, 40) && e.type !== 'tribunal') e.alive = false; });
      for (let i = 0; i < 10; i++) spawnParticle(player.x + Math.random() * 40, player.y - Math.random() * 50, '📱', 24);
      showToast('📱 ¡BORRAR CHATS! Los enemigos de pantalla desaparecen.');
      break;
  }

  setTimeout(() => { gameState.specialActive = false; }, 550);
}

// ===== ENEMY INTERACTION =====
function stompEnemy(enemy) {
  if (!enemy.alive) return;

  if (enemy.type === 'tribunal') {
    enemy.hp--;
    enemy.stunned = 0.45;
    enemy.vy = -5;
    spawnParticle(enemy.x + enemy.w / 2, enemy.y, '💥', 28);
    if (enemy.hp > 0) {
      gameState.score += 250;
      updateHUD();
      showToast('🏛️ Tribunal golpeado. Faltan ' + enemy.hp + ' impactos.');
      return;
    }
  }

  enemy.alive = false;
  gameState.score += enemy.typeData.points;
  updateHUD();
  spawnParticle(enemy.x + enemy.w / 2, enemy.y, '⭐', 24);
  spawnParticle(enemy.x + enemy.w / 2, enemy.y - 12, '+' + enemy.typeData.points, 16);
}

// ===== LIFE MANAGEMENT =====
function loseLife(msg) {
  if (gameState.invincible > 0 || !player) return;
  gameState.lives--;
  gameState.invincible = 2.2;
  updateHUD();
  spawnParticle(player.x + player.w / 2, player.y, '💀', 28);

  if (gameState.lives <= 0) {
    gameState.running = false;
    setTimeout(() => gameOver(msg), 400);
  } else {
    player.x = safeXOnSupport(respawnPoint.x, player.w);
    player.y = safeYAt(player.x, player.w, player.h);
    player.vx = 0;
    player.vy = 0;
    player.jumpCount = 0;
    showToast('💀 ' + (msg || 'Te atrapó la justicia... ' + gameState.lives + ' vidas restantes'));
  }
}

// ===== LEVEL COMPLETE =====
function levelComplete() {
  const bonus = 2200 + (gameState.level + 1) * 420 + Math.floor(gameState.lives * 250);
  gameState.score += bonus;
  updateHUD();
  gameState.running = false;
  if (animFrame) cancelAnimationFrame(animFrame);
  showScreen('screen-win');

  const isFinal = gameState.level === LEVELS.length - 1;
  document.getElementById('win-message').textContent = isFinal
    ? 'Completaste los 40 niveles. La causa infinita entra en segunda vuelta.'
    : levelData.quote;
  document.getElementById('win-bonus').textContent = '+' + bonus + ' CAUSA$';
}

// ===== GAME OVER =====
function gameOver(msg) {
  if (animFrame) cancelAnimationFrame(animFrame);
  showScreen('screen-gameover');
  document.getElementById('go-score-val').textContent = String(gameState.score).padStart(6, '0');
  document.getElementById('go-subtitle').textContent = msg || 'EL FISCAL TE ATRAPÓ';

  const quotes = gameState.character ? CHARACTERS[gameState.character].deathQuotes : GAME_QUOTES;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('go-quote').textContent = quote;

  document.getElementById('btn-save-score').style.display = 'block';
  document.getElementById('btn-save-score').dataset.score = gameState.score;
}

// ===== PARTICLES =====
function spawnParticle(x, y, text, size) {
  particles.push({
    x,
    y,
    text,
    size,
    speed: 70 + Math.random() * 70,
    vx: (Math.random() - 0.5) * 48,
    life: 0.85 + Math.random() * 0.4,
    maxLife: 1.25,
    alpha: 1,
  });
}

// ===== DRAWING =====
function drawBackground(time) {
  const theme = levelData.theme;
  const [c1, c2] = levelData.bg;
  const grad = ctx.createLinearGradient(0, 0, 0, CH);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CW, CH);

  // Retro grid / scanline sky
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let y = 40 - (camera.y * 0.15) % 40; y < CH; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CW, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Parallax decorations
  ctx.save();
  ctx.textAlign = 'center';
  for (let layer = 0; layer < 3; layer++) {
    const speed = 0.12 + layer * 0.12;
    const size = 24 + layer * 9;
    ctx.font = size + 'px serif';
    ctx.globalAlpha = 0.10 + layer * 0.06;
    for (let i = -1; i < 12; i++) {
      const worldX = i * 340 + layer * 90;
      const sx = worldX - camera.x * speed;
      const emoji = theme.deco[(i + layer + levelData.index) % theme.deco.length];
      ctx.fillText(emoji, ((sx % (CW + 420)) + (CW + 420)) % (CW + 420) - 120, 90 + layer * 88 + Math.sin(time * 0.001 + i) * 10);
    }
  }
  ctx.restore();

  // Horizon silhouettes
  ctx.save();
  ctx.font = '26px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  for (let i = -1; i < 16; i++) {
    const sx = i * 150 - (camera.x * 0.22) % 150;
    ctx.fillText(theme.skyline[((i + levelData.index) % theme.skyline.length + theme.skyline.length) % theme.skyline.length], sx, CH - 72 + camera.y * 0.04);
  }
  ctx.restore();
}

function drawPlatforms() {
  const theme = levelData.theme;
  platforms.forEach(p => {
    if (!isOnScreen(p, 80)) return;
    const sx = Math.floor(p.x - camera.x);
    const sy = Math.floor(p.y - camera.y);
    const isGround = p.type === 'ground';
    const isMoving = p.type === 'moving';
    const color = isGround ? theme.ground : (player?.char?.platformColor || theme.platform);

    ctx.fillStyle = isGround ? theme.ground : color + (isMoving ? '66' : '44');
    ctx.fillRect(sx, sy, p.w, p.h);

    ctx.fillStyle = isGround ? theme.groundTop : color + 'dd';
    ctx.fillRect(sx, sy, p.w, isGround ? 8 : 4);

    if (isGround) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      for (let bx = sx; bx < sx + p.w; bx += 40) ctx.fillRect(bx + 2, sy + 10, 32, p.h - 12);
    } else {
      ctx.fillStyle = color + '30';
      for (let bx = sx; bx < sx + p.w; bx += 22) ctx.fillRect(bx, sy + 5, 8, p.h - 5);
      if (isMoving) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.fillText('↔', sx + p.w / 2, sy - 6);
      }
    }
  });
}

function drawHazards(time) {
  const theme = levelData.theme;
  hazards.forEach(h => {
    if (!isOnScreen(h, 80)) return;
    const sx = h.x - camera.x;
    const sy = h.y - camera.y;
    ctx.save();
    ctx.fillStyle = theme.hazard;
    ctx.strokeStyle = '#111';
    const spikes = Math.max(2, Math.floor(h.w / 16));
    for (let i = 0; i < spikes; i++) {
      const x = sx + i * (h.w / spikes);
      ctx.beginPath();
      ctx.moveTo(x, sy + h.h);
      ctx.lineTo(x + h.w / spikes / 2, sy + Math.sin(time * 0.006 + i) * 2);
      ctx.lineTo(x + h.w / spikes, sy + h.h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawEnemies() {
  enemies.forEach(enemy => {
    if (!enemy.alive || !isOnScreen(enemy, 120)) return;
    const sx = enemy.x - camera.x;
    const sy = enemy.y - camera.y;
    const t = enemy.typeData;

    ctx.save();
    if (enemy.stunned > 0) ctx.globalAlpha = 0.45 + Math.sin(Date.now() * 0.025) * 0.35;

    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(sx + 4, sy + enemy.h - 4, enemy.w - 8, 6);

    ctx.fillStyle = t.color + '30';
    ctx.fillRect(sx, sy, enemy.w, enemy.h);
    ctx.strokeStyle = t.color;
    ctx.lineWidth = enemy.type === 'tribunal' ? 3 : 2;
    ctx.strokeRect(sx, sy, enemy.w, enemy.h);

    if (enemy.chargeTimer > 0) {
      ctx.strokeStyle = '#ffd700';
      ctx.strokeRect(sx - 3, sy - 3, enemy.w + 6, enemy.h + 6);
    }

    ctx.font = (enemy.h * 0.62) + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.emoji, sx + enemy.w / 2, sy + enemy.h * 0.72);

    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = t.color;
    ctx.fillText(t.name, sx + enemy.w / 2, sy - 5);

    if (enemy.type === 'tribunal') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(sx, sy - 14, enemy.w, 5);
      ctx.fillStyle = '#ff2244';
      ctx.fillRect(sx, sy - 14, enemy.w * (enemy.hp / (levelData.index === 39 ? 5 : 3)), 5);
    }

    ctx.restore();
  });
}

function drawCollectibles(time) {
  if (!player) return;
  const char = player.char;
  collectibles.forEach(c => {
    if (c.collected || !isOnScreen(c, 80)) return;
    const sx = c.x - camera.x;
    const sy = c.y - camera.y;
    const bob = Math.sin(time * 0.003 + c.bobOffset) * 4;

    ctx.save();
    ctx.shadowColor = char.platformColor || '#ffd700';
    ctx.shadowBlur = 12;
    ctx.font = '21px serif';
    ctx.textAlign = 'center';
    ctx.fillText(char.collectibleEmoji, sx + c.w / 2, sy + c.h - 2 + bob);
    ctx.restore();

    ctx.strokeStyle = (char.platformColor || '#ffd700') + '66';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx + c.w / 2, sy + c.h / 2 + bob, c.w / 2 + Math.sin(time * 0.005) * 3, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawPowerups(time) {
  powerups.forEach(p => {
    if (p.collected || !isOnScreen(p, 80)) return;
    const type = POWERUP_TYPES[p.type] || POWERUP_TYPES.briefcase;
    const sx = p.x - camera.x;
    const sy = p.y - camera.y;
    const bob = Math.sin(time * 0.004 + p.bobOffset) * 5;
    ctx.save();
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14;
    ctx.font = '25px serif';
    ctx.textAlign = 'center';
    ctx.fillText(type.emoji, sx + p.w / 2, sy + p.h + bob);
    ctx.restore();
  });
}

function drawCheckpoint() {
  const cp = levelData.checkpoint;
  if (!cp || !isOnScreen(cp, 80)) return;
  const sx = cp.x - camera.x;
  const sy = cp.y - camera.y;
  ctx.fillStyle = '#888';
  ctx.fillRect(sx + 12, sy, 4, cp.h);
  ctx.font = '26px serif';
  ctx.textAlign = 'left';
  ctx.fillText(cp.reached ? '🚩' : '🏳️', sx + 16, sy + 20);
  ctx.font = '7px "Press Start 2P", monospace';
  ctx.fillStyle = cp.reached ? '#00ff88' : 'rgba(255,255,255,0.45)';
  ctx.textAlign = 'center';
  ctx.fillText('CHECK', sx + 14, sy - 6);
}

function drawGoal() {
  const sx = levelData.goalX - camera.x;
  const syBase = GROUND_Y - camera.y;
  if (sx + 80 < 0 || sx > CW) return;

  ctx.fillStyle = '#888';
  ctx.fillRect(sx, syBase - 210, 4, 210);

  ctx.fillStyle = '#ffd700';
  ctx.font = '30px serif';
  ctx.textAlign = 'left';
  ctx.fillText('🏁', sx + 5, syBase - 176);

  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'center';
  ctx.fillText('META', sx + 18, syBase - 222);
}

function drawPlayer(time) {
  if (!player) return;
  const char = player.char;
  const sx = player.x - camera.x;
  const sy = player.y - camera.y;

  ctx.save();
  if (gameState.invincible > 0 && Math.floor(Date.now() / 95) % 2 === 0) ctx.globalAlpha = 0.42;

  ctx.fillStyle = 'rgba(0,0,0,0.40)';
  ctx.fillRect(sx + 6, sy + player.h - 4, player.w - 12, 6);

  ctx.fillStyle = char.color + '22';
  ctx.fillRect(sx, sy, player.w, player.h);

  const wobble = player.onGround && Math.abs(player.vx) > 0.35 ? Math.sin(player.walkCycle * Math.PI / 2) * 2 : 0;

  if (!player.facingRight) {
    ctx.translate(sx + player.w / 2, sy + player.h / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(sx + player.w / 2), -(sy + player.h / 2));
  }

  ctx.font = (player.h * 0.72) + 'px serif';
  ctx.textAlign = 'center';
  ctx.fillText(char.emoji, sx + player.w / 2, sy + player.h - 4 + wobble);
  ctx.restore();

  if (gameState.specialCooldown > 0) {
    const pct = gameState.specialCooldown / 8;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(sx, sy - 11, player.w, 4);
    ctx.fillStyle = char.color;
    ctx.fillRect(sx, sy - 11, player.w * (1 - pct), 4);
  } else {
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ff88';
    ctx.textAlign = 'center';
    ctx.fillText('ESPECIAL ✓', sx + player.w / 2, sy - 14);
  }
}

function drawParticles() {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.font = p.size + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x - camera.x, p.y - camera.y);
    ctx.restore();
  });
}

function drawLevelInfo() {
  ctx.save();
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.textAlign = 'center';
  ctx.fillText('NIVEL ' + (gameState.level + 1) + '/40 — ' + levelData.name, CW / 2, CH - 14);

  ctx.font = '7px "Press Start 2P", monospace';
  ctx.fillStyle = 'rgba(255,215,0,0.55)';
  ctx.textAlign = 'left';
  ctx.fillText('[X/SHIFT] ' + player?.char?.specialPower, 8, CH - 14);

  const progress = clamp((player?.x || 0) / Math.max(1, levelData.goalX), 0, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(CW - 132, CH - 21, 120, 6);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(CW - 132, CH - 21, 120 * progress, 6);
  ctx.restore();
}

// ===== GAME LOOP =====
function gameLoop(timestamp) {
  if (!gameState.running) return;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0.016;
  lastTime = timestamp;
  levelTime += dt;

  updateMovingPlatforms(dt);
  updatePlayer(dt);
  updateEnemies(dt);
  updateParticles(dt);
  updateCamera(dt);

  ctx.clearRect(0, 0, CW, CH);
  drawBackground(timestamp);
  drawCheckpoint();
  drawPlatforms();
  drawHazards(timestamp);
  drawGoal();
  drawCollectibles(timestamp);
  drawPowerups(timestamp);
  drawEnemies();
  drawPlayer(timestamp);
  drawParticles();
  drawLevelInfo();

  justPressed.up = false;
  justPressed.space = false;

  animFrame = requestAnimationFrame(gameLoop);
}

// ===== CONTROLS =====
function setupControls() {
  document.addEventListener('keydown', e => {
    switch(e.code) {
      case 'ArrowLeft': case 'KeyA': keys.left = true; break;
      case 'ArrowRight': case 'KeyD': keys.right = true; break;
      case 'ArrowUp': case 'KeyW': case 'Space':
        if (!keys.up) justPressed.up = true;
        keys.up = true;
        break;
      case 'KeyX': case 'ShiftLeft': case 'ShiftRight':
        justPressed.space = true;
        break;
    }
    if (['ArrowLeft','ArrowRight','ArrowUp','Space'].includes(e.code)) e.preventDefault();
  });

  document.addEventListener('keyup', e => {
    switch(e.code) {
      case 'ArrowLeft': case 'KeyA': keys.left = false; break;
      case 'ArrowRight': case 'KeyD': keys.right = false; break;
      case 'ArrowUp': case 'KeyW': case 'Space': keys.up = false; break;
    }
  });

  document.getElementById('ctrl-left')?.addEventListener('touchstart', e => { e.preventDefault(); keys.left = true; });
  document.getElementById('ctrl-left')?.addEventListener('touchend', e => { e.preventDefault(); keys.left = false; });
  document.getElementById('ctrl-right')?.addEventListener('touchstart', e => { e.preventDefault(); keys.right = true; });
  document.getElementById('ctrl-right')?.addEventListener('touchend', e => { e.preventDefault(); keys.right = false; });
  document.getElementById('ctrl-jump')?.addEventListener('touchstart', e => {
    e.preventDefault();
    justPressed.up = true;
    keys.up = true;
  });
  document.getElementById('ctrl-jump')?.addEventListener('touchend', e => { e.preventDefault(); keys.up = false; });

  // Doble tap en SALTAR = especial en móvil. Evita agregar HTML nuevo.
  let lastJumpTap = 0;
  document.getElementById('ctrl-jump')?.addEventListener('touchstart', () => {
    const now = Date.now();
    if (now - lastJumpTap < 280) justPressed.space = true;
    lastJumpTap = now;
  }, { passive: true });
}

// ===== START / NEXT =====
function startGame(characterId) {
  const char = CHARACTERS[characterId];
  if (!char) return;

  gameState = {
    running: true,
    level: 0,
    score: 0,
    lives: 3,
    character: characterId,
    specialCooldown: 0,
    specialActive: false,
    invincible: 0,
    loop: 1,
  };

  showScreen('screen-game');
  initCanvas();
  resizeCanvas();
  initLevel(0);
  player = createPlayer(char);

  updateHUD();
  showLevelBanner();

  if (animFrame) cancelAnimationFrame(animFrame);
  lastTime = performance.now();
  animFrame = requestAnimationFrame(gameLoop);
}

function nextLevel() {
  gameState.level++;
  if (gameState.level >= LEVELS.length) {
    gameState.level = 0;
    gameState.loop++;
    gameState.score += 10000;
    gameState.lives = Math.min(5, gameState.lives + 1);
  }

  showScreen('screen-game');
  resizeCanvas();
  initLevel(gameState.level);

  const char = CHARACTERS[gameState.character];
  const startX = safeXOnSupport(80, player?.w || 36, true);
  player = {
    ...player,
    x: startX,
    y: safeYAt(startX, player?.w || 36, player?.h || 44),
    vx: 0,
    vy: 0,
    onGround: false,
    facingRight: true,
    jumpCount: 0,
    maxJumps: 2,
    char,
  };
  respawnPoint = { x: player.x, y: player.y };

  gameState.specialCooldown = 0;
  gameState.invincible = 1.2;

  updateHUD();
  showLevelBanner();

  if (animFrame) cancelAnimationFrame(animFrame);
  lastTime = performance.now();
  gameState.running = true;
  animFrame = requestAnimationFrame(gameLoop);
}

function updateHUD() {
  document.getElementById('hud-score').textContent = String(gameState.score).padStart(6, '0');
  document.getElementById('hud-level').textContent = gameState.level + 1;
  document.getElementById('hud-lives').textContent = '❤️'.repeat(Math.max(0, gameState.lives));
  if (gameState.character) {
    const char = CHARACTERS[gameState.character];
    document.getElementById('hud-char-emoji').textContent = char.emoji;
    document.getElementById('hud-char-name').textContent = char.name.split(' ')[0];
  }
}

function showLevelBanner() {
  const old = document.querySelector('.level-banner');
  if (old) old.remove();

  const banner = document.createElement('div');
  banner.className = 'level-banner';
  banner.innerHTML = `
    <h2>NIVEL ${gameState.level + 1}/40</h2>
    <p>${LEVELS[gameState.level].name}</p>
  `;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 2100);
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2500);
}

// Init controls on load
let controlsInitialized = false;
document.addEventListener('DOMContentLoaded', () => {
  if (!controlsInitialized) {
    setupControls();
    controlsInitialized = true;
  }
  initCanvas();
});
