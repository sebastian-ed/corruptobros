// ============================================
// CORRUPTO BROS — Game Engine
// Canvas-based Mario-style platformer
// ============================================

const TILE = 40;
const GRAVITY = 0.65;
const MAX_FALL = 18;

// ===== LEVEL DESIGNS =====
const LEVELS = [
  {
    name: 'CONGRESO CORRUPTO',
    bg: ['#0a0a2e', '#1a1a3e'],
    platforms: [
      // Ground
      { x: 0, y: 560, w: 3200, h: 40, type: 'ground' },
      // Floating platforms
      { x: 200, y: 440, w: 120, h: 20, type: 'platform' },
      { x: 420, y: 360, w: 100, h: 20, type: 'platform' },
      { x: 600, y: 460, w: 140, h: 20, type: 'platform' },
      { x: 780, y: 340, w: 120, h: 20, type: 'platform' },
      { x: 960, y: 440, w: 100, h: 20, type: 'platform' },
      { x: 1100, y: 300, w: 160, h: 20, type: 'platform' },
      { x: 1300, y: 420, w: 120, h: 20, type: 'platform' },
      { x: 1480, y: 340, w: 100, h: 20, type: 'platform' },
      { x: 1640, y: 460, w: 140, h: 20, type: 'platform' },
      { x: 1820, y: 300, w: 160, h: 20, type: 'platform' },
      { x: 2000, y: 420, w: 120, h: 20, type: 'platform' },
      { x: 2200, y: 360, w: 100, h: 20, type: 'platform' },
      { x: 2380, y: 480, w: 120, h: 20, type: 'platform' },
      { x: 2560, y: 380, w: 140, h: 20, type: 'platform' },
      { x: 2760, y: 300, w: 160, h: 20, type: 'platform' },
      { x: 2960, y: 440, w: 200, h: 20, type: 'platform' },
      // Pits (gaps in ground)
      { x: 500, y: 561, w: 80, h: 2, type: 'pit_marker' },
      { x: 1200, y: 561, w: 80, h: 2, type: 'pit_marker' },
      { x: 2100, y: 561, w: 100, h: 2, type: 'pit_marker' },
    ],
    gaps: [
      { x: 500, w: 80 },
      { x: 1200, w: 80 },
      { x: 2100, w: 100 },
    ],
    enemies: [
      { x: 300, type: 'fiscal', speed: 1.5 },
      { x: 700, type: 'periodista', speed: 1.2 },
      { x: 1000, type: 'fiscal', speed: 2 },
      { x: 1400, type: 'juez', speed: 1.0 },
      { x: 1700, type: 'fiscal', speed: 2.2 },
      { x: 2000, type: 'periodista', speed: 1.8 },
      { x: 2300, type: 'fiscal', speed: 2.5 },
      { x: 2600, type: 'juez', speed: 1.5 },
      { x: 2850, type: 'fiscal', speed: 3 },
    ],
    collectibles: [
      220, 440, 620, 800, 1120, 1320, 1660, 1840, 2020, 2220, 2400, 2580, 2780, 2980
    ],
    goalX: 3100,
    length: 3200,
    quote: 'El Congreso aprobó la impunidad total 🏛️',
  },
  {
    name: 'PARAÍSO FISCAL CARIBEÑO',
    bg: ['#001a2e', '#002a3e'],
    platforms: [
      { x: 0, y: 560, w: 3600, h: 40, type: 'ground' },
      { x: 160, y: 440, w: 100, h: 20, type: 'platform' },
      { x: 340, y: 360, w: 120, h: 20, type: 'platform' },
      { x: 560, y: 440, w: 100, h: 20, type: 'platform' },
      { x: 720, y: 300, w: 160, h: 20, type: 'platform' },
      { x: 960, y: 400, w: 120, h: 20, type: 'platform' },
      { x: 1140, y: 320, w: 100, h: 20, type: 'platform' },
      { x: 1320, y: 440, w: 120, h: 20, type: 'platform' },
      { x: 1520, y: 280, w: 180, h: 20, type: 'platform' },
      { x: 1780, y: 380, w: 100, h: 20, type: 'platform' },
      { x: 1960, y: 460, w: 140, h: 20, type: 'platform' },
      { x: 2160, y: 320, w: 120, h: 20, type: 'platform' },
      { x: 2360, y: 420, w: 100, h: 20, type: 'platform' },
      { x: 2540, y: 300, w: 160, h: 20, type: 'platform' },
      { x: 2760, y: 440, w: 120, h: 20, type: 'platform' },
      { x: 2960, y: 360, w: 140, h: 20, type: 'platform' },
      { x: 3180, y: 460, w: 120, h: 20, type: 'platform' },
      { x: 3380, y: 400, w: 180, h: 20, type: 'platform' },
    ],
    gaps: [
      { x: 460, w: 100 },
      { x: 1060, w: 80 },
      { x: 1700, w: 80 },
      { x: 2260, w: 100 },
      { x: 3060, w: 120 },
    ],
    enemies: [
      { x: 250, type: 'fiscal', speed: 1.8 },
      { x: 600, type: 'juez', speed: 1.2 },
      { x: 900, type: 'periodista', speed: 2.0 },
      { x: 1200, type: 'fiscal', speed: 2.5 },
      { x: 1600, type: 'juez', speed: 1.5 },
      { x: 1900, type: 'fiscal', speed: 2.8 },
      { x: 2200, type: 'periodista', speed: 2.2 },
      { x: 2500, type: 'fiscal', speed: 3.0 },
      { x: 2800, type: 'juez', speed: 1.8 },
      { x: 3100, type: 'fiscal', speed: 3.5 },
      { x: 3300, type: 'periodista', speed: 2.5 },
    ],
    collectibles: [
      200, 360, 580, 740, 980, 1160, 1340, 1540, 1800, 1980, 2180, 2380, 2560, 2780, 2980, 3200, 3400
    ],
    goalX: 3500,
    length: 3600,
    quote: 'Escapaste al paraíso fiscal... temporalmente 🏝️',
  },
  {
    name: 'CASA ROSADA DEL CAOS',
    bg: ['#2a0a0a', '#1a0a0a'],
    platforms: [
      { x: 0, y: 560, w: 4000, h: 40, type: 'ground' },
      { x: 100, y: 460, w: 120, h: 20, type: 'platform' },
      { x: 300, y: 380, w: 100, h: 20, type: 'platform' },
      { x: 480, y: 300, w: 120, h: 20, type: 'platform' },
      { x: 680, y: 420, w: 100, h: 20, type: 'platform' },
      { x: 840, y: 320, w: 160, h: 20, type: 'platform' },
      { x: 1080, y: 440, w: 100, h: 20, type: 'platform' },
      { x: 1240, y: 280, w: 180, h: 20, type: 'platform' },
      { x: 1500, y: 380, w: 120, h: 20, type: 'platform' },
      { x: 1680, y: 460, w: 100, h: 20, type: 'platform' },
      { x: 1860, y: 300, w: 160, h: 20, type: 'platform' },
      { x: 2100, y: 420, w: 120, h: 20, type: 'platform' },
      { x: 2280, y: 340, w: 100, h: 20, type: 'platform' },
      { x: 2460, y: 460, w: 140, h: 20, type: 'platform' },
      { x: 2680, y: 320, w: 160, h: 20, type: 'platform' },
      { x: 2900, y: 440, w: 100, h: 20, type: 'platform' },
      { x: 3060, y: 360, w: 120, h: 20, type: 'platform' },
      { x: 3260, y: 280, w: 180, h: 20, type: 'platform' },
      { x: 3500, y: 400, w: 140, h: 20, type: 'platform' },
      { x: 3720, y: 460, w: 120, h: 20, type: 'platform' },
      { x: 3880, y: 380, w: 100, h: 20, type: 'platform' },
    ],
    gaps: [
      { x: 400, w: 80 },
      { x: 800, w: 40 },
      { x: 1180, w: 60 },
      { x: 1780, w: 80 },
      { x: 2380, w: 80 },
      { x: 2800, w: 100 },
      { x: 3180, w: 80 },
      { x: 3640, w: 80 },
    ],
    enemies: [
      { x: 200, type: 'fiscal', speed: 2.0 },
      { x: 450, type: 'juez', speed: 1.5 },
      { x: 700, type: 'fiscal', speed: 2.5 },
      { x: 950, type: 'periodista', speed: 2.2 },
      { x: 1200, type: 'fiscal', speed: 3.0 },
      { x: 1500, type: 'juez', speed: 2.0 },
      { x: 1750, type: 'fiscal', speed: 3.2 },
      { x: 2000, type: 'periodista', speed: 2.8 },
      { x: 2250, type: 'fiscal', speed: 3.5 },
      { x: 2500, type: 'juez', speed: 2.5 },
      { x: 2750, type: 'fiscal', speed: 4.0 },
      { x: 3000, type: 'periodista', speed: 3.0 },
      { x: 3250, type: 'fiscal', speed: 4.2 },
      { x: 3500, type: 'juez', speed: 2.8 },
      { x: 3750, type: 'fiscal', speed: 4.5 },
    ],
    collectibles: [
      120, 320, 500, 700, 860, 1100, 1260, 1520, 1700, 1880, 2120, 2300, 2480, 2700, 2920, 3080, 3280, 3520, 3740, 3900
    ],
    goalX: 3960,
    length: 4000,
    quote: 'Casa Rosada capturada... la justicia llega tarde 🌹',
  },
];

// ===== ENEMY TYPES =====
const ENEMY_TYPES = {
  fiscal: {
    emoji: '👨‍⚖️',
    name: 'FISCAL',
    color: '#4488ff',
    w: 32, h: 40,
    points: 200,
    bounceOff: true,
  },
  periodista: {
    emoji: '📰',
    name: 'PERIODISTA',
    color: '#ff8800',
    w: 32, h: 40,
    points: 100,
    bounceOff: true,
  },
  juez: {
    emoji: '⚖️',
    name: 'JUEZ',
    color: '#ff2244',
    w: 36, h: 48,
    points: 500,
    bounceOff: false, // must avoid!
  },
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
};

let player = null;
let camera = { x: 0 };
let platforms = [];
let enemies = [];
let collectibles = [];
let particles = [];
let specialParticles = [];
let goalReached = false;
let levelData = null;
let animFrame = null;
let lastTime = 0;

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

  // Evita registrar múltiples listeners cada vez que se reinicia una partida.
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

  // Si el canvas se mide mientras la pantalla está oculta, getBoundingClientRect() da 0.
  // Por eso usamos fallback a window y nunca dejamos el canvas en 0x0.
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

// ===== PLAYER =====
function getSafeSpawnY(x = 80, w = 36, h = 44) {
  const ground = platforms.find(p =>
    p.type === 'ground' && x + w > p.x && x < p.x + p.w
  ) || platforms.find(p => p.type === 'ground');

  return ground ? ground.y - h : 400;
}

function getSafeSpawnX(preferredX = 80, w = 36) {
  const ground = platforms.find(p =>
    p.type === 'ground' && preferredX + w > p.x && preferredX < p.x + p.w
  ) || platforms.find(p => p.type === 'ground');

  if (!ground) return preferredX;
  return Math.min(Math.max(preferredX, ground.x + 8), ground.x + ground.w - w - 8);
}

function createPlayer(charData) {
  const startX = getSafeSpawnX(80, 36);
  return {
    x: startX,
    y: getSafeSpawnY(startX, 36, 44),
    w: 36,
    h: 44,
    vx: 0,
    vy: 0,
    onGround: false,
    facingRight: true,
    jumpCount: 0,
    maxJumps: 2,
    char: charData,
    animFrame: 0,
    animTimer: 0,
    walkCycle: 0,
  };
}

// ===== LEVEL INIT =====
function initLevel(levelIdx) {
  levelData = LEVELS[levelIdx];
  camera.x = 0;
  goalReached = false;

  // Platforms (only non-gaps)
  platforms = levelData.platforms.filter(p => p.type !== 'pit_marker');

  // Modify ground to have gaps
  const groundPlatforms = [];
  const groundBase = platforms.find(p => p.type === 'ground');
  if (groundBase) {
    const gaps = levelData.gaps || [];
    let cursor = groundBase.x;
    const segments = [];
    gaps.forEach(gap => {
      if (gap.x > cursor) {
        segments.push({ x: cursor, y: groundBase.y, w: gap.x - cursor, h: groundBase.h, type: 'ground' });
      }
      cursor = gap.x + gap.w;
    });
    segments.push({ x: cursor, y: groundBase.y, w: groundBase.w - (cursor - groundBase.x), h: groundBase.h, type: 'ground' });

    platforms = platforms.filter(p => p.type !== 'ground');
    platforms = [...segments, ...platforms];
  }

  // Enemies
  enemies = levelData.enemies.map(e => {
    const type = ENEMY_TYPES[e.type];
    return {
      x: e.x,
      y: 0,
      w: type.w,
      h: type.h,
      type: e.type,
      typeData: type,
      speed: e.speed,
      dir: 1,
      alive: true,
      onGround: false,
      vy: 0,
      stunned: 0,
      animTimer: 0,
    };
  });

  // Snap enemies to ground
  enemies.forEach(enemy => {
    enemy.y = levelData.platforms[0].y - enemy.h;
  });

  // Collectibles
  collectibles = levelData.collectibles.map((cx, i) => ({
    x: cx,
    y: 500,
    w: 24,
    h: 24,
    collected: false,
    id: i,
    bobOffset: Math.random() * Math.PI * 2,
  }));

  // Snap collectibles to platforms
  collectibles.forEach(c => {
    const p = platforms.find(pl => pl.x <= c.x && pl.x + pl.w >= c.x && pl.type !== 'ground');
    if (p) {
      c.y = p.y - c.h - 8;
    } else {
      const g = platforms.find(pl => pl.x <= c.x && pl.x + pl.w >= c.x && pl.type === 'ground');
      if (g) c.y = g.y - c.h - 8;
    }
  });

  particles = [];
  specialParticles = [];
}

// ===== PHYSICS =====
function updatePlayer(dt) {
  if (!player) return;

  const char = player.char;
  const speed = char.speed;
  const jumpForce = char.jumpForce;

  // Horizontal movement
  if (keys.left) {
    player.vx = -speed * 60 * dt;
    player.facingRight = false;
  } else if (keys.right) {
    player.vx = speed * 60 * dt;
    player.facingRight = true;
  } else {
    player.vx *= 0.7;
  }

  // Jump
  if (justPressed.up && player.jumpCount < player.maxJumps) {
    player.vy = -jumpForce;
    player.jumpCount++;
    justPressed.up = false;
    spawnParticle(player.x + player.w / 2, player.y + player.h, '💨', 6);
  }

  // Special
  if (justPressed.space && gameState.specialCooldown <= 0) {
    activateSpecial();
    justPressed.space = false;
  }

  // Gravity
  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL);

  // Move X
  player.x += player.vx;
  player.x = Math.max(0, player.x);

  // Collide X with platforms
  platforms.forEach(p => {
    if (rectsOverlap(player, p)) {
      if (player.vx > 0) player.x = p.x - player.w;
      else if (player.vx < 0) player.x = p.x + p.w;
      player.vx = 0;
    }
  });

  // Move Y
  player.y += player.vy;
  player.onGround = false;

  // Collide Y with platforms
  platforms.forEach(p => {
    if (rectsOverlap(player, p)) {
      if (player.vy > 0 && player.y + player.h - player.vy <= p.y + 5) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.jumpCount = 0;
      } else if (player.vy < 0) {
        player.y = p.y + p.h;
        player.vy = 0;
      }
    }
  });

  // Fall death
  if (player.y > levelData.platforms[0].y + 200) {
    loseLife('Caíste al vacío... como las causas judiciales ⚖️');
    return;
  }

  // Special cooldown
  if (gameState.specialCooldown > 0) gameState.specialCooldown -= dt;
  if (gameState.invincible > 0) gameState.invincible -= dt;

  // Walk animation
  player.animTimer += dt;
  if (player.animTimer > 0.12) {
    player.animTimer = 0;
    if (Math.abs(player.vx) > 0.5) player.walkCycle = (player.walkCycle + 1) % 4;
  }

  // Camera
  camera.x = Math.max(0, Math.min(player.x - CW / 3, levelData.length - CW));

  // Enemy collision
  if (gameState.invincible <= 0 && !gameState.specialActive) {
    enemies.forEach(enemy => {
      if (!enemy.alive || enemy.stunned > 0) return;
      if (rectsOverlap(player, enemy)) {
        // Stomp?
        if (player.vy > 0 && player.y + player.h < enemy.y + 20) {
          if (enemy.typeData.bounceOff) {
            stompEnemy(enemy);
            player.vy = -10;
          } else {
            loseLife('El juez no se deja pisar 👨‍⚖️');
          }
        } else {
          loseLife();
        }
      }
    });
  }

  // Collectible pickup
  collectibles.forEach(c => {
    if (!c.collected && rectsOverlap(player, c)) {
      c.collected = true;
      gameState.score += 100;
      updateHUD();
      spawnParticle(c.x + 12, c.y, char.collectibleEmoji, 8);
      spawnParticle(c.x + 12, c.y - 10, '+100', 6);
    }
  });

  // Goal
  if (player.x + player.w >= levelData.goalX && !goalReached) {
    goalReached = true;
    levelComplete();
  }
}

function updateEnemies(dt) {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    if (enemy.stunned > 0) {
      enemy.stunned -= dt;
      return;
    }

    enemy.animTimer += dt;

    // Move
    enemy.x += enemy.speed * enemy.dir * 60 * dt;
    enemy.vy = Math.min(enemy.vy + GRAVITY, MAX_FALL);
    enemy.y += enemy.vy;

    // Ground collision
    let onGround = false;
    platforms.forEach(p => {
      if (rectsOverlap(enemy, p)) {
        if (enemy.vy > 0) {
          enemy.y = p.y - enemy.h;
          enemy.vy = 0;
          onGround = true;
        }
      }
    });

    if (onGround) {
      // Reverse at edges and walls
      const checkX = enemy.dir > 0 ? enemy.x + enemy.w + 2 : enemy.x - 2;
      const checkY = enemy.y + enemy.h + 2;
      const hasPlatformAhead = platforms.some(p =>
        p.x <= checkX && p.x + p.w >= checkX && p.y >= enemy.y + enemy.h && p.y < enemy.y + enemy.h + 20
      );
      if (!hasPlatformAhead) enemy.dir *= -1;
    }

    // Reverse at level bounds
    if (enemy.x < 0 || enemy.x + enemy.w > levelData.length) enemy.dir *= -1;

    // Fall into pit = remove
    if (enemy.y > levelData.platforms[0].y + 200) enemy.alive = false;
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

// ===== SPECIAL ABILITY =====
function activateSpecial() {
  const char = player.char;
  gameState.specialCooldown = 8;
  gameState.specialActive = true;

  switch(char.id) {
    case 'milei':
      // Conan ghost: stun all enemies on screen
      enemies.forEach(e => {
        if (e.alive && e.x > camera.x - 50 && e.x < camera.x + CW + 50) {
          e.stunned = 3;
        }
      });
      for(let i=0; i<12; i++) spawnParticle(player.x + Math.random()*40, player.y - Math.random()*60, '🐕', 6 + Math.random()*4);
      showToast('👻 ¡CONAN FANTASMA! Los fiscales huyen del mastín muerto');
      break;

    case 'karina':
      // Freeze all nearby enemies
      enemies.forEach(e => {
        const dist = Math.abs(e.x - player.x);
        if (dist < 300 && e.alive) e.stunned = 4;
      });
      for(let i=0; i<10; i++) spawnParticle(player.x + Math.random()*80, player.y - Math.random()*40, '🌹', 5 + Math.random()*4);
      showToast('🌹 ¡RAMO DE ROSAS! Los fiscales caen rendidos');
      break;

    case 'adorni':
      // Speed boost + jump boost
      player.vy = -20;
      player.vx = 25;
      for(let i=0; i<8; i++) spawnParticle(player.x + Math.random()*40, player.y + Math.random()*20, '✈️', 8 + Math.random()*4);
      showToast('✈️ ¡FIRST CLASS! Adorni escapa hacia Aruba');
      break;

    case 'espert':
      // Money attack: collect nearby collectibles
      collectibles.forEach(c => {
        if (!c.collected) {
          const dist = Math.abs(c.x - player.x);
          if (dist < 400) {
            c.collected = true;
            gameState.score += 200;
            spawnParticle(c.x, c.y, '💰', 7);
          }
        }
      });
      updateHUD();
      for(let i=0; i<8; i++) spawnParticle(player.x + Math.random()*60, player.y - Math.random()*50, '💰', 6 + Math.random()*3);
      showToast('💰 ¡200 MIL VERDES! Era consultoría, lo juro');
      break;

    case 'spagnuolo':
      // Silence: freeze screen briefly + score boost
      gameState.invincible = 5;
      gameState.score += 500;
      updateHUD();
      for(let i=0; i<10; i++) spawnParticle(player.x + Math.random()*40, player.y - Math.random()*60, '🤫', 6 + Math.random()*4);
      showToast('🤫 ¡SILENCIO TOTAL! Me niego a declarar. +500 CAUSA$');
      break;

    case 'novelli':
      // Delete chats: enemies disappear from screen
      enemies.forEach(e => {
        if (e.x > camera.x && e.x < camera.x + CW) e.alive = false;
      });
      for(let i=0; i<10; i++) spawnParticle(player.x + Math.random()*40, player.y - Math.random()*50, '📱', 6 + Math.random()*4);
      showToast('📱 ¡BORRAR CHATS! Las pruebas desaparecieron... ¿cuáles pruebas?');
      break;
  }

  setTimeout(() => { gameState.specialActive = false; }, 500);
}

// ===== ENEMY INTERACTION =====
function stompEnemy(enemy) {
  enemy.alive = false;
  gameState.score += enemy.typeData.points;
  updateHUD();
  spawnParticle(enemy.x + enemy.w/2, enemy.y, '⭐', 10);
  spawnParticle(enemy.x + enemy.w/2, enemy.y - 10, '+' + enemy.typeData.points, 6);
  showToast('💥 ¡' + enemy.typeData.name + ' eliminado! +' + enemy.typeData.points + ' causa$');
}

// ===== LIFE MANAGEMENT =====
function loseLife(msg) {
  if (gameState.invincible > 0) return;
  gameState.lives--;
  gameState.invincible = 2;
  updateHUD();
  spawnParticle(player.x + player.w/2, player.y, '💀', 12);

  if (gameState.lives <= 0) {
    setTimeout(() => gameOver(msg), 400);
  } else {
    // Respawn seguro: no reaparece dentro de un hueco ni fuera del área visible.
    const respawnX = getSafeSpawnX(Math.max(80, camera.x + 80), player.w);
    player.x = respawnX;
    player.y = getSafeSpawnY(respawnX, player.w, player.h);
    player.vx = 0;
    player.vy = 0;
    showToast('💀 ' + (msg || 'Te atrapó la justicia... +' + gameState.lives + ' vidas restantes'));
  }
}

// ===== LEVEL COMPLETE =====
function levelComplete() {
  const bonus = 2000 + (gameState.level + 1) * 1000;
  gameState.score += bonus;
  updateHUD();
  cancelAnimationFrame(animFrame);
  showScreen('screen-win');
  document.getElementById('win-message').textContent = levelData.quote;
  document.getElementById('win-bonus').textContent = '+' + bonus + ' CAUSA$';
}

// ===== GAME OVER =====
function gameOver(msg) {
  cancelAnimationFrame(animFrame);
  showScreen('screen-gameover');
  document.getElementById('go-score-val').textContent = String(gameState.score).padStart(6, '0');
  document.getElementById('go-subtitle').textContent = msg || 'EL FISCAL TE ATRAPÓ';

  const quotes = gameState.character ? CHARACTERS[gameState.character].deathQuotes : GAME_QUOTES;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('go-quote').textContent = quote;

  // Auto show save score section
  const savedScore = gameState.score;
  document.getElementById('btn-save-score').style.display = 'block';
  document.getElementById('btn-save-score').dataset.score = savedScore;
}

// ===== PARTICLES =====
function spawnParticle(x, y, text, size) {
  particles.push({
    x: x - camera.x,
    y,
    text,
    size,
    speed: 80 + Math.random() * 60,
    vx: (Math.random() - 0.5) * 40,
    life: 0.8 + Math.random() * 0.4,
    maxLife: 1.2,
    alpha: 1,
  });
}

// ===== DRAW =====
function drawBackground() {
  const [c1, c2] = levelData.bg;
  const grad = ctx.createLinearGradient(0, 0, 0, CH);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CW, CH);

  // Pixel art clouds / decorations
  ctx.font = '28px serif';
  ctx.globalAlpha = 0.15;
  const cloudOffsets = [100, 350, 600, 900, 1200, 1600, 2000, 2400, 2800, 3200, 3600];
  cloudOffsets.forEach(ox => {
    const sx = ox - camera.x;
    if (sx > -100 && sx < CW + 100) {
      ctx.fillText('☁️', sx, 80 + Math.sin(ox * 0.01) * 20);
    }
  });
  ctx.globalAlpha = 1;
}

function drawPlatforms() {
  platforms.forEach(p => {
    const sx = p.x - camera.x;
    if (sx + p.w < 0 || sx > CW) return;

    const isGround = p.type === 'ground';
    const color = player?.char?.platformColor || '#4488ff';

    // Main block
    ctx.fillStyle = isGround ? '#2a1a0a' : color + '44';
    ctx.fillRect(sx, p.y, p.w, p.h);

    // Top edge (bright)
    ctx.fillStyle = isGround ? '#6a3a1a' : color + 'cc';
    ctx.fillRect(sx, p.y, p.w, isGround ? 8 : 4);

    // Pixel pattern
    if (!isGround) {
      ctx.fillStyle = color + '33';
      for (let bx = sx; bx < sx + p.w; bx += 20) {
        ctx.fillRect(bx, p.y + 4, 8, p.h - 4);
      }
    } else {
      // Ground texture
      ctx.fillStyle = '#8b4513';
      for (let bx = sx; bx < sx + p.w; bx += 40) {
        ctx.fillRect(bx, p.y + 8, 38, p.h - 8);
      }
      ctx.fillStyle = '#6a3a1a';
      for (let bx = sx + 20; bx < sx + p.w; bx += 40) {
        ctx.fillRect(bx, p.y + 8, 38, p.h - 8);
      }
    }
  });
}

function drawEnemies() {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;
    const sx = enemy.x - camera.x;
    if (sx + enemy.w < 0 || sx > CW) return;

    const t = enemy.typeData;
    ctx.save();

    if (enemy.stunned > 0) ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.02) * 0.5;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(sx + 4, enemy.y + enemy.h - 4, enemy.w - 8, 6);

    // Body
    ctx.fillStyle = t.color + '33';
    ctx.fillRect(sx, enemy.y, enemy.w, enemy.h);
    ctx.strokeStyle = t.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, enemy.y, enemy.w, enemy.h);

    // Emoji
    ctx.font = (enemy.h * 0.7) + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.emoji, sx + enemy.w / 2, enemy.y + enemy.h * 0.75);

    // Name tag
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = t.color;
    ctx.fillText(t.name, sx + enemy.w / 2, enemy.y - 4);

    ctx.restore();
  });
}

function drawCollectibles(time) {
  if (!player) return;
  const char = player.char;
  collectibles.forEach(c => {
    if (c.collected) return;
    const sx = c.x - camera.x;
    if (sx + c.w < 0 || sx > CW) return;

    const bob = Math.sin(time * 0.003 + c.bobOffset) * 4;

    // Glow
    ctx.save();
    ctx.shadowColor = char.platformColor || '#ffd700';
    ctx.shadowBlur = 12;
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText(char.collectibleEmoji, sx + c.w / 2, c.y + c.h - 2 + bob);
    ctx.restore();

    // Ring animation
    ctx.strokeStyle = (char.platformColor || '#ffd700') + '66';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx + c.w / 2, c.y + c.h / 2 + bob, c.w / 2 + Math.sin(time * 0.005) * 3, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawGoal() {
  const sx = levelData.goalX - camera.x;
  if (sx + 60 < 0 || sx > CW) return;

  // Flag pole
  ctx.fillStyle = '#888';
  ctx.fillRect(sx, levelData.platforms[0].y - 200, 4, 200);

  // Flag
  ctx.fillStyle = '#ffd700';
  ctx.font = '24px serif';
  ctx.textAlign = 'left';
  ctx.fillText('🏁', sx + 4, levelData.platforms[0].y - 170);

  // Label
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'center';
  ctx.fillText('META', sx + 14, levelData.platforms[0].y - 210);
}

function drawPlayer(time) {
  if (!player) return;
  const char = player.char;
  const sx = player.x - camera.x;

  ctx.save();

  // Invincibility flicker
  if (gameState.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(sx + 6, player.y + player.h - 4, player.w - 12, 6);

  // Body box
  ctx.fillStyle = char.color + '22';
  ctx.fillRect(sx, player.y, player.w, player.h);

  // Pixel walk animation offset
  const wobble = player.onGround && Math.abs(player.vx) > 0.5 ? Math.sin(player.walkCycle * Math.PI / 2) * 2 : 0;

  // Flip for direction
  if (!player.facingRight) {
    ctx.translate(sx + player.w / 2, player.y + player.h / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(sx + player.w / 2), -(player.y + player.h / 2));
  }

  // Character emoji
  ctx.font = (player.h * 0.7) + 'px serif';
  ctx.textAlign = 'center';
  ctx.fillText(char.emoji, sx + player.w / 2, player.y + player.h - 4 + wobble);

  ctx.restore();

  // Special cooldown indicator
  if (gameState.specialCooldown > 0) {
    const pct = gameState.specialCooldown / 8;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(sx, player.y - 10, player.w, 4);
    ctx.fillStyle = char.color;
    ctx.fillRect(sx, player.y - 10, player.w * (1 - pct), 4);
  }

  // Special ready indicator
  if (gameState.specialCooldown <= 0) {
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ff88';
    ctx.textAlign = 'center';
    const indicator = '⚡' + char.specialPower.split(' ')[0];
    ctx.fillText('ESPECIAL ✓', sx + player.w / 2, player.y - 14);
  }
}

function drawParticles() {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.font = p.size + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  });
}

function drawLevelInfo(time) {
  // Level name top center
  ctx.save();
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.textAlign = 'center';
  ctx.fillText('NIVEL ' + (gameState.level + 1) + ' — ' + levelData.name, CW / 2, CH - 12);
  ctx.restore();

  // Special ability hint
  ctx.save();
  ctx.font = '7px "Press Start 2P", monospace';
  ctx.fillStyle = 'rgba(255,215,0,0.5)';
  ctx.textAlign = 'left';
  ctx.fillText('[SPACE] ' + player?.char?.specialPower, 8, CH - 12);
  ctx.restore();
}

// ===== GAME LOOP =====
function gameLoop(timestamp) {
  if (!gameState.running) return;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  // Clear
  ctx.clearRect(0, 0, CW, CH);

  drawBackground();
  drawPlatforms();
  drawGoal();
  drawCollectibles(timestamp);
  drawEnemies();
  drawPlayer(timestamp);
  drawParticles();
  drawLevelInfo(timestamp);

  updatePlayer(dt);
  updateEnemies(dt);
  updateParticles(dt);

  // Clear just-pressed
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

  // Mobile
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
}

// ===== START GAME =====
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
  };

  // Primero se muestra la pantalla. Si medimos el canvas oculto, queda en 0x0 y el juego se ve negro.
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
    // Victory! Loop with increased difficulty
    gameState.level = 0;
    gameState.score += 5000;
  }

  showScreen('screen-game');
  resizeCanvas();
  initLevel(gameState.level);

  const respawnX = getSafeSpawnX(80, player?.w || 36);
  player.x = respawnX;
  player.y = getSafeSpawnY(respawnX, player?.w || 36, player?.h || 44);
  player.vx = 0;
  player.vy = 0;
  gameState.specialCooldown = 0;
  gameState.invincible = 1;

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
  const banner = document.createElement('div');
  banner.className = 'level-banner';
  banner.innerHTML = `
    <h2>NIVEL ${gameState.level + 1}</h2>
    <p>${LEVELS[gameState.level].name}</p>
  `;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 2100);
}

// ===== COLLISION =====
function rectsOverlap(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2500);
}

// Init controls on load
document.addEventListener('DOMContentLoaded', () => {
  setupControls();
  initCanvas();
});
