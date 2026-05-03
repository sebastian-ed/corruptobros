// ============================================
// CORRUPTO BROS — Supabase Integration
// ============================================
// INSTRUCCIONES DE CONFIGURACIÓN:
// 1. Crear proyecto en https://supabase.com
// 2. Reemplazar SUPABASE_URL y SUPABASE_ANON_KEY
// 3. Ejecutar el SQL de setup (ver README.md)
// ============================================

const SUPABASE_URL = 'https://fjcsdmxjnomokwiikkmb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IUTyR9TPQuTYvyTKQhW8Vg_-7XWILpW';

// ============================================
// SETUP SQL (ejecutar en Supabase SQL Editor):
//
// CREATE TABLE scores (
//   id BIGSERIAL PRIMARY KEY,
//   player_name TEXT NOT NULL,
//   character_id TEXT NOT NULL,
//   character_emoji TEXT NOT NULL,
//   score INTEGER NOT NULL,
//   level INTEGER NOT NULL DEFAULT 1,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Allow all reads" ON scores FOR SELECT USING (true);
// CREATE POLICY "Allow all inserts" ON scores FOR INSERT WITH CHECK (true);
// CREATE INDEX idx_scores_score ON scores(score DESC);
// ============================================

class SupabaseDB {
  constructor() {
    this.url = SUPABASE_URL;
    this.key = SUPABASE_ANON_KEY;
    this.configured = !this.url.includes('TU_PROYECTO');
  }

  async request(path, options = {}) {
    if (!this.configured) {
      console.warn('⚠️ Supabase no configurado. Usando localStorage como fallback.');
      return null;
    }
    try {
      const res = await fetch(`${this.url}/rest/v1/${path}`, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Prefer': options.prefer || 'return=minimal',
          ...options.headers,
        },
        ...options,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (e) {
      console.error('Supabase error:', e);
      return null;
    }
  }

  async saveScore(playerName, characterId, characterEmoji, score, level) {
    // Try Supabase
    if (this.configured) {
      const result = await this.request('scores', {
        method: 'POST',
        prefer: 'return=representation',
        body: JSON.stringify({
          player_name: playerName.toUpperCase().slice(0, 20),
          character_id: characterId,
          character_emoji: characterEmoji,
          score: Math.floor(score),
          level: Math.floor(level),
        }),
      });
      if (result) return result;
    }

    // Fallback to localStorage
    const local = this._getLocalScores();
    local.push({
      id: Date.now(),
      player_name: playerName.toUpperCase().slice(0, 20),
      character_id: characterId,
      character_emoji: characterEmoji,
      score: Math.floor(score),
      level: Math.floor(level),
      created_at: new Date().toISOString(),
    });
    local.sort((a, b) => b.score - a.score);
    localStorage.setItem('corrupto_scores', JSON.stringify(local.slice(0, 50)));
    return local;
  }

  async getTopScores(limit = 20) {
    if (this.configured) {
      const result = await this.request(
        `scores?select=*&order=score.desc&limit=${limit}`,
        { headers: { 'Prefer': 'return=representation' } }
      );
      if (result) return result;
    }

    // Fallback to localStorage
    return this._getLocalScores().slice(0, limit);
  }

  _getLocalScores() {
    try {
      return JSON.parse(localStorage.getItem('corrupto_scores') || '[]');
    } catch {
      return [];
    }
  }
}

const db = new SupabaseDB();
