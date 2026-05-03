// ============================================
// CORRUPTO BROS — UI & Screen Management
// ============================================

let currentScreen = 'screen-title';
let pendingScore = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  currentScreen = id;
  if (id !== 'screen-game' && animFrame) {
    cancelAnimationFrame(animFrame);
    gameState.running = false;
  }
}

// ===== TITLE SCREEN =====
document.getElementById('btn-start')?.addEventListener('click', () => {
  buildCharacterSelect();
  showScreen('screen-select');
});

document.getElementById('btn-scores')?.addEventListener('click', async () => {
  showScreen('screen-scores');
  document.getElementById('btn-save-score').style.display = 'none';
  await loadScores();
});

document.getElementById('btn-manual')?.addEventListener('click', () => {
  buildManual();
  showScreen('screen-manual');
});

// ===== CHARACTER SELECT =====
function buildCharacterSelect() {
  const grid = document.getElementById('characters-grid');
  grid.innerHTML = '';
  Object.values(CHARACTERS).forEach(char => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.innerHTML = `
      <div class="char-emoji">${char.emoji}</div>
      <div class="char-name">${char.name}</div>
      <div class="char-title">${char.title}</div>
      <div class="char-causa">${char.causa}</div>
      <div class="char-stat">
        ⚡ VEL: ${char.stats.velocidad}/10
        🦘 SALTO: ${char.stats.salto}/10
        ✨ POD: ${char.stats.especial}/10
      </div>
      <div class="char-stat" style="color:#aaa; font-size:0.8em;">
        ${char.specialPower}
      </div>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      setTimeout(() => startGame(char.id), 200);
    });
    grid.appendChild(card);
  });
}

document.getElementById('btn-back-select')?.addEventListener('click', () => showScreen('screen-title'));

// ===== MANUAL =====
function buildManual() {
  const container = document.getElementById('manual-content');
  container.innerHTML = '';
  MANUAL_DATA.forEach(item => {
    const card = document.createElement('div');
    card.className = 'manual-card';
    card.innerHTML = `
      <h3>${item.char}</h3>
      <span class="causa-tag">${item.causa}</span>
      <p>${item.text}</p>
    `;
    container.appendChild(card);
  });
}

document.getElementById('btn-back-manual')?.addEventListener('click', () => showScreen('screen-title'));

// ===== SCORES =====
async function loadScores() {
  const tbody = document.getElementById('scores-tbody');
  tbody.innerHTML = '<tr><td colspan="5">Cargando scores...</td></tr>';
  try {
    const scores = await db.getTopScores(20);
    if (!scores || scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="color:#888">Nadie todavía. ¡Sé el primer corrupto!</td></tr>';
      return;
    }
    tbody.innerHTML = scores.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(s.player_name)}</td>
        <td>${s.character_emoji || '🦁'} ${escapeHtml(s.character_id?.toUpperCase() || '')}</td>
        <td>${String(s.score).padStart(6, '0')}</td>
        <td>${s.level || 1}</td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:#f44">Error cargando scores</td></tr>';
  }
}

document.getElementById('btn-back-scores')?.addEventListener('click', () => showScreen('screen-title'));

document.getElementById('btn-share')?.addEventListener('click', () => {
  const score = pendingScore || gameState.score || 0;
  const char = gameState.character ? CHARACTERS[gameState.character]?.name : 'un corrupto argentino';
  const text = `🎮 Jugué CORRUPTO BROS y recaudé ${score} CAUSA$ como ${char}! 🦁💰\n¡La Argentina necesita más fiscales!\n\n#CorruptoBros #Argentina #LaJusticiaLlega`;

  if (navigator.share) {
    navigator.share({ title: 'Corrupto Bros', text }).catch(() => copyToClipboard(text));
  } else {
    copyToClipboard(text);
  }
});

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).then(() => {
    showToast('📋 ¡Texto copiado! Pegalo en tus redes 🇦🇷');
  }).catch(() => {
    showToast('📋 Copiá este texto:\n' + text.slice(0, 100) + '...');
  });
}

// ===== SAVE SCORE FLOW =====
document.getElementById('btn-save-score')?.addEventListener('click', async () => {
  const nameInput = document.getElementById('player-name-input');
  const name = nameInput.value.trim() || 'ANÓNIMO';
  const score = gameState.score;
  const char = gameState.character ? CHARACTERS[gameState.character] : null;

  document.getElementById('btn-save-score').textContent = '⏳ GUARDANDO...';
  document.getElementById('btn-save-score').disabled = true;

  await db.saveScore(name, char?.id || 'unknown', char?.emoji || '🦁', score, gameState.level + 1);
  pendingScore = score;

  document.getElementById('btn-save-score').textContent = '✅ ¡GUARDADO!';
  setTimeout(() => {
    document.getElementById('btn-save-score').style.display = 'none';
    document.getElementById('btn-save-score').disabled = false;
    document.getElementById('btn-save-score').textContent = '💾 GUARDAR PUNTAJE';
  }, 1500);

  showToast('✅ Puntaje guardado en la tabla de corruptos!');
  await loadScores();
});

// ===== GAME OVER BUTTONS =====
document.getElementById('btn-retry')?.addEventListener('click', () => {
  if (gameState.character) startGame(gameState.character);
  else showScreen('screen-select');
});

document.getElementById('btn-go-scores')?.addEventListener('click', async () => {
  showScreen('screen-scores');
  document.getElementById('btn-save-score').style.display = 'block';
  await loadScores();
});

document.getElementById('btn-go-title')?.addEventListener('click', () => showScreen('screen-title'));

// ===== WIN BUTTONS =====
document.getElementById('btn-next-level')?.addEventListener('click', () => {
  nextLevel();
});

// ===== HELPERS =====
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Show title on load
document.addEventListener('DOMContentLoaded', () => {
  showScreen('screen-title');

  // Animate title characters
  document.querySelectorAll('.char-preview').forEach((el, i) => {
    const chars = Object.values(CHARACTERS);
    const char = chars[i];
    if (char) {
      el.title = char.name + '\n' + char.causa;
    }
  });
});

// Keyboard ESC to go back
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (currentScreen === 'screen-game') {
      gameState.running = false;
      cancelAnimationFrame(animFrame);
      showScreen('screen-title');
    }
  }
});
